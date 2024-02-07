---
categories: Code
date: 2024-02-07T01:00:00Z
title: "How to Condense 800 Integration Tests into 80, Losslessly?"
tags:
    - rust
    - ci
---

Integration testing is a crucial component of production-ready projects. It provides developers with the confidence to implement changes and refactor, ensuring that the project functions as intended.

As the project expands, so does the number of integration tests. Maintainers might realize they're dedicating more time to these tests than to the actual code. These tests can become slow, unreliable, or difficult to maintain. To prevent this issue, it's crucial that our integration tests scale linearly with the project's growth.

I'll share my experience with [Apache OpenDAL](https://github.com/apache/opendal), where I condensed nearly 800 integration tests into 80, hoping it helps you design your own integration tests architecture.

## TL;DR

- Split Test Case
- Reuse Test Setup
- Generate Test Plan
- Manage Test Credential

## Background

[OpenDAL](https://github.com/apache/opendal), a data access layer that allows users to easily and efficiently retrieve data from various storage services in a unified way. True to its goal, OpenDAL supports an extensive range of services. As of this writing, it offers support for over 50 services, such as AWS S3, Azure Blob Storage, Google Cloud Storage, HDFS, Dropbox, among others.

![](opendal.png)

Each service may have various setups and configurations. For instance, S3 offers diverse vendors, each with unique features and limitations. Similarly, Redis supports different compatible services such as [Dragonfly](https://www.dragonflydb.io/) and [Kvrocks](https://kvrocks.apache.org/).

To further complicate matters, OpenDAL offers language bindings for several languages, such as Python, Java, and Node.js. This requires us to test the same features across various languages and services.

We need to test 40 services, totaling 68 service setups. This includes testing their behavior, fuzzing, and edge cases. Additionally, we must test our core Rust code along with Python, Java, and Node.js bindings. This creates a vast matrix of tests. Moreover, more services and components are expected to be added.

OpenDAL can't test every scenario with `TEST * SERVICE * COMPONENT`; instead, we need a scalable and seamless approach like `TEST + SERVICE + COMPONENT`. This allows us to add new tests, include more services, and incorporate fresh components without adding to our maintenance workload.

## Split Test Case

OpenDAL divides its integration tests into [behavior tests](https://github.com/apache/opendal/tree/main/core/tests/behavior), [fuzz tests](https://github.com/apache/opendal/tree/main/core/fuzz), and [edge tests](https://github.com/apache/opendal/tree/main/core/edge).

- Behavior tests assess the core functionalities of the service, encompassing almost all of OpenDAL's public API.
- Fuzz tests employ a fuzzer to create random inputs, evaluating the service's resilience.
- Edge tests examine the service's handling of extreme scenarios, such as writing files to a full disk.

All these tests use the same service setup but with different test cases, making them easier to maintain and scale. Developers can test them using a similar command, for example:

```shell
# For behavior test
OPENDAL_TEST=s3 cargo test behaivor --features=tests

# For fuzz test
OPENDAL_TEST=fs cargo +nightly fuzz run fuzz_reader
```

### Use `libtest_mimic` for behavior tests

Rust's native `libtest` excels in testing but falls short for integration tests due to its cumbersome test case and setup management. OpenDAL employs [libtest_mimic](https://github.com/LukasKalbertodt/libtest-mimic) for streamlined test case handling. This user-friendly library enables dynamic test case definition, simplifying the process.

OpenDAL uses a simple macro to define test cases.

```rust
/// Build a new async trail as a test case.
pub fn build_async_trial<F, Fut>(name: &str, op: &Operator, f: F) -> Trial
where
    F: FnOnce(Operator) -> Fut + Send + 'static,
    Fut: Future<Output = anyhow::Result<()>>,
{
    let handle = TEST_RUNTIME.handle().clone();
    let op = op.clone();

    Trial::test(format!("behavior::{name}"), move || {
        handle
            .block_on(f(op))
            .map_err(|err| Failed::from(err.to_string()))
    })
}

#[macro_export]
macro_rules! async_trials {
    ($op:ident, $($test:ident),*) => {
        vec![$(
            build_async_trial(stringify!($test), $op, $test),
        )*]
    };
}
```

Then, developers can dynamically define the test cases by simply extend the test cases.

```rust
pub fn tests(op: &Operator, tests: &mut Vec<Trial>) {
    tests.extend(async_trials!(
        op,
        test_read_full,
        ...
    ))
}

/// Read full content should match.
pub async fn test_read_full(op: Operator) -> anyhow::Result<()> {
    ...
}
```

After gathering all traits (tests), we can execute them with a simple command.

```rust
let conclusion = libtest_mimic::run(&args, tests);
conclusion.exit()
```

`libtest_mimic` mimics the built-in test harness, allowing users to directly use `cargo test` as though they're defining tests natively. There's no need to learn a new tool or write a new script!

It's clear that services have different feature sets. OpenDAL utilizes [Capability](https://opendal.apache.org/docs/rust/opendal/struct.Capability.html) to describe these differences. As part of OpenDAL's public API, tests can leverage it to verify if a service supports a specific feature.

This can be easily implemented using `libtest_mimic`; we'll create trails only for services that support the feature.

```rust
pub fn tests(op: &Operator, tests: &mut Vec<Trial>) {
    let cap = op.info().full_capability();

    if cap.read && cap.write {
        tests.extend(async_trials!(
            op,
            test_read_full,
            ...
        ))
    }
}
```

### Use `cargo-fuzz` for fuzz tests

OpenDAL utilizes [cargo-fuzz](https://github.com/rust-fuzz/cargo-fuzz) for [fuzz testing](https://github.com/apache/opendal/tree/main/core/fuzz), offering a user-friendly yet potent fuzzing solution. For generating structured data from random, unstructured input, we employ [arbitrary](https://github.com/rust-fuzz/arbitrary).

Fuzz testing without a feedback loop is ineffective. OpenDAL's fuzz tests share action definitions with behavior tests, making it straightforward for developers to integrate failed fuzz test cases into behavior tests.

For instance, cargo fuzz might fail and produce output in base64. Developers can then use this output to replicate the failure in behavior tests and display it in debug format.

```shell
> cargo +nightly fuzz fmt fuzz_reader .crash
FuzzInput {
    path: "e6056989-7c7c-4075-b975-5ae380884333",
    size: 1,
    range: BytesRange(Some(0), None),
    actions: [Next, Seek(Current(1)), Next, Seek(End(0))],
}
```

Then, developers can replicate this fuzz test in a behavior test as follows:

```rust
pub async fn test_fuzz_pr_3395_case_2(op: Operator) -> Result<()> {
    let actions = [
        ReadAction::Next,
        ReadAction::Seek(SeekFrom::Current(1)),
        ReadAction::Next,
        ReadAction::Seek(SeekFrom::End(0)),
    ];
    test_fuzz_read(op, 1, 0.., &actions).await
}
```

## Reuse Test Setup

Every integration test consists of two components: setup and testing. The setup is typically identical for all tests, while the testing varies. OpenDAL employs several GitHub Action techniques to reuse the same setup across various jobs.

We already know that GitHub can trigger a workflow within a job.

```yaml
jobs
  test_core:
    name: core / ${{ matrix.os }}
    uses: ./.github/workflows/test_behavior_core.yml
```

And GitHub can trigger an action within a step.

```yaml
jobs:
  test:
    name: ${{ matrix.cases.service }} / ${{ matrix.cases.setup }}
    steps:
      ...
      - name: Test Core
        uses: ./.github/actions/test_behavior_core
```

However, the `uses` attribute of an action is static and cannot be changed at runtime. Therefore, it's impossible for GitHub to call different actions based on the matrix configuration, such as:

```yaml
jobs:
  test:
    name: ${{ matrix.cases.service }} / ${{ matrix.cases.setup }}
    steps:
    - name: Setup Test Core
      uses: ./.github/services/${{ inputs.service }}/${{ inputs.setup }}
```

To achieve this, opendal employs a technique inspired by [jenseng/dynamic-uses](https://github.com/jenseng/dynamic-uses). It creates an action locally and uses it immediately:

```yaml
runs:
  using: "composite"
  steps:
    - name: Setup
      shell: bash
      run: |
        mkdir -p ./dynamic_test_core &&
        cat <<EOF >./dynamic_test_core/action.yml
        runs:
          using: composite
          steps:
          - name: Setup Test Core
            uses: ./.github/services/${{ inputs.service }}/${{ inputs.setup }}
          - name: Run Test Core
            shell: bash
            working-directory: core
            run: cargo test behavior --features tests,${{ inputs.feature }}
            env:
              OPENDAL_TEST: ${{ inputs.service }}
        EOF
    - name: Run
      uses: ./dynamic_test_core
```

Thus, OpenDAL only needs to maintain [various setup actions](https://github.com/apache/opendal/tree/main/.github/services), and GitHub will automatically trigger the appropriate action according to the matrix.

## Generate Test Plan

To minimize unnecessary test cases, OpenDAL features a simple [test plan generator](https://github.com/apache/opendal/blob/main/.github/scripts/test_behavior/plan.py). This script creates the test plan according to file modifications.

```rust
- name: Plan
  id: plan
  run: |
    ...
    
    # Run the workflow planner script
    PLAN=$(./.github/scripts/test_behavior/plan.py $files_changed)
    echo "Plan:"
    echo "$PLAN" | jq .
    echo "plan=$PLAN" >> $GITHUB_OUTPUT
```

This script will create a test plan in JSON for the following jobs:

In file `test_behavior.yml`:

```yaml
  test_core:
    name: core / ${{ matrix.os }}
    needs: [plan]
    if: fromJson(needs.plan.outputs.plan).components.core
    secrets: inherit
    strategy:
      matrix:
        include: ${{ fromJson(needs.plan.outputs.plan).core }}
    uses: ./.github/workflows/test_behavior_core.yml
    with:
      os: ${{ matrix.os }}
      cases: ${{ toJson(matrix.cases) }}
```

In file `test_behavior_core.yml`:

```yaml
  - name: Test Core
    uses: ./.github/actions/test_behavior_core
    with:
      setup: ${{ matrix.cases.setup }}
      service: ${{ matrix.cases.service }}
      feature: ${{ matrix.cases.feature }}
```

This approach allows OpenDAL developers to avoid duplicating similar GitHub action logic across different jobs, focusing instead on maintaining test setups. Our test matrix will be like:

![](tests.png)

## Manage Test Credential

Credentials are crucial for integration tests. OpenDAL requires credentials to test cloud services such as `s3`, `azblob`, and `dropbox`. Storing these credentials in the repository is impractical: it's difficult to manage, not scalable, and hinders collaboration.

For ASF projects, using repository credentials is significantly more complicated. OpenDAL PMC members and committers are not authorized to change the credentials. Any changes to the credentials must be submitted through a ticket to the INFRA team.

Thanks to [1Password for Open Source Projects](https://github.com/1Password/1password-teams-open-source), OpenDAL received a free 1Password team license. We invite all OpenDAL PMC members and committers to join this team, enabling us to securely share secrets. However, only PMC members will have access to read these secrets.

In GitHub Actions, we can use [1Password/load-secrets-action](https://github.com/1Password/load-secrets-action) to load secrets.

```yaml
name: aws_s3
description: 'Behavior test for AWS S3. This service is sponsored by @datafuse_labs.'

runs:
  using: "composite"
  steps:
    - name: Setup
      uses: 1password/load-secrets-action@v1
      with:
        export-env: true
      env:
        OPENDAL_S3_ROOT: op://services/s3/root
        OPENDAL_S3_BUCKET: op://services/s3/bucket
        OPENDAL_S3_ENDPOINT: op://services/s3/endpoint
        OPENDAL_S3_ACCESS_KEY_ID: op://services/s3/access_key_id
        OPENDAL_S3_SECRET_ACCESS_KEY: op://services/s3/secret_access_key
        OPENDAL_S3_REGION: op://services/s3/region
```

The only credentials maintained by the INFRA team are `OP_CONNECT_HOST` and `OP_CONNECT_TOKEN`. This operates on a delegation model: the infra team keeps the credential for accessing 1password, while PMC members manage the credentials for accessing services.

I believe this is an effective pattern for managing credentials at the ASF.

By the way, the 1Password API enforces strict rate limits, so we've also deployed our own [connect server](https://developer.1password.com/docs/connect/) to ensure our tests run without being restricted by 1Password. It's easy to deploy and maintain as well.

## Conclusion

In this article, I've shared my experience with OpenDAL in ensuring that integration tests scale linearly. We categorized the tests into behavior, fuzz, and edge tests, utilizing `libtest_mimic` and `cargo-fuzz` for management. By reusing test setups and generating a targeted test plan, we eliminated unnecessary test cases. For secure credential management, we opted for 1password.

This approach allows us to seamlessly add new test cases, support additional services, and integrate new components without increasing maintenance burdens.

I hope you find these insights useful for designing your own integration testing architecture!