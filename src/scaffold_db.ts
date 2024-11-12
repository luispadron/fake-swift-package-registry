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
    "1.1.4": "67cb89782dbb94d0c818ae6d97af289b797aa186c2fcdb929baa26613ab305c6",
    "1.1.3": "a27dfbefa40fed5973742b2146bd1ef3a5b06fb678093f803e50163f2188b498",
    "1.1.2": "70cae752fbac2eda5adf9bc3752929afd29c5725182e0ed70f1ad982b00d1f66",
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
