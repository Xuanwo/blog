---
categories: Links
date: 2025-02-07T03:00:00Z
title: "Personal Software Is Becoming A Trend"
tags:
    - software
---

- **[Personal Software](https://leerob.com/n/personal-software) from [Lee Robinson](https://leerob.com/)** [via archive.is](https://archive.is/AMXtr)
- **[Selfish Software](https://every.to/source-code/selfish-software) from [Edmar Ferreira](https://every.to/@edmar)**  [via archive.is](https://archive.is/b86SQ)

I've come across some posts about personal software recently. Lee Robinson calls it "Personal Software," whereas Edmar Ferreira refers to it as "Selfish Software." Lee emphasizes the personal aspect, focusing on how it meets one's own needs, while Edmar wants to highlight that it's "selfish," created without external customers in mind. The common thread is that both are discussing the idea of building software for oneself.

This idea gained popularity with the rise of AI. With AI's assistance, creating software that meets individual needs is now easier than ever. This has sparked a new wave of personal software development, where people build tools and applications tailored to their specific requirements. Someone also proposed an idea called "one-shot software," in which AI generates one-time scripts designed for a specific use case without considering future needs.

I have been building software for 10 years. Except for the very early stages when I was learning and exploring, most of the time, I've been developing software for others—object storage, distributed file systems, databases, lakehouses, etc. I rarely build software for myself or to satisfy my own needs. Maybe that's part of the reason I've lost a bit of passion for building.

This year, I plan to create some personal software, open-source my projects, and not accept any external feature requests unless they align with my own needs. Users are welcome to use it if it fits their requirements, but if not, I will encourage them to fork the project and develop it themselves rather than trying to persuade me to change my vision.

Sounds like fun.

---

## Personal Software

> If you wanted to do one small thing—say, convert text from one format to another—you were forced to wade through hundreds of menus and options irrelevant to your particular need. Ironically, this was personal computing without the personal.

Thinking about ffmpeg:

```shell
:) ffmpeg --help
ffmpeg version n7.1 Copyright (c) 2000-2024 the FFmpeg developers
...
usage: ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}...

Getting help:
    -h      -- print basic options
    -h long -- print more options
    -h full -- print all options (including all format and codec specific options, very long)
    -h type=name -- print all options for the named decoder/encoder/demuxer/muxer/filter/bsf/protocol
    See man ffmpeg for detailed description of the options.

...

Global options (affect whole program instead of just one file):
-v <loglevel>       set logging level
-y                  overwrite output files
-n                  never overwrite output files
-stats              print progress report during encoding

(more lines of options)
```

> What if making single-use apps were 10x easier than today? 100x easier?

Since GPT-3.5, I no longer write scripts by hand to analyze logs. I used to maintain my own toolbox with many useful scripts for different needs. Now, all I need to do is simply say, "Write a Python script to analyze logs and filter all error logs containing the words 'retry failed.'"

## Selfish Software

> Whenever I had a new idea, I’d think about potential customers instead of building the things I wanted to. This dry, paint-by-the-numbers approach eroded all the joy I’d once had of building software.

That's true. For every idea, I always consider whether it can become a product. If not, I won't spend time on it. That makes sense for a business, but not fun for my side project.

> When you create selfish software, there’s nowhere to hide. You can’t gloss over a clunky interface or excuse an awkward feature. The feedback loop is immediate and brutally honest, because your audience is just yourself. You’re forced to refine every detail until it works. Once you have something that genuinely solves your own problems, you may be surprised by how many others it helps—even if you haven’t developed a grand plan for profit. But the profit isn’t the point. The point is the fun, creativity, and excitement you’ve had along the way. And it’s easier than ever with AI.

This seems like a nice loop.

> I had to train myself to stop thinking about other people’s needs while building, and to stop asking the question: “Who else would use this?”

It's a bit difficult for me because I've been asking myself for 10 years.

> Modern AI tools and code generators make it easy to spin up short-lived solutions without the lengthy effort of creating a fully polished product. Whether you need a quick script to parse data or transform a file format, building these little helpers flexes your problem-solving skills and helps you fail quickly and cheaply. You’ll learn what works and what doesn’t in a fraction of the time it would take with a traditional development cycle.

That's a valid suggestion. AI can be very helpful in creating a one-shot script. I can use it as a proof of concept to validate my idea first.

> Keep iterating in real time—tweak features, polish interfaces, and add anything that brings you delight, even if it seems too quirky or “unprofessional.” It can help to document your logic along the way. Even simple notes will keep you from forgetting important details after a few weeks of not touching the code.

Add my favorite TUI.

> Selfish software is not about ignoring user needs altogether; it’s about restoring the joy of building by making yourself the user you’re most eager to please.

The hardest work: please myself.
