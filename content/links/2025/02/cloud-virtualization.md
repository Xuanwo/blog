---
categories: Links
date: 2025-02-05T01:00:00Z
title: "Cloud virtualization: Red Hat, AWS Firecracker, and Ubicloud internals"
tags:
    - cloud
---

**[Cloud virtualization: Red Hat, AWS Firecracker, and Ubicloud internals](https://www.ubicloud.com/blog/cloud-virtualization-red-hat-aws-firecracker-and-ubicloud-internals) from [Ozgun Erdogan](https://www.linkedin.com/in/ozgune/)** [via archive.is](https://archive.is/VHcEI)

This post provides a great conclusion to cloud virtualization in the 2020s. Many things have changed since I first learned about it in the 2010s. The war between XEN and KVM has ended, new standards have emerged, and many new technologies have been introduced. Reading this post will give you a good understanding of the current state of cloud virtualization. Highly recommended.

---

> ![](layout.jpg)

Nice layout.

I want to add that inside hypervisor, the most important thing is the hardware virtualization support like [Intel VT-x](https://www.thomas-krenn.com/en/wiki/Overview_of_the_Intel_VT_Virtualization_Features), [AMD-X](https://www.techtarget.com/searchitoperations/definition/AMD-V-AMD-virtualization) and [NVIDIA vGPU](https://www.boston.co.uk/blog/2024/04/22/an-introduction-to-nvidia-vgpu.aspx).

Modern cloud virtualization focuses on leveraging hardware virtualization support to enhance performance and security. Hardly anyone uses software virtualization anymore, so we can simply disregard it.

An extra note on GPU virtualization: Unlike CPU virtualization, GPU virtualization is still in its early stages. NVIDIA vGPU is the most popular solution, but it is not yet widely adopted because it is limited to high-end NVIDIA GPUs. For GPUs that do not support virtualization, we use a technique called [fixed pass-through](https://en.wikipedia.org/wiki/GPU_virtualization#Fixed_pass-through) to assign the entire GPU to a VM.

> Red Hat Reference Architecture

I'm not happy that the author calls it `Red Hat's virtualization stack.` That makes the entire stack seem like a product from Red Hat, but it isn't.

> Firecracker aims to provide VM-level isolation guarantees and solve three challenges associated with virtualization. These are: (a) VMM and the kernel have high CPU and memory overhead for VMs, (b) VM startup takes seconds, and (c) hypervisors and VMMs can be large and complex, with a significant attack surface. They are also typically written in memory unsafe programming languages.

[firecracker](https://github.com/firecracker-microvm/firecracker) is a cool project, but I wish we could have such a project under a more open governance model instead of being solely controlled by AWS.

> Ubicloud also uses KVM, but swaps out Firecracker with the Cloud Hypervisor (CH). A large part of the CH code is based on Firecracker. Both projects are also written in Rust.

Oh, nice to know [cloud-hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor).

[Cloud Hypervisor](https://www.cloudhypervisor.org/) is governed under the Linux Foundation and supported by Alibaba, AMD, Ampere, ARM, ByteDance, Intel, Microsoft, and Tencent Cloud. In other words, every major cloud vendor—except AWS. Aha.

> Supports a more diverse set of devices, including PCI passthrough for GPUs

That's a big thing in today's AI world: every user needs access to GPUs.

> To optimize network and disk I/O on EC2 instances, AWS incrementally moved towards a model that [offloaded these software devices to hardware](https://www.youtube.com/watch?v=LabltEXk0VQ). This included first adding a network accelerator card to the host, next moving all network processing to a networking card, and then offloading calls to EBS to a remote storage card (2013 - 2016). Next, AWS offloaded the local storage device to a storage card (2017). These shifts to specialized hardware helped improve performance on the hosts, particularly for I/O bound workloads.

We will see increasing hardware offloading in the future. The challenge is how open source will interact with this trend. Eventually, we will need an open-source hardware offloading solution. Or at lease, we will need a standard interface for hardware offloading.
