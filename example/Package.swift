// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "Example",
  dependencies: [
    .package(id: "apple.swift-collections", .upToNextMajor(from: "1.1.4")),
  ],
  targets: [
    .executableTarget(
      name: "Example",
      dependencies: ["swift-collections"]
    ),
  ]
)
