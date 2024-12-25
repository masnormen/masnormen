import path from "node:path";
import { fileURLToPath } from "node:url";

export function getModulePaths(fileURL: string) {
  const filename = fileURLToPath(fileURL);
  const dirname = path.dirname(filename);
  return { filename, dirname };
}
