import fs from "node:fs/promises";
import { toSSG } from "hono/ssg";
import { app } from "./src/index.js";

console.log("Generating static output...");

const start = performance.now();
await toSSG(app, fs, {
  dir: "dist",
  afterGenerateHook: async () => {
    await fs.copyFile("./src/readme/readme.md", "dist/readme.md");
    console.log(
      `Finished generating in ${((performance.now() - start) / 1000).toFixed(2)}s`,
    );
  },
});

await fs.cp("dist", ".", { recursive: true });
await fs.rm("dist", { recursive: true });
