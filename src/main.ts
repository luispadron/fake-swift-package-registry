import { Application, Router } from "https://deno.land/x/oak@v17.1.2/mod.ts";

import scaffoldDb from "./scaffold_db.ts";
import { getReleasesFromPackages, SwiftPackage } from "./models.ts";

// Scaffold a database
const kv = await Deno.openKv();
await scaffoldDb(kv);

// Setup routes
const router = new Router();
router
  .get("/", (context) => {
    context.response.headers.set("Content-Type", "text/html");
    context.response.body = `
      <h1>Swift Package Registry</h1>
      <p>This is a fake Swift package registry for the Swift Package Manager.</p>
      <br>
      <br>

      Try:

      <pre>
        curl https://fake-spm-registry.deno.dev/apple/swift-collections/1.1.3
      </pre>
    `;
  })
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#41-list-package-releases
  .get("/:scope/:name", async (context) => {
    const scope = context.params.scope;
    const name = context.params.name;

    context.response.headers.set("Content-Type", "application/json");
    context.response.headers.set("Content-Version", "1");

    const records = kv.list({ prefix: ["packages"] });
    const packages: SwiftPackage[] = [];
    for await (const record of records) {
      const pkg = record.value as SwiftPackage;
      if (pkg.id === `${scope}.${name}`) {
        packages.push(pkg);
      }
    }

    if (packages.length === 0) {
      context.response.status = 404;
      context.response.body = { detail: "package not found" };
    } else {
      context.response.body = getReleasesFromPackages(
        packages,
        context.request.url.toString(),
      );
    }
  })
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#42-fetch-information-about-a-package-release
  .get("/:scope/:name/:version", async (context) => {
    const scope = context.params.scope;
    const name = context.params.name;
    let version = context.params.version;
    const isZip = version.endsWith(".zip");
    if (isZip) {
      version = version.slice(0, -4);
    }

    context.response.headers.set("Content-Type", "application/json");
    context.response.headers.set("Content-Version", "1");

    const record = await kv.get(["packages", `${scope}.${name}.${version}`]);

    if (record.value === null) {
      context.response.status = 404;
      context.response.body = { detail: "release not found" };
    } else if (isZip) {
      context.response.headers.set("Content-Type", "application/zip");
      context.response.headers.set(
        "Content-Disposition",
        `attachment; filename=${name}-${version}.zip`,
      );

      const pkg = record.value as SwiftPackage;
      const repositoryURL = pkg.metadata?.repositoryURLs?.[0];
      if (repositoryURL === undefined) {
        context.response.status = 404;
        context.response.body = { detail: "release not found" };
      } else {
        const archiveURL = `archives/${name}-${version}.zip`;
        context.response.body = await Deno.readFile(archiveURL);
      }
    } else {
      context.response.body = record.value as SwiftPackage;
    }
  })
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#43-fetch-manifest-for-a-package-release
  .get("/:scope/:name/:version/Package.swift", async (context) => {
    const scope = context.params.scope;
    const name = context.params.name;
    const version = context.params.version;

    context.response.headers.set(
      "Content-Disposition",
      "attachment; filename=Package.swift",
    );
    context.response.headers.set("Content-Type", "text/x-swift");
    context.response.headers.set("Content-Version", "1");

    const record = await kv.get(["packages", `${scope}.${name}.${version}`]);

    if (record.value === null) {
      context.response.status = 404;
      context.response.body = { detail: "release not found" };
    } else {
      // We fetch from `raw.githubusercontent.com` to not actually host these files.
      const packageManifest = await fetch(
        `https://raw.githubusercontent.com/${scope}/${name}/refs/tags/${version}/Package.swift`,
      );

      context.response.body = await packageManifest.text();
    }
  })
  // Don't allow publishing
  .put("/:scope/:name/:version", (context) => {
    context.response.headers.set("Content-Type", "application/json");
    context.response.headers.set("Content-Version", "1");
    context.response.status = 405;
    context.response.body = { detail: "publishing isn't supported" };
  })
  // Example: GET /identifiers?url=https://github.com/mona/LinkedList
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#45-lookup-package-identifiers-registered-for-a-url
  .get("/identifiers", async (context) => {
    context.response.headers.set("Content-Type", "application/json");
    context.response.headers.set("Content-Version", "1");
    const urlParam = context.request.url.searchParams.get("url")!;

    // ignore .git suffix
    const url = urlParam.replace(/\.git$/, "");

    // find all packages that have a repositoryURL that match the url
    const records = kv.list({ prefix: ["packages"] });
    const packageIdentifiers: string[] = [];
    for await (const record of records) {
      const pkg = record.value as SwiftPackage;
      if (pkg.metadata?.repositoryURLs?.includes(url)) {
        packageIdentifiers.push(pkg.id);
      }
    }

    context.response.body = {
      identifiers: packageIdentifiers,
    };
  });

// Start server
const port = 8000;
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server is running at: http://localhost:${port}`);
await app.listen({ port });
