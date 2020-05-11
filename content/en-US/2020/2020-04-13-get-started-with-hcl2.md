---
categories: Code
date: 2020-04-13T01:00:00Z
tags:
- golang
- config
- hcl
title: Get Started with HCL2
url: /2020/04/13/get-started-with-hcl2
---

[HCL] 2 is the most promising configuration language I have ever met, but the lack of document makes it hard to use, especially for developers who want to build applications using HCL 2 as config format. This article will show how to use and fully appreciate the benefits of HCL 2.

> In the following content, `HCL` means `HCL v2`, please don't confuse with `HCL v1`

## Prerequisites

To fully understand the following content, you may need the following prerequisites:

- Basic golang development experience
- Familiar with other configuration languages: `YAML`, `JSON` and so on

## Introduction

> HCL is a toolkit for creating structured configuration languages that are both human- and machine-friendly, for use with command-line tools. Although intended to be generally useful, it is primarily targeted towards devops tools, servers, etc.

HCL has been widely used in all [hashicorp] products: [terraform], [vault], [consul], [nomad], [vagrant] and [packer]. Users can configure them like following:

```hcl
io_mode = "async"

service "http" "web_proxy" {
  listen_addr = "127.0.0.1:8080"
  
  process "main" {
    command = ["/usr/local/bin/awesome-app", "server"]
  }

  process "mgmt" {
    command = ["/usr/local/bin/awesome-app", "mgmt"]
  }
}
```

instead of

```json
{
  "io_mode": "async",
  "service": {
    "http": {
      "web_proxy": {
        "listen_addr": "127.0.0.1:8080",
        "process": {
          "main": {
            "command": ["/usr/local/bin/awesome-app", "server"]
          },
          "mgmt": {
            "command": ["/usr/local/bin/awesome-app", "mgmt"]
          }
        }
      }
    }
  }
}
```

or

```yaml
id_mode: "async"
service:
    http:
      web_proxy:
        listen_addr: "127.0.0.1:8080"
        process:
          - main:
              command: 
                - "/usr/local/bin/awesome-app"
                - "server"
          - mgmt:
              command:
                - "/usr/local/bin/awesome-app"
                - "mgmt"
```

[HCL] v2 combines HCL 1.0 and [HIL], so that we can interpolate values directly:

```hcl
# Arithmetic with literals and application-provided variables
sum = 1 + addend

# String interpolation and templates
message = "Hello, ${name}!"

# Application-provided functions
shouty_message = upper(message)
```

[HCL] is both user and developer-friendly, not registered or missing block will be warned, so the developer doesn't need to guess the reason why config parse failed:

```go
TestParse: config_test.go:45: test.hcl:1,1-1: Missing required argument; The argument "name" is required, but no definition was found., and 1 other diagnostic(s)
```

## Syntax

To get started quickly, we will not cover every syntax in [HCL Native Syntax Specification](https://github.com/hashicorp/hcl/blob/hcl2/hclsyntax/spec.md). Instead, we focused on the most used subset of *structural* language.

### Attributes and Blocks

HCL is built around two constructs: attributes and blocks.

An `attribute` means to assign a value to a name.

```hcl
io_mode = "async"
debug = false
max_size = 1024 * 1024
ratio = 0.7
placehold = null
command = ["/usr/local/bin/awesome-app", "server"]
rules = {
  mainland: "mainland",
  default: "oversea"
}
```

The `identifier` before the equals sign is the `attribute` name, and the `expression` after the equals sign is the `attribute`'s value.

A block creates a child body annotated by a type and optional labels, and block's content consists of a collection of attributes and blocks.

```hcl
service "http" "web_proxy" {
  listen_addr = "127.0.0.1:8080"
  
  process {
    command = ["/usr/local/bin/awesome-app", "server"]
  }
}
```

`service` here defines a type with two required labels: every `service` following should have two `labels`. A particular block type may have any number of required labels, or it may require none as with the nested `process` block type.

A block's body content is delimited by `{` and `}`. Within the block body, further `attributes` and `blocks` may be nested, creating a hierarchy of blocks and their associated attributes.

### Identifiers

`identifier` is the name for `attribute` and `block` types.

Identifiers can contain letters, digits, underscores (`_`), and hyphens (`-`). The first character of an identifier must not be a digit, to avoid ambiguity with literal numbers.

### Comments

- `#` begins a single-line comment, ending at the end of the line.
- `//` also begins a single-line comment, as an alternative to #.
- `/*` and `*/` start and end delimiters for a comment that might span over multiple lines.

### Other tips

- MUST be UTF-8 encoding
- Invalid or non-normalized UTF-8 encoding is always a parse error
- No limit for line endings, but prefer `LF` for most case

## Using in a project

In this section, we will use `hcl` in a project. This project is designed to route DNS requests to different upstream via rules, different upstream could have different config.

> All example code is in `github.com/Xuanwo/hcl2-example`

### Config design

The config format we desired could be:

```hcl
listen = "127.0.0.1:53"


upstream "oversea" {
  type = "dot"
  addr = "185.222.222.222:853"
  tls_server_name = "public-dns-a.dns.sb"
}

upstream "mainland" {
  type = "udp"
  addr = "114.114.114.114:53"
}

rules = {
  to_mainland: "mainland",
  default: "oversea"
}
```

### Implementation

Firstly, we need to declare our config struct:

```go
type Config struct {
   Listen    string            `hcl:"listen"`
   Upstreams []*Upstream       `hcl:"upstream,block"`
   Rules     map[string]string `hcl:"rules"`
}

type Upstream struct {
   Name    string   `hcl:",label"`
   Type    string   `hcl:"type"`
   Addr    string   `hcl:"addr"`
   Options hcl.Body `hcl:",remain"`
}
```

The tags are formatted as in the following example:

```go
ThingType string `hcl:"thing_type,attr"`
```

The first is the name of the corresponding construct in configuration, while the second is a keyword giving the kind of construct expected. `gohcl` supports the following keywords:

- `attr`: default if empty, indicates that the value is to be populated from an attribute
- `block`: indicates that the value is to populated from a block
- `label`: indicates that the value is to populated from a block label
- `optional`: is the same as attr, but the field is optional
- `remain`: indicates that the value is to be populated from the remaining body after populating other fields

More tips:

- `remain`'s corresponding type should be `hcl.Body` or `hcl.Attributes`
- If there is no `remain` field, any attributes or blocks not matched will cause an error
- All fields are required as default except they have an `optional` keyword

Secondly, we need to parse the config to get a `hcl.Body`:

```go
var diags hcl.Diagnostics

file, diags := hclsyntax.ParseConfig(src, filename, hcl.Pos{Line: 1, Column: 1})
if diags.HasErrors() {
    return nil, fmt.Errorf("config parse: %w", diags)
}
```

- `src` is the config file's content in `[]byte` slice
- `filename` is used for debugging

`Diagnostic` is the struct used by `hcl` for representing information to be presented to a user about an error or anomaly in parsing or evaluating configuration, and `Diagnostics` is a slice of `Diagnostic`. All `hcl` functions will return `Diagnostics` instead of `error`, developers should check error by `diags.HasErrors()` instead of `err != nil`.

Finally, we can decode body into a struct:

```go
c = &Config{}

diags = gohcl.DecodeBody(file.Body, nil, c)
if diags.HasErrors() {
    return nil, fmt.Errorf("config parse: %w", diags)
}
```

To support different upstream type, we may want to delay the `hcl.Body` parse so that we can get strongly typed config struct:

```go
type client struct {
   cfg *Upstream

   // DoT related config
   TLSServerName string `hcl:"tls_server_name,optional"`
}

func NewClient(cfg *Upstream) (*client, error) {
   c := &client{cfg: cfg}

   var diags hcl.Diagnostics
   diags = gohcl.DecodeBody(cfg.Options, nil, c)
   if diags.HasErrors() {
      return nil, fmt.Errorf("new domain list: %w", diags)
   }

   return c, nil
}
```

One great feature for hcl is the clear error message, take the `TestParseMissingField` as an example, we are missing a `addr` here:

```go
=== RUN   TestParseMissingField
    TestParseMissingField: main_test.go:35: config parse: testdata/2.hcl:9,20-20: Missing required argument; The argument "addr" is required, but no definition was found.
--- FAIL: TestParseMissingField (0.00s)
FAIL
```

## Conclusion

[HCL] is a **strong type**, **strictly restricted**, **human readable**, **developer friendly** configuration language which suitable for rich configuration application.

## References

- Terraform's [Configuration Syntax](https://www.terraform.io/docs/configuration/syntax.html) introduce (partial contents and structure copied here for no more web pages)
- [HCL Native Syntax Specification](https://github.com/hashicorp/hcl/blob/hcl2/hclsyntax/spec.md) 

[HCL]: https://github.com/hashicorp/hcl/tree/hcl2
[HIL]: https://github.com/hashicorp/hil
[hashicorp]: https://www.hashicorp.com/
[terraform]: https://www.hashicorp.com/products/terraform/
[vault]: https://www.hashicorp.com/products/vault/
[consul]: https://www.hashicorp.com/products/consul/
[nomad]: https://www.hashicorp.com/products/nomad/
[vagrant]: https://www.vagrantup.com/
[packer]: https://www.packer.io/
