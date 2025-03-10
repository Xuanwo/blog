---
categories: Links
date: 2025-03-10T01:00:00Z
title: "Where do you belong, system researchers?"
tags:
    - Open Source
    - System Research
---

[@xiangpeng](https://blog.xiangpeng.systems/) published nice post called [Where are we now, system researchers?](https://blog.xiangpeng.systems/posts/system-researchers/) [*via archive.is*](https://archive.is/gxklC). In this post, he questioned the positions of system researchers. Xiangpeng is an outstanding system researcher, and this post is written from the viewpoint of someone in that field. As for me, although I have never been a system researcher, I would like to share some comments here and offer complementary ideas.

---

There are two main areas in the field of computer science: academia and industry. Traditionally, research is conducted in academia, and its results are applied in industry. However, the boundary between these two domains is becoming increasingly blurred. Sometimes, industry develops something relatively new that ultimately brings significant changes to academia.

Yet, whenever I discuss these developments with friends in academia, they simply laugh at me and say, "That's not new. A paper published in the 1990s already explored this idea."

Ah, the idea. But where is the implementation?

This post said:

> We waste too much time babbling about knowledge we learn from papers – how to schedule a million machines, how to train a billion parameters, how to design infinitely scalable systems. Just thinking about these problems makes us feel important as researchers, although most of us have never deployed a service in the cloud, never used the techniques we proposed, and never worked with the filesystems, kernels, compilers, networks, or databases we studied. We waste time on these theoretical discussions because we don’t know how to code and are unwilling to practice. As Feynman said, “What I cannot create, I do not understand.” Simply knowing how a system works from 1000 feet doesn’t mean we can build it. The nuances of real systems often explain why they’re built in particular ways. Without diving into these details, we’re merely scratching the surface.

I think this is a very good point. I've seen many papers that present interesting ideas but are never implemented. Some develop great abstractions but lack practicality. Others propose excellent concepts without discussing how they could actually work. Sometimes, I feel that friends in academia don't really care about real users.

> (Writing code does not make you a good researcher, but not writing code makes you a bad one.)

As I stated above, I'm not a systems researcher. I'm curious whether it's possible for a good researcher to be unable to write good code. That said, can someone conduct excellent research without producing any nice code? Are there any examples of this?

> The system research community does not need more novel solutions – novel solutions are essentially combinations of existing techniques. When we need to solve a problem, most of us would figure out a similar solution, and what matters is the execution of the ideas.
>
> Instead, we need more people willing to sit down and code, build real systems, and talk to real users. Be a solid practitioner, don’t be a feel-good researcher.

I believe that's a valid point. I'm looking forward to collaborating with more system researchers to push the boundaries of system research forward.

> Paper publishing takes too much time. We spend too much effort arguing what’s new and what’s hard, instead of focusing on doing the actual research. Writing a paper already takes too much time, and then we need to anonymize artifacts, register abstracts, wait for reviews, write rebuttals, revise the paper, and can still be rejected for arbitrary reasons. The turnaround time for a single submission can be up to 6 months.

Ah, writing papers is increasingly becoming a specialized skill. I have failed to master it.

In today's world, [arXiv](https://arxiv.org/) is becoming an increasingly important platform for publishing papers and initiating discussions.

> The real difference between papers often lies in numerous small details that sound trivial but are actually essential for relevance. In most cases, figuring out these details takes much more time and demonstrates more novelty than coming up with the initial idea itself.

Referring back to my previous comments: Papers are primarily about ideas. I also agree with Xiangpeng that the real difference between papers often lies in numerous small details that may seem trivial but are actually crucial for relevance.

## Conclusion

So, back to the title—where do you belong, system researchers? My answer is: open source.

Try integrating your work with open-source projects or publishing it as open source. More and more researchers are doing this, and I believe it's a great trend. One great example is [S3-FIFO](https://s3fifo.com/).

Open source is a great way to share your work with the world and receive feedback from real users. It's also an excellent opportunity to practice coding and build real systems.
