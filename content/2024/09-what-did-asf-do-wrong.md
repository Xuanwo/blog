---
categories: Code
date: 2024-09-02T01:00:00Z
title: "What did ASF do wrong?"
tags:
    - asf
    - open-source
---

[The ASF](https://www.apache.org/) celebrates its 25th anniversary this year. It’s remarkable for a non-profit software organization to thrive for so long. It was founded before the turn of the century, and many things have changed since then.

Open sourcing has become increasingly significant in today’s world, and open source collaboration happens more frequently. Different countries have established or are in the process of establishing laws to regulate open source development. Software foundations like the ASF are facing more and more challenges. However, at the same time, the ASF’s reputation and public recognition seem to have weakened.

So, what has the ASF done wrong? What steps should we take to attract more contributors and projects? How can we make the ASF a welcoming home for new and modern projects?

## Background

I’m Xuanwo, born in the 1990s, and I began contributing to open source projects in 2013. The first ASF project I became deeply involved with is OpenDAL, which entered the incubator on February, 2023, and graduated on January, 2024. Currently, I am actively working on projects like Arrow, Iceberg, and Paimon. I became an ASF member in March 2024.

I am certainly not the best person to comment on an organization with a 25-year history. However, I would like to offer a perspective for the community to understand how people like me think about the ASF. I hope we can collaborate to find ways to improve the ASF and bring about positive changes.

## Open Communications is Spirit, Not Dogma

The most well-known aspect of the ASF is [The Apache Way](https://www.apache.org/theapacheway/). Everyone in the ASF talks about The Apache Way, and every project claims to follow it.

The Apache Way page states that:

> The Apache Way is a living, breathing interpretation of one’s experience with our community-led development process.

However, after 25 years, the essence of the Apache way no longer seems to be alive and thriving. Many people and projects have started following the Apache way in a dogmatic manner.

The most problematic issue for me is "Open Communications." In the mindset of many people, open communication is equated with mailing lists. I have observed two negative patterns in this context. First, some projects strictly adhere to mailing list communication. Whenever users or developers reach out, they are told to discuss it on the mailing list. However, this discussion never actually takes place, and the users or developers simply lose interest and leave. Second, some projects treat mailing lists as more of a symbolic gesture. They never engage in meaningful discussions on the mailing list. Instead, they carry out releases and nominations merely because it’s a requirement or because their mentors have instructed them to do so.

I want to declare that "Community Over Communication." Communication is only meaningful in places where a community exists. It's 2024 now, and the ASF should recognize and embrace the new trend: new developers, especially Gen Z, don't use mailing lists. Gone are the days when simply having a project meant people would naturally join in. We need to step outside our comfort zones and actively reach out to potential contributors. Communication should happen within the community.

Mailing lists are great for archiving. Let's keep them as archives. Beyond that, let's allow projects to choose the communication tools they prefer, as long as all communications can be captured and stored.

## Release process is slow; it should be automated.

The ASF’s release process is known to be lengthy and complex. It requires the release manager to dedicate entire days to the process, with many individuals manually verifying releases. Additionally, there is a mandatory three-day waiting period before the vote can pass.

Every time I begin working on setting up the release process, I wonder why the ASF has not implemented an automated system for releases. The release process should be as simple and fast as approving a PR.

Based on my experience in the incubator, most projects are quite similar. Why can’t we have a dedicated Tools PMC to develop utilities that assist projects with license checks, notice checks, and similar tasks? This approach would be much easier to follow.

By 2024, we should adopt [sigstore](https://www.sigstore.dev/) and mechanism like [Github Artifact Attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds) to sign artifacts using our identity (e.g., GitHub accounts) instead of relying on GPG keys. By integrating closely with GitHub or GitLab, we could create a workflow that automatically signs artifacts and uploads to SVN. Developers would only need to review and approve the release PR.

Combining all these elements, we could establish an automated release workflow where:

- CI is mandatory for every project involved.
- Once we prepare for a release, all checks are run in CI, and votes are collected.
- After the CI passes, real tags are pushed, and everything is released automatically.

Managing releases doesn’t need to be a burdensome task—it should be as straightforward as handling a PR. By 2024, with tools like GitHub Actions and Sigstore, there’s no reason to handle these tasks manually. People’s valuable time should be spent making decisions, not performing repetitive work.

## Conclusion

There have been some discussions within the ASF about making changes. I have written down my thoughts and shared them with the broader community to gather feedback. The ASF holds a strong belief in building software for the public good but has a poor reputation for being slow, outdated, and clumsy.

We are at the beginning of a new era where AI, open source, and laws are becoming increasingly complex. I hope we can implement some changes within the ASF to prepare for the next 25 years and tackle all the challenges ahead.
