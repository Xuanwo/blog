---
categories: Links
date: 2025-02-18T02:00:00Z
title: "AWS S3 SDK breaks its compatible services"
tags:
    - AWS
    - S3
    - OpenDAL
---

The Apache Iceberg community has raised a PR [S3: Disable strong integrity checksums](https://github.com/apache/iceberg/pull/12264) to disable the newly introduced integrity checksums in AWS S3 SDKs.

AWS has [introduced default data integrity protections for new objects in Amazon S3](https://aws.amazon.com/blogs/aws/introducing-default-data-integrity-protections-for-new-objects-in-amazon-s3/), which is a positive development. However, they have also chosen to update the default settings in all SDKs, breaking compatibility with nearly all S3-compatible services.

---

First of all, this is a good thing for me because checksums like `crc64-nvme` looks great—it's fast, secure, and has excellent SIMD support. As a user and developer, I'm excited to use it and integrate it into my projects. However, the S3 API is more than that. Many S3-compatible services are recommending that their users use the S3 SDK directly, and changing the default settings in this way can have a direct impact on their users.

For examples:

- Cloudlare R2: [An error occurred (InternalError) when calling the PutObject operation](https://community.cloudflare.com/t/an-error-occurred-internalerror-when-calling-the-putobject-operation/764905/1)
- Tigris: [If you’ve upgraded boto3 or the JavaScript S3 client in the last week, uploading files won’t work. Here’s how to fix it.](https://www.tigrisdata.com/blog/downgrade-py-js/)

> The recent AWS SDK bump introduced strong integrity checksums, and broke compatibility with many S3-compatible object storages (pre-2025 Minio, Vast, Dell EC etc).
>
> In Trino project, we received the error report (Missing required header for this request: Content-Md5) from several users and had to disable the check temporarily. We recommend disabling it in Iceberg as well. I faced this issue when I tried upgrading Iceberg library to 1.8.0 in Trino.

Although this feature is good, the AWS team has implemented it poorly by enforcing it, causing issues for many users of related services. This reminds me of the position where [Apache OpenDAL](https://github.com/apache/opendal) should stand.

OpenDAL integrates all services by directly communicating with APIs instead of relying on SDKs, protecting users from potential disruptions like this one. OpenDAL's community also takes checksum support into deep consideration and is working to find a solution that benefits users while ensuring compatibility with unsupported services.

Maybe it's time to move away from using S3 SDKs and switch to OpenDAL if you just want to access compatible services for data:

- OpenDAL has a wide range of integrations tests for s3 compatible services from minio to ceph.
- OpenDAL is governed by [the Apache OpenDAL PMC](https://people.apache.org/phonebook.html?project=opendal) under [the Apache Way](https://www.apache.org/theapacheway/) and not controlled by any business entity.
