---
categories: Links
date: 2025-03-05T01:00:00Z
title: "MCP Server OpenDAL"
tags:
    - OpenDAL
    - AI
    - Python
---

I'm excited to introduce [MCP Server OpenDAL](https://github.com/Xuanwo/mcp-server-opendal), a [model context protocol](https://modelcontextprotocol.io) server for Apache OpenDAL™.

## Model Context Protocol

Before discussing MCP, we should first establish some background on model context. At its most basic level, a model can be viewed as a pure function that operates like `f(input) -> output`, meaning it has no side effects or dependencies on external states. To make meaningful use of an AI model, we must provide all relevant information needed for the task as input.

For example, when building a chatbot, we need to supply the conversation history each time we invoke the model. Otherwise, it would be unable to understand the context of the conversation. However, different AI models have different ways of handling context, making it difficult to scale and migrate between them. Following the same way like [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), we can define a standardized interface for model context so developers can easily integrate with various AI models without testing them individually. That's Model Context Protocol.

It's general architecture could be described as follows:

![](architecture.png)

AI tools will function as MCP clients and connect to various MCP servers via MCP. Each server will specify the resources or tools it has and provide a schema detailing the required input. Then, the model can utilize the tools provided by the MCP server to manage context.

## MCP Server OpenDAL

[Apache OpenDAL](https://github.com/apache/opendal) (/ˈoʊ.pən.dæl/, pronounced "OH-puhn-dal") is an Open Data Access Layer that enables seamless interaction with diverse storage services. It's development is guided by its vision of [One Layer, All Storage](https://opendal.apache.org/vision/) and its core principles: Open Community, Solid Foundation, Fast Access, Object Storage First, and Extensible Architecture.

So MCP Server OpenDAL can be used as a MCP server to provide storage services for model context. It supports various storage services such as local file system, AWS S3, Google Cloud Storage, etc. Developers can easily integrate with OpenDAL to manage model context.

This project is still in its early stages, and I'm continuing to learn more about AI and Python. It should be exciting to see how it evolves.
