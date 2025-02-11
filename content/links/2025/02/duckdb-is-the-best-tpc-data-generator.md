---
categories: Links
date: 2025-02-11T01:00:00Z
title: "duckdb is the best TPC data generator"
tags:
    - bigdata
    - duckdb
---

**[TPC-DS Extension](https://duckdb.org/docs/extensions/tpcds.html)** from [duckdb](https://duckdb.org/) [via archive.is](https://archive.is/e4TXv)

[TPC-H](https://www.tpc.org/tpch/default5.asp) and [TPC-DS](https://www.tpc.org/tpcds/default5.asp) are the most widely used big data benchmarks maintained by [TPC](https://www.tpc.org/tpcds/default5.asp). However, the TPC data generator is not open-source, requires an email submission to download, and is not actively maintained. The code is usually designed for GCC 9.x and fails to compile on newer GCC versions. Consequently, generating data for TPC-H and TPC-DS tests is often a frustrating challenge.

But hey, DuckDB to the rescue! No need to build or search for documentation—just use DuckDB instead! In this post, I will demonstrate how to use DuckDB to generate TPC test data and export it as Parquet files for loading.

---

## Install

DuckDB is widely available in various Linux distributions. You can also install it using `pip install duckdb`. On my Arch Linux system, I use `paru -S duckdb` to install it.

## Generate

Start DuckDB: just run `duckdb`—no setup, no configuration—just works, like SQLite!

If you want to store data on disk instead of just in memory, run `duckdb /path/to/duckdb.data`

The extensions [`tpch`](https://duckdb.org/docs/extensions/tpch) and [`tpcds`](https://duckdb.org/docs/extensions/tpcds) are bundled and enabled by default. This means we can directly use the functions they provide, such as:

for TPC-H:

```sql
CALL dbgen(sf = 1);
```

for TPC-DS

```sql
CALL dsdgen(sf = 1);
```

Use `sf` to control the size.

## Export

After the test data has been generated, we can use its native [`EXPORT`](https://duckdb.org/docs/sql/statements/export.html) SQL to export the in-memory data as Parquet:

```sql
EXPORT DATABASE 'tpcds_parquet' (FORMAT PARQUET);
```
