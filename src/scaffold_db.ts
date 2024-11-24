import { SwiftPackage } from "./models.ts";

export default async function scaffoldDb(kv: Deno.Kv) {
  await createPackages(kv);
}

async function createPackages(kv: Deno.Kv) {
  await createSwiftCollectionsPackages(kv);
  await createSwiftAtomicsPackage(kv);
  await createSwiftSystemPackage(kv);
  await createSwiftNIOPackage(kv);
}

async function createSwiftCollectionsPackages(kv: Deno.Kv) {
  const swiftCollectionsKey = "swift-collections";
  const versions = ["1.1.4", "1.1.3", "1.1.2"];
  const checkSumByVersion: Record<string, string> = {
    "1.1.4": "67cb89782dbb94d0c818ae6d97af289b797aa186c2fcdb929baa26613ab305c6",
    "1.1.3": "a27dfbefa40fed5973742b2146bd1ef3a5b06fb678093f803e50163f2188b498",
    "1.1.2": "70cae752fbac2eda5adf9bc3752929afd29c5725182e0ed70f1ad982b00d1f66",
  };
  await createApplePackage(
    swiftCollectionsKey,
    versions,
    checkSumByVersion,
    kv,
  );
}

async function createSwiftAtomicsPackage(kv: Deno.Kv) {
  const swiftAtomicsKey = "swift-atomics";
  const versions = ["1.2.0"];
  const checkSumByVersion: Record<string, string> = {
    "1.2.0": "fc083ca10cdfa0302475d6923764105ec4fcddd7f25eeede514b620dc4cc4f37",
  };
  await createApplePackage(swiftAtomicsKey, versions, checkSumByVersion, kv);
}

async function createSwiftSystemPackage(kv: Deno.Kv) {
  const swiftSystemKey = "swift-system";
  const versions = ["1.4.0"];
  const checkSumByVersion: Record<string, string> = {
    "1.4.0": "0edc35d24bc3b27f1b21118300428decf17dc9fc98428282d2f1f893b45efbd1",
  };
  await createApplePackage(swiftSystemKey, versions, checkSumByVersion, kv);
}

async function createSwiftNIOPackage(kv: Deno.Kv) {
  const swiftNIOPackage = "swift-nio";
  const versions = ["2.76.1"];
  const checkSumByVersion: Record<string, string> = {
    "2.76.1":
      "1160ad46e099d8cea10e9d94217f66cda3bbff5c9386d768509f2d4c0b471853",
  };
  await createApplePackage(swiftNIOPackage, versions, checkSumByVersion, kv);
}

async function createApplePackage(
  key: string,
  versions: string[],
  checkSumByVersion: Record<string, string>,
  kv: Deno.Kv,
) {
  const packages: SwiftPackage[] = versions.map((version) => ({
    id: `apple.${key}`,
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
      description: "Apple's " + key,
      repositoryURLs: ["https://github.com/apple/" + key],
    },
    publishedAt: "2022-01-31T02:22:40Z",
  }));

  for (const pkg of packages) {
    console.log(`Creating package ${pkg.id}@${pkg.version}`);
    await kv.set(["packages", `${pkg.id}.${pkg.version}`], pkg);
  }
}
