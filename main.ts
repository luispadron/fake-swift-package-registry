import { Application, Router } from "https://deno.land/x/oak@v17.1.2/mod.ts";

import scaffoldDb from "./scaffold_db.ts";
import { SwiftPackage } from "./models.ts";

// Scaffold a database
const kv = await Deno.openKv(":memory:");
await scaffoldDb(kv);

// Setup routes
const router = new Router();
router
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#41-list-package-releases
  .get("/:scope/:name", async (context) => {
    const records = kv.list({ prefix: ["packages"] });
    const packages: SwiftPackage[] = [];
    for await (const record of records) {
      const pkg = record.value as SwiftPackage;
      if (pkg.id === `${context.params.scope}.${context.params.name}`) {
        packages.push(pkg);
      }
    }

    if (packages.length === 0) {
      context.response.status = 404;
      context.response.body = { detail: "package not found" };
    } else {
      context.response.body = packages;
    }
  })
  // https://github.com/swiftlang/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md#42-fetch-information-about-a-package-release
  .get("/:scope/:name/:version", async (context) => {
    const record = await kv.get([
      "packages",
      `${context.params.scope}.${context.params.name}.${context.params.version}`,
    ]);

    if (record.value === null) {
      context.response.status = 404;
      context.response.body = { detail: "release not found" };
    } else {
      context.response.body = record.value as SwiftPackage;
    }
  })
  // Don't allow publishing
  .put("/:scope/:name/:version", (context) => {
    context.response.status = 405;
    context.response.body = { detail: "publishing isn't supported" };
  });

// Start server
const port = 8000;
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server is running at: http://localhost:${port}`);
await app.listen({ port });
