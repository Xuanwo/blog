---
categories: Code
date: 2023-11-29T01:00:00Z
title: "Rust std fs slower than Python!? No, it's hardware!"
tags:
    - rust
    - python
---

I'm about to share a lengthy tale that begins with [opendal](https://github.com/apache/incubator-opendal) `op.read()` and concludes with an unexpected twist. This journey was quite enlightening for me, and I hope it will be for you too. I'll do my best to recreate the experience, complete with the lessons I've learned along the way. Let's dive in!

> All the code snippets and scripts are available in [Xuanwo/when-i-find-rust-is-slow](https://github.com/Xuanwo/when-i-find-rust-is-slow)

## OpenDAL Python Binding is slower than Python?

[OpenDAL](https://github.com/apache/incubator-opendal) is a data access layer that allows users to easily and efficiently retrieve data from various storage services in a unified way. We provided python binding for OpenDAL via [pyo3](https://github.com/PyO3/pyo3).

One day, @beldathas reports a case to me at [discord](https://discord.com/channels/1081052318650339399/1174840499576770560) that OpenDAL's python binding is slower than python:

```python
import pathlib
import timeit

import opendal

root = pathlib.Path(__file__).parent
op = opendal.Operator("fs", root=str(root))
filename = "lorem_ipsum_150mb.txt"

def read_file_with_opendal() -> bytes:
    with op.open(filename, "rb") as fp:
        result = fp.read()
    return result

def read_file_with_normal() -> bytes:
    with open(root / filename, "rb") as fp:
        result = fp.read()
    return result

if __name__ == "__main__":
    print("normal: ", timeit.timeit(read_file_with_normal, number=100))
    print("opendal: ", timeit.timeit(read_file_with_opendal, number=100))
```

The result shows that

```shell
(venv) $ python benchmark.py
normal:  4.470868484000675
opendal:  8.993250704006641
```

Well, well, well. I'm somewhat embarrassed by these results. Here are a few quick hypotheses: 

- Does Python have an internal cache that can reuse the same memory?
- Does Python possess some trick to accelerate file reading? 
- Does PyO3 introduce additional overhead?

I've refactored the code to:

[python-fs-read](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/python-fs-read/test.py):

```python
with open("/tmp/file", "rb") as fp:
    result = fp.read()
assert len(result) == 64 * 1024 * 1024
```

[python-opendal-read](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/python-opendal-read/test.py):

```python
import opendal

op = opendal.Operator("fs", root=str("/tmp"))

result = op.read("file")
assert len(result) == 64 * 1024 * 1024
```

The result shows that python is much faster than opendal:

```shell
Benchmark 1: python-fs-read/test.py
  Time (mean ± σ):      15.9 ms ±   0.7 ms    [User: 5.6 ms, System: 10.1 ms]
  Range (min … max):    14.9 ms …  21.6 ms    180 runs
  
Benchmark 2: python-opendal-read/test.py
  Time (mean ± σ):      32.9 ms ±   1.3 ms    [User: 6.1 ms, System: 26.6 ms]
  Range (min … max):    31.4 ms …  42.6 ms    85 runs
  
Summary
  python-fs-read/test.py ran
    2.07 ± 0.12 times faster than python-opendal-read/test.py
```

The Python binding for OpenDAL seems to be slower than Python itself, which isn't great news. Let's investigate the reasons behind this.

## OpenDAL Fs Service is slower than Python?

This puzzle involves numerous elements such as rust, opendal, python, pyo3, among others. Let's focus and attempt to identify the root cause.

I implement the same logic via opendal fs service in rust:

[rust-opendal-fs-read](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/rust-opendal-fs-read/src/main.rs):

```rust
use std::io::Read;
use opendal::services::Fs;
use opendal::Operator;

fn main() {
    let mut cfg = Fs::default();
    cfg.root("/tmp");
    let op = Operator::new(cfg).unwrap().finish().blocking();

    let mut bs = vec![0; 64 * 1024 * 1024];

    let mut f = op.reader("file").unwrap();
    let mut ts = 0;
    loop {
        let buf = &mut bs[ts..];
        let n = f.read(buf).unwrap();
        let n = n as usize;
        if n == 0 {
            break
        }
        ts += n;
    }

    assert_eq!(ts, 64 * 1024 * 1024);
}
```

However, the result shows that opendal is slower than python even when opendal is implemented in rust:

```shell
Benchmark 1: rust-opendal-fs-read/target/release/test
  Time (mean ± σ):      23.8 ms ±   2.0 ms    [User: 0.4 ms, System: 23.4 ms]
  Range (min … max):    21.8 ms …  34.6 ms    121 runs
 
Benchmark 2: python-fs-read/test.py
  Time (mean ± σ):      15.6 ms ±   0.8 ms    [User: 5.5 ms, System: 10.0 ms]
  Range (min … max):    14.4 ms …  20.8 ms    166 runs
 
Summary
  python-fs-read/test.py ran
    1.52 ± 0.15 times faster than rust-opendal-fs-read/target/release/test
```

While `rust-opendal-fs-read` performs slightly better than `python-opendal-read`, indicating room for improvement in the binding & pyo3, these aren't the core issues. We need to delve deeper.

Ah, opendal fs service is slower than python.

## Rust std fs is slower than Python?

OpenDAL implement fs service via [std::fs](https://doc.rust-lang.org/std/fs/index.html). Could there be additional costs incurred by OpenDAL itself?

I implement the same logic via rust `std::fs`:

[rust-std-fs-read](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/rust-std-fs-read/src/main.rs):

```rust
use std::io::Read;
use std::fs::OpenOptions;

fn main() {
    let mut bs = vec![0; 64 * 1024 * 1024];
    let mut f = OpenOptions::new().read(true).open("/tmp/file").unwrap();
    let mut ts = 0;
    loop {
        let buf = &mut bs[ts..];
        let n = f.read(buf).unwrap();
        let n = n as usize;
        if n == 0 {
            break
        }
        ts += n;
    }

    assert_eq!(ts, 64 * 1024 * 1024);
}
```

But....

```shell
Benchmark 1: rust-std-fs-read/target/release/test
  Time (mean ± σ):      23.1 ms ±   2.5 ms    [User: 0.3 ms, System: 22.8 ms]
  Range (min … max):    21.0 ms …  37.6 ms    124 runs
 
Benchmark 2: python-fs-read/test.py
  Time (mean ± σ):      15.2 ms ±   1.1 ms    [User: 5.4 ms, System: 9.7 ms]
  Range (min … max):    14.3 ms …  21.4 ms    178 runs

Summary
  python-fs-read/test.py ran
    1.52 ± 0.20 times faster than rust-std-fs-read/target/release/test
```

Wow, Rust's std fs is slower than Python? How can that be? No offense intended, but how is that possible?

## Rust std fs is slower than Python? Really!?

I can't believe the results: rust std fs is surprisingly slower than Python.

I learned how to use `strace` for syscall analysis. [`strace`](https://strace.io/) is a Linux syscall tracer that allows us to monitor syscalls and understand their processes.

The strace will encompass all syscalls dispatched by the program. Our attention should be on aspects associated with `/tmp/file`. Each line of the strace output initiates with the syscall name, followed by input arguments and output.

For example:

```shell
openat(AT_FDCWD, "/tmp/file", O_RDONLY|O_CLOEXEC) = 3
```

Means we invoke the `openat` syscall using arguments `AT_FDCWD`, `"/tmp/file"`, and `O_RDONLY|O_CLOEXEC`. This returns output `3`, which is the file descriptor referenced in the subsequent syscall.

Alright, we've mastered `strace`. Let's put it to use!

strace of `rust-std-fs-read`:

```shell
> strace ./rust-std-fs-read/target/release/test
...
mmap(NULL, 67112960, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f290dd40000
openat(AT_FDCWD, "/tmp/file", O_RDONLY|O_CLOEXEC) = 3
read(3, "\tP\201A\225\366>\260\270R\365\313\220{E\372\274\6\35\"\353\204\220s\2|7C\205\265\6\263"..., 67108864) = 67108864
read(3, "", 0)                          = 0
close(3)                                = 0
munmap(0x7f290dd40000, 67112960)        = 0
...
```

strace of `python-fs-read`:

```shell
> strace ./python-fs-read/test.py
...
openat(AT_FDCWD, "/tmp/file", O_RDONLY|O_CLOEXEC) = 3
newfstatat(3, "", {st_mode=S_IFREG|0644, st_size=67108864, ...}, AT_EMPTY_PATH) = 0
ioctl(3, TCGETS, 0x7ffe9f844ac0)        = -1 ENOTTY (Inappropriate ioctl for device)
lseek(3, 0, SEEK_CUR)                   = 0
lseek(3, 0, SEEK_CUR)                   = 0
newfstatat(3, "", {st_mode=S_IFREG|0644, st_size=67108864, ...}, AT_EMPTY_PATH) = 0
mmap(NULL, 67112960, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f13277ff000
read(3, "\tP\201A\225\366>\260\270R\365\313\220{E\372\274\6\35\"\353\204\220s\2|7C\205\265\6\263"..., 67108865) = 67108864
read(3, "", 1)                          = 0
close(3)                                = 0
rt_sigaction(SIGINT, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=SA_RESTORER|SA_ONSTACK, sa_restorer=0x7f132be5c710}, {sa_handler=0x7f132c17ac36, sa_mask=[], sa_flags=SA_RESTORER|SA_ONSTACK, sa_restorer=0x7f132be5c710}, 8) = 0
munmap(0x7f13277ff000, 67112960)        = 0
...
```

From analyzing strace, it's clear that `python-fs-read` has more syscalls than `rust-std-fs-read`, with both utilizing `mmap`. So why python is faster than rust?

### Why we are using `mmap` here?

I initially believed `mmap` was solely for mapping files to memory, enabling file access through memory. However, `mmap` has other uses too. It's commonly used to allocate large regions of memory for applications. 

This can be seen in the strace results:

```shell
mmap(NULL, 67112960, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f13277ff000
```

This syscall means

- `NULL`: the first arg means start address of the memory region to map. `NULL` will let OS to pick up a suitable address for us.
- `67112960`: The size of the memory region to map. We are allocating 64MiB + 4KiB memory here, the extra page is used to store the metadata of this memory region.
- `PROT_READ|PROT_WRITE`: The memory region is readable and writable.
- `MAP_PRIVATE|MAP_ANONYMOUS`: 
  - `MAP_PRIVATE` means changes to this memory region will not be visible to other processes mapping the same region, and are not carried through to the underlying file (if we have).
  - `MAP_ANONYMOUS` means we are allocating anonymous memory that not related to a file.
- `-1`: The file descriptor of the file to map. `-1` means we are not mapping a file.
- `0`: The offset in the file to map from. Use `0` here since we are not mapping a file.

### But I don't use `mmap` in my code.

The `mmap` syscall is dispatched by `glibc`. We utilize `malloc` to solicit memory from the system, and in response, `glibc` employs both the `brk` and `mmap` syscalls to allocate memory according to our request size. If the requested size is sufficiently large, then `glibc` opts for using `mmap`, which helps mitigate memory fragmentation issues.

By default, all Rust programs compiled with target `x86_64-unknown-linux-gnu` use the `malloc` provided by `glibc`.

### Does python has the same memory allocator with rust?

Python, by default, utilizes [`pymalloc`](https://docs.python.org/3/c-api/memory.html#default-memory-allocators), a memory allocator optimized for small allocations. Python features three memory domains, each representing different allocation strategies and optimized for various purposes.

`pymalloc` has the following behavior:

> Python has a `pymalloc` allocator optimized for small objects (smaller or equal to 512 bytes) with a short lifetime. It uses memory mappings called “arenas” with a fixed size of either 256 KiB on 32-bit platforms or 1 MiB on 64-bit platforms. It falls back to PyMem_RawMalloc() and PyMem_RawRealloc() for allocations larger than 512 bytes.

## Rust is slower than Python with default memory allocator?

I suspect that `mmap` is causing this issue. What would occur if I switched to `jemalloc`?

[rust-std-fs-read-with-jemalloc](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/rust-std-fs-read-with-jemalloc/src/main.rs):

```rust
use std::io::Read;
use std::fs::OpenOptions;

#[global_allocator]
static GLOBAL: jemallocator::Jemalloc = jemallocator::Jemalloc;

fn main() {
    let mut bs = vec![0; 64 * 1024 * 1024];
    let mut f = OpenOptions::new().read(true).open("/tmp/file").unwrap();
    let mut ts = 0;
    loop {
        let buf = &mut bs[ts..];
        let n = f.read(buf).unwrap();
        let n = n as usize;
        if n == 0 {
            break
        }
        ts += n;
    }

    assert_eq!(ts, 64 * 1024 * 1024);
}
```

Wooooooooooooooow?!

```shell
Benchmark 1: rust-std-fs-read-with-jemalloc/target/release/test
  Time (mean ± σ):       9.7 ms ±   0.6 ms    [User: 0.3 ms, System: 9.4 ms]
  Range (min … max):     9.0 ms …  12.4 ms    259 runs
 
Benchmark 2: python-fs-read/test.py
  Time (mean ± σ):      15.8 ms ±   0.9 ms    [User: 5.9 ms, System: 9.8 ms]
  Range (min … max):    15.0 ms …  21.8 ms    169 runs

Summary
  rust-std-fs-read-with-jemalloc/target/release/test ran
    1.64 ± 0.14 times faster than python-fs-read/test.py
```

What?! I understand that `jemalloc` is a proficient memory allocator, but how can it be this exceptional? This is baffling.

## Rust is slower than Python only on my machine!

As more friends joined the discussion, we discovered that rust runs slower than python only on my machine.

My CPU:

```shell
> lscpu
Architecture:            x86_64
  CPU op-mode(s):        32-bit, 64-bit
  Address sizes:         48 bits physical, 48 bits virtual
  Byte Order:            Little Endian
CPU(s):                  32
  On-line CPU(s) list:   0-31
Vendor ID:               AuthenticAMD
  Model name:            AMD Ryzen 9 5950X 16-Core Processor
    CPU family:          25
    Model:               33
    Thread(s) per core:  2
    Core(s) per socket:  16
    Socket(s):           1
    Stepping:            0
    Frequency boost:     enabled
    CPU(s) scaling MHz:  53%
    CPU max MHz:         5083.3979
    CPU min MHz:         2200.0000
    BogoMIPS:            6787.49
    Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt pdpe1gb rdtscp lm con
                         stant_tsc rep_good nopl nonstop_tsc cpuid extd_apicid aperfmperf rapl pni pclmulqdq monitor ssse3 fma cx16 sse4_1 sse4_2 movbe popcnt aes xsave avx f
                         16c rdrand lahf_lm cmp_legacy svm extapic cr8_legacy abm sse4a misalignsse 3dnowprefetch osvw ibs skinit wdt tce topoext perfctr_core perfctr_nb bpex
                         t perfctr_llc mwaitx cpb cat_l3 cdp_l3 hw_pstate ssbd mba ibrs ibpb stibp vmmcall fsgsbase bmi1 avx2 smep bmi2 erms invpcid cqm rdt_a rdseed adx smap
                          clflushopt clwb sha_ni xsaveopt xsavec xgetbv1 xsaves cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local user_shstk clzero irperf xsaveerptr rdpru wb
                         noinvd arat npt lbrv svm_lock nrip_save tsc_scale vmcb_clean flushbyasid decodeassists pausefilter pfthreshold avic v_vmsave_vmload vgif v_spec_ctrl
                         umip pku ospke vaes vpclmulqdq rdpid overflow_recov succor smca fsrm debug_swap
Virtualization features:
  Virtualization:        AMD-V
Caches (sum of all):
  L1d:                   512 KiB (16 instances)
  L1i:                   512 KiB (16 instances)
  L2:                    8 MiB (16 instances)
  L3:                    64 MiB (2 instances)
NUMA:
  NUMA node(s):          1
  NUMA node0 CPU(s):     0-31
Vulnerabilities:
  Gather data sampling:  Not affected
  Itlb multihit:         Not affected
  L1tf:                  Not affected
  Mds:                   Not affected
  Meltdown:              Not affected
  Mmio stale data:       Not affected
  Retbleed:              Not affected
  Spec rstack overflow:  Vulnerable
  Spec store bypass:     Vulnerable
  Spectre v1:            Vulnerable: __user pointer sanitization and usercopy barriers only; no swapgs barriers
  Spectre v2:            Vulnerable, IBPB: disabled, STIBP: disabled, PBRSB-eIBRS: Not affected
  Srbds:                 Not affected
  Tsx async abort:       Not affected
```

My memory:

```shell
> sudo dmidecode --type memory
# dmidecode 3.5
Getting SMBIOS data from sysfs.
SMBIOS 3.3.0 present.

Handle 0x0014, DMI type 16, 23 bytes
Physical Memory Array
        Location: System Board Or Motherboard
        Use: System Memory
        Error Correction Type: None
        Maximum Capacity: 64 GB
        Error Information Handle: 0x0013
        Number Of Devices: 4

Handle 0x001C, DMI type 17, 92 bytes
Memory Device
        Array Handle: 0x0014
        Error Information Handle: 0x001B
        Total Width: 64 bits
        Data Width: 64 bits
        Size: 16 GB
        Form Factor: DIMM
        Set: None
        Locator: DIMM 0
        Bank Locator: P0 CHANNEL A
        Type: DDR4
        Type Detail: Synchronous Unbuffered (Unregistered)
        Speed: 3200 MT/s
        Manufacturer: Unknown
        Serial Number: 04904740
        Asset Tag: Not Specified
        Part Number: LMKUFG68AHFHD-32A
        Rank: 2
        Configured Memory Speed: 3200 MT/s
        Minimum Voltage: 1.2 V
        Maximum Voltage: 1.2 V
        Configured Voltage: 1.2 V
        Memory Technology: DRAM
        Memory Operating Mode Capability: Volatile memory
        Firmware Version: Unknown
        Module Manufacturer ID: Bank 9, Hex 0xC8
        Module Product ID: Unknown
        Memory Subsystem Controller Manufacturer ID: Unknown
        Memory Subsystem Controller Product ID: Unknown
        Non-Volatile Size: None
        Volatile Size: 16 GB
        Cache Size: None
        Logical Size: None
```

So I tried the following things:

### Enable Mitigations

CPUs possess numerous vulnerabilities that could expose private data to attackers, with `Spectre` being one of the most notable. The Linux kernel has developed various mitigations to counter these vulnerabilities and they are enabled by default. However, these mitigations can impose additional system costs. Therefore, the Linux kernel also offers a `mitigations` flag for users who wish to disable them.

I used to disable all `mitigations` like the following:

```shell
title Arch Linux
linux /vmlinuz-linux-zen
initrd /amd-ucode.img
initrd /initramfs-linux-zen.img
options root="PARTUUID=206e7750-2b89-419d-978e-db0068c79c52" rw mitigations=off
```

Enable it back didn't change the result.

### Tune Transparent Hugepage

[Transparent Hugepage](https://www.kernel.org/doc/html/next/admin-guide/mm/transhuge.html) can significantly impact performance. Most modern distributions enable it by default.

```shell
> cat /sys/kernel/mm/transparent_hugepage/enabled
[always] madvise never
```

Switching to `madvise` or `never` alters the absolute outcome, but the relative ratio remains consistent.

### Tune CPU Core Affinity

[@Manjusaka](https://github.com/ZheaoLi) guesses this related to `CPU Core Spacing`.

I tried to use [core_affinity](https://docs.rs/core_affinity/latest/core_affinity/) to bind process to specific CPU, but the result is the same.

### Measure syscall latency by eBPF

[@Manjusaka](https://github.com/ZheaoLi) also created [an eBPF program](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/scripts/read-latency.py) for me to gauge the latency of read syscalls. The findings indicate that Rust is also slower than Python at syscall level.

> There's another lengthy tale about this eBPF program that @Manjusaka should share in a post!

```shell
# python fs read
Process 57555 read file 8134049 ns
Process 57555 read file 942 ns

# rust std fs read
Process 57634 read file 24636975 ns
Process 57634 read file 1052 ns
```

Observation: On my computer, Rust operates slower than Python and it doesn't appear to be related to the software.

## C is slower than Python?

I'm quite puzzled and can't pinpoint the difference. I suspect it might have something to do with the CPU, but I'm unsure which aspect: cache? frequency? core spacing? core affinity? architecture?

Following the guidance from the Telegram group [Rust 众](https://t.me/rust_zh), I've developed a C version:

[c-fs-read](https://github.com/Xuanwo/when-i-find-rust-is-slow/blob/main/c-fs-read/test.c):

```c
#include <stdio.h>
#include <stdlib.h>

#define FILE_SIZE 64 * 1024 * 1024  // 64 MiB

int main() {
    FILE *file;
    char *buffer;
    size_t result;

    file = fopen("/tmp/file", "rb");
    if (file == NULL) {
        fputs("Error opening file", stderr);
        return 1;
    }

    buffer = (char *)malloc(sizeof(char) * FILE_SIZE);
    if (buffer == NULL) {
        fputs("Memory error", stderr);
        fclose(file);
        return 2;
    }

    result = fread(buffer, 1, FILE_SIZE, file);
    if (result != FILE_SIZE) {
        fputs("Reading error", stderr);
        fclose(file);
        free(buffer);
        return 3;
    }

    fclose(file);
    free(buffer);

    return 0;
}
```

But...

```shell
Benchmark 1: c-fs-read/test
  Time (mean ± σ):      23.8 ms ±   0.9 ms    [User: 0.3 ms, System: 23.6 ms]
  Range (min … max):    23.0 ms …  27.1 ms    120 runs

Benchmark 2: python-fs-read/test.py
  Time (mean ± σ):      19.1 ms ±   0.3 ms    [User: 8.6 ms, System: 10.4 ms]
  Range (min … max):    18.6 ms …  20.6 ms    146 runs

Summary
  python-fs-read/test.py ran
    1.25 ± 0.05 times faster than c-fs-read/test
```

The C version is also slower than Python! Does python have magic?

## C is slower than Python with specified offset!

At this time, [@lilydjwg](https://github.com/lilydjwg) has joined the discussion and noticed a difference in the memory region offset between C and Python.

> `strace -e raw=read,mmap ./program` is used to print the undecoded arguments for the syscalls: the pointer address.

strace for `c-fs-read`:

```shell
> strace -e raw=read,mmap ./c-fs-read/test
...
mmap(0, 0x4001000, 0x3, 0x22, 0xffffffff, 0) = 0x7f96d1a18000
read(0x3, 0x7f96d1a18010, 0x4000000)    = 0x4000000
close(3)                                = 0
```

strace for `python-fs-read`

```shell
> strace -e raw=read,mmap ./python-fs-read/test.py
...
mmap(0, 0x4001000, 0x3, 0x22, 0xffffffff, 0) = 0x7f27dcfbe000
read(0x3, 0x7f27dcfbe030, 0x4000001)    = 0x4000000
read(0x3, 0x7f27e0fbe030, 0x1)          = 0
close(3)                                = 0
```

In `c-fs-read`, `mmap` returns `0x7f96d1a18000`, but read syscall use `0x7f96d1a18010` as the start address, the offset is `0x10`. In `python-fs-read`, `mmap` returns `0x7f27dcfbe000`, and read syscall use `0x7f27dcfbe030` as the start address, the offset is `0x30`.

So [@lilydjwg](https://github.com/lilydjwg) tried to calling `read` with the same offset:

```shell
:) ./bench c-fs-read c-fs-read-with-offset python-fs-read
['hyperfine', 'c-fs-read/test', 'c-fs-read-with-offset/test', 'python-fs-read/test.py']
Benchmark 1: c-fs-read/test
  Time (mean ± σ):      23.7 ms ±   0.8 ms    [User: 0.2 ms, System: 23.6 ms]
  Range (min … max):    23.0 ms …  25.5 ms    119 runs

  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs. It might help to use the '--warmup' or '--prepare' options.

Benchmark 2: c-fs-read-with-offset/test
  Time (mean ± σ):       8.9 ms ±   0.4 ms    [User: 0.2 ms, System: 8.8 ms]
  Range (min … max):     8.3 ms …  10.6 ms    283 runs

Benchmark 3: python-fs-read/test.py
  Time (mean ± σ):      19.1 ms ±   0.3 ms    [User: 8.6 ms, System: 10.4 ms]
  Range (min … max):    18.6 ms …  20.0 ms    147 runs

Summary
  c-fs-read-with-offset/test ran
    2.15 ± 0.11 times faster than python-fs-read/test.py
    2.68 ± 0.16 times faster than c-fs-read/test
```

!!!

Applying an offset to `buffer` in `c-fs-read` enhances its speed, outperforming Python! Additionally, we've verified that this issue is replicable on both the `AMD Ryzen 9 5900X` and `AMD Ryzen 7 5700X`.

The new information led me to other reports about a similar issue, [Std::fs::read slow?](https://users.rust-lang.org/t/std-read-slow/85424). In this post, [@ambiso](https://github.com/ambiso) discovered that syscall performance is linked to the offset of the memory region. He noted that this CPU slows down when writing from the first `0x10` bytes of each page:

```shell
offset milliseconds
 ...
 14   130
 15   130
 16    46   <----- 0x10!
 17    48
 ...
```

## AMD Ryzen 9 5900X is slow with specified offset!

We've confirmed that this issue is related to the CPU. However, we're still unsure about its potential reasons. [@Manjusaka](https://github.com/ZheaoLi) has invited kernel developer [@ryncsn](https://github.com/ryncsn) to join the discussion.

He can reproduce the same outcome using our `c-fs-read` and `c-fs-read-with-offset` demos on `AMD Ryzen 9 5900HX`. He also attempted to profile the two programs using `perf`.

Without offset:

```shell
perf stat -d -d -d --repeat 20 ./a.out
 Performance counter stats for './a.out' (20 runs):

             30.89 msec task-clock                       #    0.968 CPUs utilized               ( +-  1.35% )
                 0      context-switches                 #    0.000 /sec
                 0      cpu-migrations                   #    0.000 /sec
               598      page-faults                      #   19.362 K/sec                       ( +-  0.05% )
        90,321,344      cycles                           #    2.924 GHz                         ( +-  1.12% )  (40.76%)
           599,640      stalled-cycles-frontend          #    0.66% frontend cycles idle        ( +-  2.19% )  (42.11%)
           398,016      stalled-cycles-backend           #    0.44% backend cycles idle         ( +- 22.41% )  (41.88%)
        43,349,705      instructions                     #    0.48  insn per cycle
                                                  #    0.01  stalled cycles per insn     ( +-  1.32% )  (41.91%)
         7,526,819      branches                         #  243.701 M/sec                       ( +-  5.01% )  (41.22%)
            37,541      branch-misses                    #    0.50% of all branches             ( +-  4.62% )  (41.12%)
       127,845,213      L1-dcache-loads                  #    4.139 G/sec                       ( +-  1.14% )  (39.84%)
         3,172,628      L1-dcache-load-misses            #    2.48% of all L1-dcache accesses   ( +-  1.34% )  (38.46%)
   <not supported>      LLC-loads
   <not supported>      LLC-load-misses
           654,651      L1-icache-loads                  #   21.196 M/sec                       ( +-  1.71% )  (38.72%)
             2,828      L1-icache-load-misses            #    0.43% of all L1-icache accesses   ( +-  2.35% )  (38.67%)
            15,615      dTLB-loads                       #  505.578 K/sec                       ( +-  1.28% )  (38.82%)
            12,825      dTLB-load-misses                 #   82.13% of all dTLB cache accesses  ( +-  1.15% )  (38.88%)
                16      iTLB-loads                       #  518.043 /sec                        ( +- 27.06% )  (38.82%)
             2,202      iTLB-load-misses                 # 13762.50% of all iTLB cache accesses  ( +- 23.62% )  (39.38%)
         1,843,493      L1-dcache-prefetches             #   59.688 M/sec                       ( +-  3.36% )  (39.40%)
   <not supported>      L1-dcache-prefetch-misses

          0.031915 +- 0.000419 seconds time elapsed  ( +-  1.31% )
```

With offset:

```shell
perf stat -d -d -d --repeat 20 ./a.out
 Performance counter stats for './a.out' (20 runs):

             15.39 msec task-clock                       #    0.937 CPUs utilized               ( +-  3.24% )
                 1      context-switches                 #   64.972 /sec                        ( +- 17.62% )
                 0      cpu-migrations                   #    0.000 /sec
               598      page-faults                      #   38.854 K/sec                       ( +-  0.06% )
        41,239,117      cycles                           #    2.679 GHz                         ( +-  1.95% )  (40.68%)
           547,465      stalled-cycles-frontend          #    1.33% frontend cycles idle        ( +-  3.43% )  (40.60%)
           413,657      stalled-cycles-backend           #    1.00% backend cycles idle         ( +- 20.37% )  (40.50%)
        37,009,429      instructions                     #    0.90  insn per cycle
                                                  #    0.01  stalled cycles per insn     ( +-  3.13% )  (40.43%)
         5,410,381      branches                         #  351.526 M/sec                       ( +-  3.24% )  (39.80%)
            34,649      branch-misses                    #    0.64% of all branches             ( +-  4.04% )  (39.94%)
        13,965,813      L1-dcache-loads                  #  907.393 M/sec                       ( +-  3.37% )  (39.44%)
         3,623,350      L1-dcache-load-misses            #   25.94% of all L1-dcache accesses   ( +-  3.56% )  (39.52%)
   <not supported>      LLC-loads
   <not supported>      LLC-load-misses
           590,613      L1-icache-loads                  #   38.374 M/sec                       ( +-  3.39% )  (39.67%)
             1,995      L1-icache-load-misses            #    0.34% of all L1-icache accesses   ( +-  4.18% )  (39.67%)
            16,046      dTLB-loads                       #    1.043 M/sec                       ( +-  3.28% )  (39.78%)
            14,040      dTLB-load-misses                 #   87.50% of all dTLB cache accesses  ( +-  3.24% )  (39.78%)
                11      iTLB-loads                       #  714.697 /sec                        ( +- 29.56% )  (39.77%)
             3,657      iTLB-load-misses                 # 33245.45% of all iTLB cache accesses  ( +- 14.61% )  (40.30%)
           395,578      L1-dcache-prefetches             #   25.702 M/sec                       ( +-  3.34% )  (40.10%)
   <not supported>      L1-dcache-prefetch-misses

          0.016429 +- 0.000521 seconds time elapsed  ( +-  3.17% )
```

He found the value of `L1-dcache-prefetches` and `L1-dcache-loads` differs a lot.

- `L1-dcache-prefetches` is the prefetches of CPU L1 data cache.
- `L1-dcache-loads` is the loads of CPU L1 data cache.

Without a specified offset, the CPU will perform more loads and prefetches of `L1-dcache`, resulting in increased syscall time.

He did a further research over the hotspot ASM:

```shell
Samples: 15K of event 'cycles:P', Event count (approx.): 6078132137
  Children      Self  Command    Shared Object         Symbol
-   94.11%     0.00%  a.out      [kernel.vmlinux]      [k] entry_SYSCALL_64_after_hwframe                                                                                                                        ◆
   - entry_SYSCALL_64_after_hwframe                                                                                                                                                                              ▒
      - 94.10% do_syscall_64                                                                                                                                                                                     ▒
         - 86.66% __x64_sys_read                                                                                                                                                                                 ▒
              ksys_read                                                                                                                                                                                          ▒
            - vfs_read                                                                                                                                                                                           ▒
               - 85.94% shmem_file_read_iter                                                                                                                                                                     ▒
                  - 77.17% copy_page_to_iter                                                                                                                                                                     ▒
                     - 75.80% _copy_to_iter                                                                                                                                                                      ▒
                        + 19.41% asm_exc_page_fault                                                                                                                                                              ▒
                       0.71% __might_fault                                                                                                                                                                       ▒
                  + 4.87% shmem_get_folio_gfp                                                                                                                                                                    ▒
                    0.76% folio_mark_accessed                                                                                                                                                                    ▒
         + 4.38% __x64_sys_munmap                                                                                                                                                                                ▒
         + 1.02% 0xffffffffae6f6fe8                                                                                                                                                                              ▒
         + 0.79% __x64_sys_execve                                                                                                                                                                                ▒
         + 0.58% __x64_sys_mmap                                                                                                                                                                                  ▒
```

Inside `_copy_to_iter`, the ASM will be:

```shell
       │     copy_user_generic():
  2.19 │       mov    %rdx,%rcx
       │       mov    %r12,%rsi
 92.45 │       rep    movsb %ds:(%rsi),%es:(%rdi)
  0.49 │       nop
       │       nop
       │       nop
```

The key difference here is the performance of `rep movsb`.

## AMD Ryzen 9 5900X is slow with FSRM!

At this time, one of my friend sent me a link about [Terrible memcpy performance on Zen 3 when using rep movsb](https://bugs.launchpad.net/ubuntu/+source/glibc/+bug/2030515). In which also pointed to `rep movsb`:

> I've found this using a memcpy benchmark at https://github.com/ska-sa/katgpucbf/blob/69752be58fb8ab0668ada806e0fd809e782cc58b/scratch/memcpy_loop.cpp (compiled with the adjacent Makefile). To demonstrate the issue, run
> 
> ./memcpy_loop -b 2113 -p 1000000 -t mmap -S 0 -D 1 0
> 
> This runs:
> - 2113-byte memory copies
> - 1,000,000 times per timing measurement
> - in memory allocated with mmap
> - with the source 0 bytes from the start of the page
> - with the destination 1 byte from the start of the page
> - on core 0.
> 
> It reports about 3.2 GB/s. Change the -b argument to 2111 and it reports over 100 GB/s. So the REP MOVSB case is about 30× slower!

`FSRM`, short for `Fast Short REP MOV`, is an innovation originally by Intel, recently incorporated into AMD as well, to enhance the speed of `rep movsb` and `rep movsd`. It's designed to boost the efficiency of copying large amounts of memory. CPUs that declare support for it will use `FSRM` as a default in `glibc`.

[@ryncsn](https://github.com/ryncsn) has conducted further research and discovered that it's not related to L1 prefetches.

> It seems that `rep movsb` performance poorly when DATA IS PAGE ALIGNED, and perform better when DATA IS NOT PAGE ALIGNED, this is very funny...

## Conclusion

In conclusion, the issue isn't software-related. Python outperforms C/Rust due to an AMD CPU bug. (I can finally get some sleep now.)

However, our users continue to struggle with this problem. Unfortunately, features like `FSRM` will be implemented in `ucode`, leaving us no choice but to wait for AMD's response. An alternative solution could be not using `FSRM` or providing a flag to disable it. Rust developers might consider switching to `jemallocator` for improved performance - a beneficial move even without the presence of AMD CPU bugs.

## Final Remarks

I spent nearly three days addressing this issue, which began with complaints from [opendal](https://github.com/apache/incubator-opendal) users and eventually led me to the CPU's ucode. 

This journey taught me a lot about `strace`, `perf` and `eBPF`. It was my first time using `eBPF` for diagnostics. I also explored various unfruitful avenues such as studying the implementations of rust's `std::fs` and Python & CPython's read implementation details. Initially, I hoped to resolve this at a higher level but found it necessary to delve deeper.

A big thank you to everyone who contributed to finding the answer:

- @beldathas from opendal's discord for identifying the problem.
- The team at [@datafuselabs](https://github.com/datafuselabs) for their insightful suggestions.
- Our friends over at [Rust 众](https://t.me/rust_zh) for their advice and reproduction efforts.
- [@Manjusaka](https://github.com/ZheaoLi) for reproducing the issue and use eBPF to investigate, which helped narrow down the problem to syscall itself.
- [@lilydjwg](https://github.com/lilydjwg) for pinpointing the root cause: a `0x20` offset in memory
- [@ryncsn](https://github.com/ryncsn) for his thorough analysis
- And a friend who shared useful links about FSRM

Looking forward to our next journey!

## Reference

- [Xuanwo/when-i-find-rust-is-slow](https://github.com/Xuanwo/when-i-find-rust-is-slow) has all the code snippets and scripts.
- [Std::fs::read slow?](https://users.rust-lang.org/t/std-read-slow/85424) is a report from rust community
- [Terrible memcpy performance on Zen 3 when using rep movsb](https://bugs.launchpad.net/ubuntu/+source/glibc/+bug/2030515) is a report to ubuntu glibc
- [binding/python: rust std fs is slower than python fs](https://github.com/apache/incubator-opendal/issues/3665)