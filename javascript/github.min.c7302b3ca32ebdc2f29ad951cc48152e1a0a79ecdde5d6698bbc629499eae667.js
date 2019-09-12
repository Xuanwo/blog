const fn=async()=>{const innerSection=document.createElement('ul')
const data=await fetch('https://api.github.com/users/Xuanwo/events').then((res)=>res.json())
for(let i=0;i<10;i++){const event=data[i]
const x=document.createElement('li')
innerSection.appendChild(x)
let content=''
switch(event.type){case 'WatchEvent':content=`关注了 <a href="https://github.com/${event.repo.name}">${event.repo.name}</a> 项目`
break
case 'IssueCommentEvent':content=`评论了 <a href="${event.payload.issue.html_url}">${event.repo.name}</a> 项目的 Issue</h2>`
break
case 'IssuesEvent':content=`创建了 <a href="${event.payload.issue.html_url}">${event.repo.name}</a> 项目的 Issue`
break
case 'PushEvent':content=`推送了 <a href="https://github.com/${event.repo.name}">${event.repo.name}</a> 项目的 Commit`
break
case 'PullRequestEvent':case 'PullRequestReviewCommentEvent':content=`审阅了 <a href="${event.payload.pull_request.html_url}">${event.repo.name}</a> 项目的 Pull Request`
break}
x.outerHTML=`<li>${content}</li>`}
const working=document.querySelector('#working')
document.querySelector('#main-content > div > div').insertBefore(innerSection,working)}
fn()