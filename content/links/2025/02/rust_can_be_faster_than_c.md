---
categories: Links
date: 2025-02-27T01:00:00Z
title: "Rust can be faster than C"
tags:
    - open-source
    - rust
    - performance
---

I'm happy to see that [zlib-rs is faster than C](https://trifectatech.org/blog/zlib-rs-is-faster-than-c/) [via archive.is](https://archive.is/yQxHV)

People often assume that Rust is slower than C because it has some unavoidable overhead compared to C. However, such assumptions often overlook an important prerequisite: both projects have been allocated the same level of resources. Rust has been quite hyped in recent years, but hype can be a good thing—many talented developers are drawn to Rust and dedicate their efforts to it.

---

> Today, multiversioning is not natively supported in rust. There are [proposals for adding it](https://rust-lang.github.io/rust-project-goals/2025h1/simd-multiversioning.html) (which we're very excited about!), but for now, we have to implement it manually which unfortunately involves some unsafe code. We'll write more about this soon (for the impatient, the relevant code is [here](https://github.com/trifectatechfoundation/zlib-rs/blob/64d972982325626d8c8875e308846a53c7f0aa05/zlib-rs/src/inflate.rs#L1860-L1881)).

All crates that use SIMD instructions currently need to implement multiversioning manually. I'm eagerly anticipating `simd-multiversioning` too!

The current methods for doing that are similar to this:

```rust
fn inflate_fast_help(state: &mut State, start: usize) {
    #[cfg(any(target_arch = "x86_64", target_arch = "x86"))]
    if crate::cpu_features::is_enabled_avx2() {
        // SAFETY: we've verified the target features
        return unsafe { inflate_fast_help_avx2(state, start) };
    }

    inflate_fast_help_vanilla(state, start);
}

#[cfg(any(target_arch = "x86_64", target_arch = "x86"))]
#[target_feature(enable = "avx2")]
unsafe fn inflate_fast_help_avx2(state: &mut State, start: usize) {
    inflate_fast_help_impl::<{ CpuFeatures::AVX2 }>(state, start);
}

fn inflate_fast_help_vanilla(state: &mut State, start: usize) {
    inflate_fast_help_impl::<{ CpuFeatures::NONE }>(state, start);
}
```

`inflate_fast_help` serves as the entry point for the API call. It first checks the CPU features and then invokes the appropriate implementation.

I find it a bit unusual that `zlib-rs` marks `inflate_fast_help_avx2` as an unsafe function. My assumption is that they use `unsafe` to indicate that calling the function without first verifying the target features is not safe.

> Nikita Popov suggested we try the -Cllvm-args=-enable-dfa-jump-thread option, which recovers most of the performance here. It performs a kind of jump threading for deterministic finite automata, and our decompression logic matches this pattern.

`enable-dfa-jump-thread` is a bit magic.

Here is my understanding of it:

First of all, [Jump threading](https://en.wikipedia.org/wiki/Jump_threading) is a compiler optimization that can be thought of as a "shortcut optimization."

Take the following code as an example. Please note that this is not how jump threading works in a compiler; the example is meant to represent the logic.

```c
10. a = SomeNumber();
20. IF a > 10 GOTO 50
...
50. IF a > 0 GOTO 100
...
```

It's easy to find that if `a > 10`, then `a > 0` is always true. The compiler can optimize this by jumping directly to `GOTO 100` like this:

```c
10. a = SomeNumber();
20. IF a > 10 GOTO 100
...
50. IF a > 0 GOTO 100
...
```

This optimization will eliminate the unnecessary dynamically executed jumps, makes way for further optimizations.

Then, `enable-dfa-jump-thread` is a flag that enables jump threading for DFA (*deterministic finite automata*).

For example:

```rust
fn check_status(value: i32) -> String {
    let status;
    if value > 50 {
        status = "OK";
    } else {
        status = "ERR";
    }

    // Other code here.
    let mut result = String::from("Result: ");

    if status == "OK" {
        result.push_str("Passed");
    } else {
        result.push_str("Failed");
    }

    result
}
```

After `enable-dfa-jump-thread`, LLVM can optimize the code by jumping directly to the appropriate branch based on the status value.

```rust
fn check_status(value: i32) -> String {
    // Other code here.
    let mut result = String::from("Result: ");

    if value > 50 {
        result.push_str("Passed");
    } else {
        result.push_str("Failed");
    }

    result
}
```

There are many DFAs within the decompressor of zlib, so enabling DFA jump threading can significantly improve performance, especially when handling small datasets.

The LLVM community is working to enable this flag by default at [[DFAJumpThreading] Enable the pass by default](https://github.com/llvm/llvm-project/pull/83033).

> Our implementation is mostly done, and clearly performs extremely well. However, we're missing some [less commonly used API functions](https://github.com/trifectatechfoundation/zlib-rs/issues/49) related to gzip files that would make us a complete drop-in replacement in all cases.

Most functions, such as `gzclose` and `gzflush`, seem easy to implement. Let's take a look!
