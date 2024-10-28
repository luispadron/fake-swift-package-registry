// swift-tools-version: 5.10

import PackageDescription

let package = Package(
  name: "Example",
  dependencies: [
    .package(id: "apple.swift-collections", exact: "1.1.3"),
  ],
  targets: [
    .executableTarget(
      name: "Example",
      dependencies: [
        .product(name: "Collections", package: "apple.swift-collections")
      ]
    ),
  ]
)
