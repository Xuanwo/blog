---
categories: Links
date: 2025-02-27T01:00:00Z
title: "Release Arrow Rust 54.2.1 in 6 hours"
tags:
    - open-source
    - asf
    - arrow
---

Today I helped the arrow-rust community to [release Arrow Rust 54.2.1 in 6 hours](https://github.com/apache/arrow-rs/issues/7209).

---

## Background

[chrono v0.4.40](https://github.com/chronotope/chrono/releases/tag/v0.4.40) implemented a [quarter](https://github.com/chronotope/chrono/pull/1666) method that causes [build errors](https://github.com/apache/arrow-rs/issues/7196) when building with arrow.

```rust
error[E0034]: multiple applicable items in scope
   --> /Users/yutannihilation/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/arrow-arith-54.2.0/src/temporal.rs:92:36
    |
92  |         DatePart::Quarter => |d| d.quarter() as i32,
    |                                    ^^^^^^^ multiple `quarter` found
    |
note: candidate #1 is defined in the trait `ChronoDateExt`
   --> /Users/yutannihilation/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/arrow-arith-54.2.0/src/temporal.rs:638:5
    |
638 |     fn quarter(&self) -> u32;
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^
note: candidate #2 is defined in the trait `Datelike`
   --> /Users/yutannihilation/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/chrono-0.4.40/src/traits.rs:47:5
    |
47  |     fn quarter(&self) -> u32 {
    |     ^^^^^^^^^^^^^^^^^^^^^^^^
help: disambiguate the method for candidate #1
    |
92  |         DatePart::Quarter => |d| ChronoDateExt::quarter(&d) as i32,
    |                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~
help: disambiguate the method for candidate #2
    |
92  |         DatePart::Quarter => |d| Datelike::quarter(&d) as i32,
    |                                  ~~~~~~~~~~~~~~~~~~~~~

For more information about this error, try `rustc --explain E0034`.
error: could not compile `arrow-arith` (lib) due to 1 previous error
```

In arrow, we have a `ChronoDateExt` trait that provides additional APIs not yet supported by `chrono`. However, this could become a breaking change if `chrono` later implements the same API in its own `Datelike` trait.

## Solution

The simplest solution without changing the code is to pin the chrono version to `0.4.39`, but this may prevent the entire project from receiving future chrono releases, requiring another manual fix later. The best solution is for arrow-rs to release a patch that includes the fix, allowing users to simply run `cargo update` to apply it.

But since arrow-rs is an ASF project and requires three days to complete a release, does that mean our users will experience disruptions for three days?

## ASF Emergency Release

It's a widely held misconception that ASF releases are slow. They must require three binding votes and a three-day voting period before being approved for release.

**It's not true.**

The ASF release policy said that:

> Release votes SHOULD remain open for at least 72 hours.

However, this policy is relaxed in real-world practice. The PMC can issue an emergency release if necessary, which can be completed within a few hours, provided it secures enough binding votes from PMC members. The release of arrow-rs requires an emergency update: without this fix, all arrow-rs users will fail to build.

## Release Arrow Rust 54.2.1 in 6 hours

I have started handling these issues and am working to reach a consensus in the arrow community for a quick patch release. Following the arrow-rs release pattern, I created issue [Release arrow-rs / parquet patch version 54.2.1 (Feb 2025) (HOTFIX)](https://github.com/apache/arrow-rs/issues/7209).

I previously attempted to backport the fix [fix: Use chrono's quarter() to avoid conflict](https://github.com/apache/arrow-rs/pull/7198), but after discussing it with [@tustvold](https://github.com/tustvold), I changed to use `chrono = ">= 0.4.34, < 0.4.40"` instead to minimize disruption for users.

`@tustvold` merged this PR in 2 minutes, and after that, I started a bump PR for the branch checked out from the `54.2.0` tag: [[54.2.0_maintenance] Bump Arrow version to 54.2.1](https://github.com/apache/arrow-rs/pull/7207). In this PR, I requested an emergency release in this way:

> I request that this release be made under emergency circumstances, allowing it to be released as soon as possible after gathering three +1 binding votes, without waiting for three days.

[@alamb](https://github.com/alamb) stepped up and volunteered to handle the release. He helped merge the PR, prepared the release candidate, and then started the [release voting](https://lists.apache.org/thread/yjcjkv79d3wkpoj5d41y9q8ozvld3kxl). This vote passed in two hours, and the `54.2.1` release of arrow-rs is now ready.

## Conclusion

The ASF has rules for good reasons, and they are designed to ensure the stability and security of the project. These rules are not arbitrary, but rather reflect the experiences of the community and the lessons learned from past mistakes. Instead of blindly following these rules, we should thoroughly understand the reasons behind them, adapt them to the real world, and ultimately bring our practices into ASF discussions to refine and improve those rules.

So, we successfully release arrow-rs 54.2.1 in 6 hours. My next step is to discuss this case with the broader ASF community to see what we can learn from it and how we can improve our rules. I also welcome other ASF projects to share their experiences and learnings from similar situations.
