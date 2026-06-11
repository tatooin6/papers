import { constants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const viewCounterFile = path.resolve(process.cwd(), "data/page-views.json");

async function fileExists(filePath) {
  try {
    await fs.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

if (await fileExists(viewCounterFile)) {
  console.log("data/page-views.json already exists.");
  process.exit(0);
}

await fs.mkdir(path.dirname(viewCounterFile), { recursive: true });
await fs.writeFile(viewCounterFile, `${JSON.stringify({ views: 0 }, null, 2)}\n`);

console.log("Created data/page-views.json.");
