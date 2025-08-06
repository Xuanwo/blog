---
categories: Code
date: 2025-08-06T01:00:00Z
title: "Learn Rust by Reasoning with Code Agents"
---

It's often said that Rust has a steep learning curve. I disagree with this notion. I'm a strong believer in learning by doing. Rust is a programming language, and like any language, it should be learned by applying it to real projects rather than relying solely on books or videos. However, learning by doing can't solve every problem that newcomers might encounter. While it helps with grasping the basics, when it comes to mastering Rust's advanced features like ownership, traits, lifetimes, async, we need more than just hands-on practice. We need to understand. We need to reason. Thanks to Code Agents, I discovered something even better: learning Rust by reasoning (with Code Agents).

## What’s reasoning?

When we reason with code, we're doing more than just following its execution. We're trying to piece together the thought process behind it. We're imagining the mindset of the person (or the AI) who created it, and questioning it.

| Reading |	Reasoning |
| - | - |
| "This line uses Pin<&mut Self>." |	"Why do we need Pin here? What breaks if we remove it?" |
| "Here we use a match statement." |	"Why not if let? Would it change the behavior?" |
| "The field is wrapped in Arc." |	"Is sharing needed? Who else uses this data?" |

Reasoning always involves **a question**, not just a fact. The power of AI-assisted programming is not in generating code. It’s in giving us something to reason about.

Reasoning mimics how we truly understand complex systems.

- We retain better. When we ask "why?", our brain connects the new idea to our existing model.
- We go beyond syntax. Books teach language rules; reasoning teaches engineering judgment.
- We practice thinking like a Rust developer. Not just writing "working" code, but writing "good" code.

A Reasoning-Driven Learning Loop looks like the following:

1. Get (Generate) a diff.
   Use a code agent to generate a small but non-trivial PR.
2. Skim and find the edge.
   What part of the diff feels unfamiliar or slightly suspicious?
3. Ask “why” and “what if”.
   Why was it written this way? What would happen if I changed this?
4. Query the code agent.
   Ask Claude the exact question we have — but don’t trust the answer blindly.
5. Ask for runnable examples.
   Can Claude show a minimal version of this concept? Run it. Tweak it. Break it.
6. Repeat.
   Each loop deepens our understanding, not just of Rust, but of design choices.

This is not passive consumption. This is active debugging: not of the code, but of our understanding.

Not all diffs are equally educational. Here’s what I look for:

-	Unexpected constructs
  Traits, macros, async blocks, lifetimes, Pin, etc.
-	Non-obvious design choices
  Wrapping types in Box, using trait objects, error handling via thiserror, etc.
-	New concepts I haven’t mastered yet

Sometimes it’s just one line, but one line is enough if we go deep enough.

## A Practical Example

Let's try it step by step.

First, we need an idea to work on or a problem to solve. It should be moderately challenging, not as simple as fixing a typo or renaming a type, but not so complex that it turns into an entire project. Ideally, it could be something like a PR with about 250 lines of code that is self-contained.

> If you don't have an idea, feel free to pick an issue from [Apache OpenDAL](https://github.com/apache/opendal/contribute) so you can contribute to open source while learning Rust!

I will use an example from OpenDAL. Let's take the good first issue: [Migrate all layers to context-based](https://github.com/apache/opendal/issues/5773) as an example.

First, we need to discuss with the maintainer about the issue and the general idea of how we can implement it. Then, we will start Claude Code. Note that we are currently Rust newbies, so let's focus on getting Claude code working on this issue first before reasoning through it.

![](start.png)

Claude's code will address this issue and handle the work behind the scenes. Let's just prepare a cup of coffee and wait for them for a while. We might be interrupted a few times if something goes wrong, but eventually, we'll have a basic implementation. Remember to ask Claude to run `cargo clippy` to ensure the code compiles.

![](finish.png)

Don't rush here; our work has just begun. Please NEVER submit a PR without thoroughly reasoning it out. Otherwise, it could waste time for both us and the maintainer.

We will need to review the code line by line. Let me give you an example. In this PR, we have a manually implemented `Stream`:

```rust
impl<S, I> Stream for LoggingStream<S, I>
where
    S: Stream<Item = Result<Buffer>> + Unpin + 'static,
    I: LoggingInterceptor,
{
    type Item = Result<Buffer>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        ...
    }
}
```

There are many new concepts for a Rust beginner: `Unpin`, `Pin`, `Poll`, `Context`. Let's focus on the first one: what does `Context` mean here? What happens if I don't pass it correctly in `inner.poll_next_unpin()`? To prevent Claude from interpreting our questions as a code improvement suggestion, it's better to make a `git commit` first and then ask Claude clearly.

```claude
I’m a rust learner and I’m just learning by reasoning your code. Please tell me what’s the context means in the Stream trait impl? What if I didn’t pass it done in the inner.poll_next_unpin()?
```

![](question.png)

Most of the time, Claude can provide good explanations like this one. However, the most important thing is that you must keep reasoning and not trust them without verification. Sometimes, you might need to ask Claude to provide runnable examples and repeat the process. It can be challenging at first, but most of your problems will disappear after several iterations. You'll also find that more and more of your reasoning becomes project-related and not just about Rust.

When that happens, enjoy programming by reasoning with code agents.

## Conclusion

Why does this method work? I believe it aligns with how humans think and understand concepts. By reasoning through existing code, we learn how code is actually written in the real world and connect it with the pieces already in our minds. Most importantly, we transform the learning process so we can focus only on what we don't understand or have concerns about, instead of repeatedly reading what we already know. This saves a lot of time compared to reading entire books just to answer one small question.

Code agents are not here to replace our learning. They are here to generate raw materials for our thoughts. Learning Rust by reasoning is not about trusting the AI. It's about building our own judgment on top of it.

The last thing I want to emphasize is: reasoning comes first! Don’t generate low-quality PRs in this way. We must put our own thinking into it and take responsibility for the results. We are the captain. AI can help generate routes for us, but We must decide the next actions ourselves.

## Try it Yourself

If you want to try reasoning with a real-world issue, welcome to checkout [OpenDAL good first issues](https://github.com/apache/opendal/contribute)

Generate a diff. Ask why. Ask what if. And don’t stop until it makes sense.

---

That's all, thanks for reading and happy learning!
