---
categories: Links
date: 2025-02-12T01:00:00Z
title: "GitHub Helps OpenDAL GHAC Service Migration"
tags:
    - opendal
    - github
    - ghac
---

[OpenDAL](https://github.com/apache/opendal) received an issue from the GitHub staff regarding [Time Sensitive: GitHub Actions Cache Service Integration](https://github.com/apache/opendal/issues/5620), reported by [Bassem Dghaidi](https://github.com/Link-), who works on GitHub Actions. [via archive.is](https://archive.is/2zy1r)

---

[Apache OpenDAL](https://github.com/apache/opendal) is an Open Data Access Layer that facilitates seamless interaction with various storage services. It offers a service called [ghac](https://docs.rs/opendal/latest/opendal/services/struct.Ghac.html), which enables OpenDAL users to access the GitHub Actions Cache Service just like other storage services such as AWS S3. This service is utilized by [sccache](https://github.com/mozilla/sccache) and [pants](https://github.com/pantsbuild/pants) to store and retrieve build artifacts, accelerating the build process.

However, `ghac` itself is not a public API service provided by GitHub. We implemented it by studying the code of [actions/cache](https://github.com/actions/cache) and replicating the same logic in OpenDAL.

So technically, OpenDAL is not a typical user of GHAC, and conversely, GitHub has no responsibility for OpenDAL's use of GHAC.

That's why I really appreciate the GitHub team, especially [Bassem Dghaidi](https://github.com/Link-), for their support and helpful notifications.

> We have identified that this project is integrating with the legacy cache service without using the official and supported package. Unfortunately, that means that you have to introduce code changes in order to be compatible with the new service we're rolling out.

I believe it's important to include the API version and User-Agent in API design. This ensures you can identify which version of the API users are accessing and which user agent is being used to interact with the service.

Also, from the user's side: Unless you have a specific reason to remain anonymous in certain cases, I encourage you to follow the same approach—let the service know who you are.

> The new service uses an entirely new set of internal API endpoints. To help with your changes we have provided the proto definitions below to help generate compatible clients to speed up your migration.
>
> These internal APIs were never intended for consumption the way your project is at the moment. Since this is not a paved path we endorse, it's possible there will be breaking changes in the future. We are reaching out as a courtesy because we do not wish to break the workflows dependent on this project.

Wow, this guy even provided the proto definitions! I'm almost in tears seeing words like, "We do not wish to break the workflows dependent on this project."

I mean, they didn’t have to—it's not part of their business. They could have simply blamed OpenDAL and other clients relying on GHAC, saying, "This is not a paved path we endorse." It would have been enough just to give us a heads-up before the breakage. But instead, they went the extra mile, showed up, and even provided the proto definitions to help us with the migration.

Good job!

> Please introduce the necessary changes ASAP before the end of February. Otherwise, storing and retrieving cache entries will start to fail. There will be no need to offer backward compatibility as the new service will be rolled out to all repositories by February 13th 2025.

I have created a tracking issue: [Tracking issue for GHAC service upgrade](https://github.com/apache/opendal/issues/5621). Feel free to check it out!
