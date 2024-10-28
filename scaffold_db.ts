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
  const packages: SwiftPackage[] = versions.map((version) => ({
    id: `apple.${swiftCollectionsKey}`,
    version,
    resources: [
      {
        name: "Sources",
        type: "application/zip",
        checksum:
          "a2ac54cf25fbc1ad0028f03f0aa4b96833b83bb05a14e510892bb27dea4dc812",
      },
    ],
    metadata: {
      author: {
        name: "Apple Inc.",
      },
      description: "Commonly used data structures for Swift",
      licenseURL:
        "https://github.com/apple/swift-collections/blob/main/LICENSE",
    },
    publishedAt: new Date().toISOString(),
    originalPublicationTime: new Date().toISOString(),
    readmeURL: "https://github.com/apple/swift-collections/blob/main/README.md",
    repositoryURLs: ["https://github.com/apple/swift-collections"],
  }));

  for (const pkg of packages) {
    console.log(`Creating package ${pkg.id}@${pkg.version}`);
    await kv.set(["packages", `${pkg.id}.${pkg.version}`], pkg);
  }
}
