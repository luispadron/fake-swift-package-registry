# Fake Swift Package Registry - A test implementation

This is a test implementation of a
[Swift package registry](https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md),
using [Deno](https://deno.com/).

**It is not intended for production use. It is a read-only implementation that
serves the packages over in: [scaffold_db.ts](./scaffold_db.ts).**

You can use this as part of a CI/CD pipeline to test your Swift package manager
tooling against a fake registry.

## Usage

```bash
deno task start
```

## Example

```bash
curl http://localhost:8000/apple/swift-collections/1.1.4 | jq
```

```json
{
  "id": "apple.swift-collections",
  "version": "1.1.4",
  "resources": [
    {
      "name": "Sources",
      "type": "application/zip",
      "checksum": "a2ac54cf25fbc1ad0028f03f0aa4b96833b83bb05a14e510892bb27dea4dc812"
    }
  ],
  "metadata": {
    "author": {
      "name": "Apple Inc."
    },
    "description": "Commonly used data structures for Swift",
    "licenseURL": "https://github.com/apple/swift-collections/blob/main/LICENSE"
  },
  "publishedAt": "2024-10-28T05:50:50.185Z",
  "originalPublicationTime": "2024-10-28T05:50:50.185Z",
  "readmeURL": "https://github.com/apple/swift-collections/blob/main/README.md",
  "repositoryURLs": [
    "https://github.com/apple/swift-collections"
  ]
}
```
