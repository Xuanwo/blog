---
categories: Code
date: 2025-09-22T01:00:00Z
title: "How I Vibe Coding? (Sept 2025 Edition)"
series: "How I Coding"
---

I wrote [How I vibe Coding?](https://xuanwo.io/2025/03-how-i-vibe-coding/) back in June. Nearly three months later, things have changed. Time to update this article to reflect my current setup. In this piece, I’ll share how I use my tools to do vibe coding. As always, I’m writing this down not just to document my journey, but to inspire you and welcome your feedback.

## Toolset

My current toolset consists of [codex](https://github.com/openai/codex), [xlaude](https://github.com/Xuanwo/xlaude), and [zed](https://zed.dev/).

### From claude code to codex

I switched from [Claude Code](https://github.com/anthropics/claude-code) to [Codex](https://github.com/openai/codex) solely to access GPT-5-High, and now there's a better version called GPT-5-Codex-High. I’m not happy with Claude’s recent drama, and I’m glad GPT-5-High is outstanding. It’s on par with Opus 4.1, if not better.

Some obvious good points about GPT-5 I can tell:

- GPT-5 is more honest. I rarely encounter cases where it claims to have done something it didn’t. It even calls `git status -sb` to check the diff properly.
- GPT-5 follows instructions better. It’s hard to stop Claude from making unwanted code changes, but GPT-5 adheres to those constraints much more reliably.
- GPT-5 is more concise. It often uses fewer tokens to answer and avoids adding comments for every line of code.

Codex doesn’t have the ecosystem that Claude Code offers, and its agentic workflow isn’t as rich. It only just added resume support and still doesn’t support resumes based on project paths. Generally, I think Codex isn’t as strong as Claude Code, but the gap is shrinking fast. The team behind Codex has been doing great work lately. Still, Codex has some clear advantages:

- Codex is open source, so I know exactly what it does and can tweak parts to align with my needs.
- Codex is written in Rust, so it uses far less memory than Claude Code. This is a big plus when running multiple agents.
- Codex seems to have excellent context management. I’ve seen cases where it handled 2.4M tokens yet still had 24% context capacity left.

Overall, I’m happy with this switch to a better model even if the agent capabilities are slightly worse.

### Introduce xlaude

[Xlaude](https://github.com/Xuanwo/xlaude), Xuanwo’s Claude Code, is a CLI tool I built for myself to manage Claude instances using git worktrees for parallel development workflows. Originally designed for Claude, it now supports Codex too.

Whenever I need to work on something, I run `xlaude create abc`. Under the hood, it does this:

- Creates a new git worktree named `<project>-abc` in the parent folder of `<project>`
- Starts Codex within that worktree

When I’m done, I run `xlaude delete` to remove the worktree.

Xlaude also includes a dashboard powered by tmux that runs Codex inside a persistent session, so I don’t lose my work if I accidentally close the terminal. But these days, I prefer the simpler `xlaude create` command. It’s easier to track. Another great feature is its list of active worktrees, so I never lose sight of ongoing projects.

### Sticking with Zed

I’m now running Codex inside Ghostty directly instead of using Zed’s terminal tab. After spending more time with the code agent, I’ve realized I don’t need an IDE open 80% of the time. I only need it in two scenarios: when a task is nearly complete and I’m ready to review, or when a task fails and I need to dig deep to understand what’s going wrong and guide the code agent on what to do next.

Zed is perfect for these two cases. I can open Zed in the current directory from Ghostty by typing `zed .`. It starts instantly, letting me keep my train of thought without losing momentum while waiting. Zed also offers excellent diff views at both the project and file levels. The overall review experience is pretty great.

So in conclusion: I’m using Codex + Xlaude + Zed for vibe coding. Codex for coding, Xlaude for task management, and Zed for code reviewing and trouble shooting.

## Mindset

It’s interesting that my mindset hasn’t changed much since three months ago. LLMs are still pretty much like a recent graduate at a junior level, maybe a bit sharper but still junior. As the driver, we still need to stay in control of the task and be ready to take over anytime.

Here’s what I’ve learned this year:

- Don’t trust benchmarks. This applies to all areas, not just AI. We don’t use code agents the way benchmarks suggest, and most benchmarks don’t cover our actual use cases. Just test models in your real scenarios and see if they feel like a good copilot. Don’t base your decisions on benchmarks alone.
- Don’t believe in prompt engineering. Sure, prompt engineering can help sometimes, but mostly you shouldn’t obsess over it. Focus on your real business problem and context. If you find yourself spending more and more time tweaking prompts or forcing the model to do what you want, that model isn’t right for you. Find a better one.

## Tips

### GPT-5-Codex-High is the best vibe coding model (for now)

Three months ago, Claude Opus 4 was unbeatable. Then Opus 4.1 came out and was slightly better. But now, in September 2025, GPT-5-Codex with high reasoning is superior. The best part is you only need ChatGPT Plus at `$20` to access the top coding model. With Claude, people can only use Sonnet 4 on the Pro plan at `$17`; to get access to Opus, you need at least the Max plan at `$100`.

### MCP is still a lie

Three months later, MCP for coding is still a lie. People don’t really need MCP. Any MCP can just become a plain CLI or simple curl call, which LLMs have already mastered. Adding too many MCP servers is just a waste of context.

Use tools instead of configuring MCP servers in coding.

### Use subscription-based pricing.

Subscription is the future. Code Agent is designed to be token-intensive. Just subscribe to the best model you want instead of paying per request or token. It makes no sense anymore. I especially can’t understand why anyone pays over $200, even $1000, for Cursor or APIs. By simply switching to subscription-based services, you achieve massive cost savings.

More and more subscription services are emerging. OpenAI lets [ChatGPT users access Codex](), and Cerebras has announced [Cerebras Code](https://www.cerebras.ai/blog/introducing-cerebras-code) with a similar pricing strategy. [GLM](https://docs.z.ai/devpack/overview) also have their own plans. It’s not hard to predict that Google will soon join this battle and let Workspace users access Gemini.

Stop paying for tokens. Use subscription now. By the way, **don’t pay yearly**. Stick to monthly. Always stay ready to switch to a better option.

---

Hope you're enjoying the coding vibes: create more, hype less.
