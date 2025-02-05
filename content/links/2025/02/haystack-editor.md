---
categories: Links
date: 2025-02-05T03:00:00Z
title: "Haystack Editor First Try"
tags:
    - tools
---

**[Haystack Editor](https://haystackeditor.com/)** is a new open-source VSCode-based editor that organizes all tabs on a canvas, making it easier to manage and navigate between them.

It closely resembles a graph-based note-taking tool like [Heptabase](https://heptabase.com/). I was drawn to its impressive demo at [Understand pull requests at a glance](https://haystackeditor.com/code-reviewer), so I decided to give it a try.

---

## Install

Haystack Editor provides pre-built binaries for Windows, macOS, and Linux. You can download the latest version from the [official website](https://haystackeditor.com/).

As an Arch Linux user, I installed it using `paru -S haystack-editor-bin`. The package [haystack-editor-bin](https://aur.archlinux.org/packages/haystack-editor-bin) is maintained by [Celsiuss](https://aur.archlinux.org/account/Celsiuss), who is very responsive and updates the package promptly after I commented that it is outdated.

## First Impression

Instead of an empty tab, Haystack places everything on a canvas that you can zoom in and out of. It takes a little time to get used to, but I think it's a great idea. I imagine MacBook users will love it, though regular mouse users might need some time to adapt.

## Too many permissions

Haystack Editor requires a lot of permissions from github:

![](github-oauth.jpeg)

I'm not happy with this. To continue, I have to create a new GitHub account and use it to log in. I hope the author can provide a way to use the editor without requiring so many permissions.

## PR Review

After opening a PR, it will open all changed files in the canvas like the following:

![](1.png)

I can also click on the file to view the diff in detail.

![](2.png)

However, it's not as impressive as I expected. I thought it would display the differences in a graphical format and automatically connect related ones. I'm not sure how to reproduce the same behavior the author demonstrated in the demo.

At its current stage, it seems like just places tabs on a canvas.

## Conclusion

Haystack Editor has potential and may be useful for some users interested in graph-based thinking. For now, it’s not suitable for me. It could become more appealing if it included AI tools that make the graphs more connected and easier to understand.
