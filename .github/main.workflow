workflow "Deploy to GitHub Pages" {
  on = "push"
  resolves = ["gh-pages"]
}

action "gh-pages" {
  uses = "./.github/actions/hugo"
  secrets = [
    "GIT_DEPLOY_KEY"
  ]
  env = {
    GIT_BRANCH = "master"
  }
}
