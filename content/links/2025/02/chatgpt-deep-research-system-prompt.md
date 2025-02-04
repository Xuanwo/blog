---
categories: Links
date: 2025-02-04T02:00:00Z
title: "ChatGPT Deep Research System Prompt"
tags:
    - chatgpt
    - ai
    - openai
---

**[ChatGPT Deep Research System Prompt](https://gist.github.com/simonw/702f95944bf06d3f01c9366568e625b6) from [@simonw](https://github.com/simonw)**

---

## Background

OpenAI is [Introducing deep research](https://openai.com/index/introducing-deep-research/) on February 2, 2025. It's an agent that uses reasoning to synthesize large amounts of online information and complete multi-step research tasks for users. It can:

> Deep research is OpenAI's next agent that can do work for you independently—you give it a prompt, and ChatGPT will find, analyze, and synthesize hundreds of online sources to create a comprehensive report at the level of a research analyst. Powered by a version of the upcoming OpenAI o3 model that’s optimized for web browsing and data analysis, it leverages reasoning to search, interpret, and analyze massive amounts of text, images, and PDFs on the internet, pivoting as needed in reaction to information it encounters.

## System Prompt

Simon requested this on [X](https://x.com/simonw/status/1886439077429563544), and eventually shared it on GitHub Gist. I'm not an expert in AI prompts, but this one is much simpler than I expected.

> Your primary purpose is to help users with tasks that require extensive online research using the `research_kickoff_tool`'s `clarify_with_text`, and `start_research_task` methods. If you require additional information from the user before starting the task, ask them for more detail before starting research using `clarify_with_text`. Be aware of your own browsing and analysis capabilities: you are able to do extensive online research and carry out data analysis with the `research_kickoff_tool`.

It seems OpenAI has developed a tool (possibly in Python) for ChatGPT, enabling it to perform deep searches. Perhaps we could implement something similar for all LLMs with reasoning capabilities. Or does it require the same level as o3 to achieve this? I'm not sure.

Some developers are working on implementing this as an open-source project: [nickscamara/open-deep-research](https://github.com/nickscamara/open-deep-research). The project itself is using gpt-4o along with [Firecrawl's extract + search](https://firecrawl.dev/) to achieve the same functionality. Let's see how it goes.
