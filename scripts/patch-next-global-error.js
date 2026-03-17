/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const targets = [
  {
    file: path.join(projectRoot, "node_modules/next/dist/build/index.js"),
    needle:
      "const isApp404Static = staticPaths.has(_entryconstants.UNDERSCORE_NOT_FOUND_ROUTE_ENTRY);",
    insert:
      "staticPaths.delete(_entryconstants.UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY);\n            ",
  },
  {
    file: path.join(projectRoot, "node_modules/next/dist/esm/build/index.js"),
    needle:
      "const isApp404Static = staticPaths.has(UNDERSCORE_NOT_FOUND_ROUTE_ENTRY);",
    insert:
      "staticPaths.delete(UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY);\n            ",
  },
];

let patched = 0;

for (const target of targets) {
  if (!fs.existsSync(target.file)) {
    continue;
  }

  const content = fs.readFileSync(target.file, "utf8");
  if (content.includes("staticPaths.delete(") && content.includes("GLOBAL_ERROR")) {
    continue;
  }

  if (!content.includes(target.needle)) {
    throw new Error(`Patch target not found in ${target.file}`);
  }

  const updated = content.replace(
    target.needle,
    `${target.insert}${target.needle}`
  );

  fs.writeFileSync(target.file, updated, "utf8");
  patched += 1;
}

if (patched > 0) {
  console.log(`Patched Next.js global error prerender (${patched} files).`);
}
