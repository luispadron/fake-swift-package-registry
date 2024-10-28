import { SwiftPackage } from "./models.ts";

export default async function scaffoldDb(kv: Deno.Kv) {
  await createPackages(kv);
}

async function createPackages(kv: Deno.Kv) {
  await createSwiftCollectionsPackages(kv);
}

async function createSwiftCollectionsPackages(kv: Deno.Kv) {
  const swiftCollectionsKey = "swift-collections";
  const versions = ["1.1.4", "1.1.3", "1.1.2"];
  const checkSumByVersion: Record<string, string> = {
    "1.1.4": "c646382695c3bfd5abcc11179d3fa1602318b105393bfae4457472bc9b7d036a",
    "1.1.3": "548a9bfdc508158bf0664f7dc163ebdd898c2c9212cfa8b3f46c1f09a428c1df",
    "1.1.2": "62249c14104d3a340c19921deffa72d58f833270878c39190cf78ade6d905bed",
  };
  const packages: SwiftPackage[] = versions.map((version) => ({
    id: `apple.${swiftCollectionsKey}`,
    version,
    resources: [
      {
        name: "source-archive",
        type: "application/zip",
        checksum: checkSumByVersion[version],
      },
    ],
    metadata: {
      author: {
        name: "Apple Inc.",
      },
      description: "Commonly used data structures for Swift",
      licenseURL:
        "https://github.com/apple/swift-collections/blob/main/LICENSE",
      originalPublicationTime: "2022-01-31T02:22:40Z",
      readmeURL:
        "https://github.com/apple/swift-collections/blob/main/README.md",
      repositoryURLs: ["https://github.com/apple/swift-collections"],
    },
    publishedAt: "2022-01-31T02:22:40Z",
  }));

  for (const pkg of packages) {
    console.log(`Creating package ${pkg.id}@${pkg.version}`);
    await kv.set(["packages", `${pkg.id}.${pkg.version}`], pkg);
  }
}
