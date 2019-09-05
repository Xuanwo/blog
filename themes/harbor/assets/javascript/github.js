const fn = async () => {
  const title = document.createElement('h2')
  title.innerText = '最近动态'

  const innerSection = document.createElement('section')
  innerSection.setAttribute('class', 'posts simple')

  const data = await fetch('https://api.github.com/users/Xuanwo/events').then((res) => res.json())

  for (let i = 0; i < 10; i++) {
    const event = data[i]

    const x = document.createElement('a')
    innerSection.appendChild(x)

    let content = ''
    switch (event.type) {
      case 'WatchEvent':
        content = `<a href="https://github.com/${event.repo.name}">
                    <div class="each">
                        <div>
                            <h2> 关注了 <b>${event.repo.name}</b> 项目</h2>
                        </div>
                    </div>
                </a>`
        break
      case 'IssueCommentEvent':
        content = `<a href="${event.payload.issue.html_url}">
                    <div class="each">
                        <div>
                            <h2> 评论了 <b>${event.repo.name}</b> 项目的 Issue</h2>
                        </div>
                    </div>
                </a>`
        break
      case 'IssuesEvent':
        content = `<a href="${event.payload.issue.html_url}">
                    <div class="each">
                        <div>
                            <h2> 创建了 <b>${event.repo.name}</b> 项目的 Issue </h2>
                        </div>
                    </div>
                </a>`
        break
      case 'PushEvent':
        content = `<a href="https://github.com/${event.repo.name}">
                    <div class="each">
                        <div>
                            <h2> 推送了 <b>${event.repo.name}</b> 项目的 Commit</h2>
                        </div>
                    </div>
                </a>`
        break
      case 'PullRequestEvent':
      case 'PullRequestReviewCommentEvent':
        content = `<a href="${event.payload.pull_request.html_url}">
                    <div class="each">
                        <div>
                            <h2> 审阅了 <b>${event.repo.name}</b> 项目的 Pull Request</h2>
                        </div>
                    </div>
                </a>`
        break
    }
    x.outerHTML = content
  }

  const section = document.createElement('section')
  section.setAttribute('class', 'section')
  section.appendChild(title)
  section.appendChild(innerSection)
  document.querySelector('#main-content > div.container.front-page').appendChild(section)
}
fn()
