---
categories: Code
date: 2019-08-30T01:00:00Z
tags:
- Jenkins
- Groovy
series: "Engineering Efficiency"
title: Jenkins Pipeline 介绍
url: /2019/08/30/jenkins-pipeline-intro/
---

前一段时间推动整个 Team 都转向了 Go Modules，最近一段时间的工作主要是在推动自动化构建与测试。我们最后选定的方案是 `Jenkins` + `Multibranch Pipelines`，本文将会简单介绍一下 Jenkins Pipeline 以及常用的技巧。

## Pipeline 是什么

Jenkins Pipeline 实际上是基于 Groovy 实现的 CI/CD 领域特定语言（DSL），主要分为两类，一类叫做 `Declarative Pipeline`，一类叫做 `Scripted Pipeline`。

`Declarative Pipeline` 体验上更接近于我们熟知的 `travis CI` 的 `travis.yml`，通过声明自己要做的事情来规范流程，形如：

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                //
            }
        }
        stage('Test') {
            steps {
                //
            }
        }
        stage('Deploy') {
            steps {
                //
            }
        }
    }
}
```

而 `Scripted Pipeline` 则是旧版本中 Jenkins 支持的 Pipeline 模式，主要是写一些 groovy 的代码来制定流程：

```groovy
node {  
    stage('Build') {
        //
    }
    stage('Test') {
        //
    }
    stage('Deploy') {
        //
    }
}
```

一般情况下声明式的流水线已经可以满足我们的需要，只有在复杂的情况下才会需要脚本式流水线的参与。

过去大家经常在 Jenkins 的界面上直接写脚本来实现自动化，但是现在更鼓励大家通过在项目中增加 `Jenkinsfile` 的方式把流水线固定下来，实现 `Pipeline As Code`，Jenkins 的 Pipeline 插件将会自动发现并执行它。

## 语法

`Declarative Pipeline` 最外层有个 `pipeline` 表明它是一个声明式流水线，下面会有 4 个主要的部分：
`agent`，`post`，`stages`，`steps`，我会逐一介绍一下。

### Agent

`agent` 主要用于描述整个 Pipeline 或者指定的 Stage 由什么规则来选择节点执行。Pipeline 级别的 agent 可以视为 Stage 级别的默认值，如果 stage 中没有指定，将会使用与 Pipeline 一致的规则。在最新的 Jenkins 版本中，可以支持指定任意节点(`any`)，不指定(`none`)，标签(`label`)，节点(`node`)，`docker`，`dockerfile` 和 `kubernetes` 等，具体的配置细节可以查看文档，下面是一个使用 docker 的样例：

```groovy
agent {
    docker {
        image 'myregistry.com/node'
        label 'my-defined-label'
        registryUrl 'https://myregistry.com/'
        registryCredentialsId 'myPredefinedCredentialsInJenkins'
        args '-v /tmp:/tmp'
    }
}
```

Tips:

- 如果 Pipeline 选择了 none，那么 stage 必须要指定一个有效的 agent，否则无法执行
- Jenkins 总是会使用 master 来执行 scan multibranch 之类的操作，即使 master 配置了 0 executors
- agent 指定的是规则而不是具体的节点，如果 stage 各自配置了自己的 agent，需要注意是不是在同一个节点执行的

### Stages && Stage

Stages 是 Pipeline 中最主要的组成部分，Jenkins 将会按照 Stages 中描述的顺序从上往下的执行。Stages 中可以包括任意多个 Stage，而 Stage 与 Stages 又能互相嵌套，除此以外还有 `parallel` 指令可以让内部的 Stage 并行运行。实际上可以把 Stage 当作最小单元，Stages 指定的是顺序运行，而 parallel 指定的是并行运行。

接下来的这个 case 很好的说明了这一点：

```groovy
pipeline {
    agent none
    stages {
        stage('Sequential') {
            stages {
                stage('In Sequential 1') {
                    steps {
                        echo "In Sequential 1"
                    }
                }
                stage('In Sequential 2') {
                    steps {
                        echo "In Sequential 2"
                    }
                }
                stage('Parallel In Sequential') {
                    parallel {
                        stage('In Parallel 1') {
                            steps {
                                echo "In Parallel 1"
                            }
                        }
                        stage('In Parallel 2') {
                            steps {
                                echo "In Parallel 2"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

除了指定 Stage 之间的顺序关系之外，我们还可以通过 `when` 来指定某个 Stage 指定与否：比如要配置只有在 Master 分支上才执行 push，其他分支上都只运行 build

```groovy
stages {
  stage('Build') {
    when {
      not { branch 'master' }
    }
    steps {
      sh './scripts/run.py build'
    }
  }
  stage('Run') {
    when {
      branch 'master'
    }
    steps {
      sh './scripts/run.py push'
    }
  }
}
```

还能在 Stage 的级别设置 `environment`，这些就不展开了，文档里有更详细的描述。

### Steps

`steps` 是 Pipeline 中最核心的部分，每个 Stage 都需要指定 Steps。Steps 内部可以执行一系列的操作，任意操作执行出错都会返回错误。完整的 Steps 操作列表可以参考 [Pipeline Steps Reference](https://jenkins.io/doc/pipeline/steps/)，这里只说一些使用时需要注意的点。

- groovy 语法中有不同的字符串类型，其中 `'abc'` 是 Plain 字符串，不会转义 `${WROKSPACE}` 这样的变量，而 `"abc"` 会做这样的转换。此外还有 `''' xxx '''` 支持跨行字符串，`"""` 同理。
- 调用函数的 `()` 可以省略，使得函数调用形如 `updateGitlabCommitStatus name: 'build', state: 'success'`，通过 `,` 来分割不同的参数，支持换行。
- 可以在声明式流水线中通过 `script` 来插入一段 groovy 脚本

### Post

`post` 部分将会在 pipeline 的最后执行，经常用于一些测试完毕后的清理和通知操作。文档中给出了一系列的情况，比较常用的是 `always`，`success` 和 `failure`。

比如说下面的脚本将会在成功和失败的时候更新 gitlab 的状态，在失败的时候发送通知邮件：

```groovy
post {
  failure {
    updateGitlabCommitStatus name: 'build', state: 'failed'
    emailext body: '$DEFAULT_CONTENT', recipientProviders: [culprits()], subject: '$DEFAULT_SUBJECT'
  }
  success {
    updateGitlabCommitStatus name: 'build', state: 'success'
  }
}
```

每个状态其实都相当于于一个 `steps`，都能够执行一系列的操作，不同状态的执行顺序是事先规定好的，就是文档中列出的顺序。

## Shared Libraries

同一个 Team 产出的不同项目往往会有着相似的流程，比如 golang 的大部分项目都会执行同样的命令。这就导致了人们经常需要在不同的项目间复制同样的流程，而 Shared Libraries 就解决了这个问题。通过在 Pipeline 中引入共享库，把常用的流程抽象出来变成一个的指令，简化了大量重复的操作。

在配置好 lib 之后，Jenkins 会在每个 Pipeline 启动前去检查 lib 是否更新并 pull 到本地，根据配置决定是否直接加载。

所有的 Shared Libraries 都要遵循相同的项目结构：

```
(root)
+- src                     # Groovy source files
|   +- org
|       +- foo
|           +- Bar.groovy  # for org.foo.Bar class
+- vars
|   +- foo.groovy          # for global 'foo' variable
|   +- foo.txt             # help for 'foo' variable
+- resources               # resource files (external libraries only)
|   +- org
|       +- foo
|           +- bar.json    # static helper data for org.foo.Bar
```

目前我们的使用比较低级，所以只用到了 `vars` 来存储全局的变量。

vars 下的每一个 `foo.groovy` 文件都是一个独立的 namespace，在 Pipeline 中可以以 `foo.XXX` 的形式来导入。比如我们有 `vars/log.groovy`：

```groovy
def info(message) {
    echo "INFO: ${message}"
}

def warning(message) {
    echo "WARNING: ${message}"
}
```

那么 Jenkinsfile 中就可以这样调用：

```groovy
// Jenkinsfile
steps {
  log.info 'Starting'
  log.warning 'Nothing to do!'
}
```

大家可能已经注意到了，在 `groovy` 文件中，我们可以直接像在 `steps` 中一样调用已有的方法，比如 `echo` 和 `sh` 等。

我们也能在 `groovy` 文件中去引用 Java 的库并返回一个变量，比如：

```groovy
#!/usr/bin/env groovy
import java.util.Random;

def String name() {
  def rand = new Random()
  def t = rand.nextInt(1000)
  return String.valueOf(t)
}
```

这样就能够在 `JenkinsFile` 中去设置一个环境变量：

```groovy
// Jenkinsfile
environment {
  NAME = random.name()
}
```

除了定义方法之外，我们还能让这个文件本身就能被调用，只需要定义一个 call 方法：

```groovy
#!/usr/bin/env groovy

def call() {
  sh "hello, world"
}
```

还能够定义一个新的 section，接受一个 Block：

```groovy
def call(Closure body) {
    node('windows') {
        body()
    }
}
```

这样可以让指定的 Body 在 windows 节点上调用：

```groovy
// Jenkinsfile
windows {
    bat "cmd /?"
}
```

## 常用技巧

### 发送邮件通知

主要使用 `emailext`，需要在 Jenkins 的配置界面事先配置好，可用的环境变量和参数可以参考文档 [Email-ext plugin](https://wiki.jenkins.io/display/JENKINS/Email-ext+plugin#Email-extplugin-Globalconfiguration)

```groovy
emailext body: '$DEFAULT_CONTENT',  recipientProviders: [culprits(),developers()], subject: '$DEFAULT_SUBJECT'
```

### 结果同步到 gitlab

同样需要配置好 gitlab 插件，在 Pipeline 中指定 `options`：

```groovy
// Jenkisfile
options {
  gitLabConnection('gitlab')
}
```

然后就可以在 post 中根据不同的状态来更新 gitlab 了：

```groovy
// Jenkisfile
failure {
  updateGitlabCommitStatus name: 'build', state: 'failed'
}
success {
  updateGitlabCommitStatus name: 'build', state: 'success'
}
```

文档参考：[Build status configuration](https://github.com/jenkinsci/gitlab-plugin#build-status-configuration)

### 构建过程中可用的环境变量列表

Jenkins 会提供一个完整的列表，只需要访问 `<your-jenkins-url>/env-vars.html/` 即可，别忘了需要使用 `"${WORKSPACE}"`

### 在 checkout 前执行自定义操作

在 Multibranch Pipeline 的默认流程中会在 checkout 之前和之后执行 `git clean -fdx`，如果在测试中以 root 权限创建了文件，那么 jenkins 会因为这个命令执行失败而报错。所以我们需要在 checkout 之前执行自定义的任务：

```groovy
#!/usr/bin/env groovy

// var/pre.groovy
def call(Closure body) {
  body()
  checkout scm
}
```

在 Jenkinsfile 中配置以跳过默认的 checkout 行为：

```groovy
// Jenkisfile
options {
  skipDefaultCheckout true
}
```

在每个 stage 中执行自定义的任务即可：

```groovy
// Jenkisfile
stage('Compile') {
  agent any
  steps {
    pre {
      sh 'pre compile'
    }
    sh 'real compile'
  }
}
```

## 总结

Jenkins 作为使用最为广泛的 CI/CD 平台，网上流传着无数的脚本和攻略，在学习和开发的时候一定要从基本出发，了解内部原理，多看官方的文档，不要拿到一段代码就开始用，这样才能不会迷失在各式各样的脚本之中。

更重要的是要结合自己的业务需求，开发和定制属于自己的流程，不要被 Jenkins 的框架限制住。比如我们是否可以定义一个自己的 YAML 配置文件，然后根据 YAML 来生成 Pipeline，不需要业务自己写 Pipeline 脚本，规范使用，提前检查不合法的脚本，核心的模块共同升级，避免了一个流程小改动需要所有项目组同步更新。这是我现在正在做的事情，有机会再跟大家分享～

## 参考资料

- [Pipeline Syntax](https://jenkins.io/doc/book/pipeline/syntax/)
- [Groovy Syntax](https://groovy-lang.org/syntax.html)
- [Extending with Shared Libraries](https://jenkins.io/doc/book/pipeline/shared-libraries/)
