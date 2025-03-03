---
categories: Links
date: 2025-03-03T01:00:00Z
title: "ArchLinux removed deprecated repo community"
tags:
    - ArchLinux
    - Linux
---

Archlinux announced that they will remove the deprecated repository in [Cleaning up old repositories](https://archlinux.org/news/cleaning-up-old-repositories/) *via [archive.is](https://archive.is/bNG11)*

Now it's happened.

If you have seen errors like:

```shell
:) paru
:: Synchronizing package databases...
 core                                    115.5 KiB   700 KiB/s 00:00 [####################################################] 100%
 extra                                     7.7 MiB  8.90 MiB/s 00:01 [####################################################] 100%
 community.db failed to download
 archlinuxcn                            1404.2 KiB  4.06 MiB/s 00:00 [####################################################] 100%
error: failed retrieving file 'community.db' from mirrors.tuna.tsinghua.edu.cn : The requested URL returned error: 404
error: failed retrieving file 'community.db' from mirrors.ustc.edu.cn : The requested URL returned error: 404
error: failed retrieving file 'community.db' from mirrors.xjtu.edu.cn : The requested URL returned error: 404
error: failed retrieving file 'community.db' from mirrors.nju.edu.cn : The requested URL returned error: 404
error: failed retrieving file 'community.db' from mirrors.jlu.edu.cn : The requested URL returned error: 404
```

Please go check your `/etc/pacman.conf` and remove the section that is deprecated:

```shell
[community]
Include = /etc/pacman.d/mirrorlist
```

All deprecated repositories include:

- `[community]`
- `[community-testing]`
- `[testing]`
- `[testing-debug]`
- `[staging]`
- `[staging-debug]`
