import fs from "node:fs";
import path from "node:path";
import { getModulePaths } from "./get-module-paths.js";

export function getImageSrcs() {
  const readmeRawString = fs.readFileSync(
    path.join(getModulePaths(import.meta.url).dirname, "../readme/readme.md"),
    { encoding: "utf-8" },
  );

  const imageSrcs = new Set<string>();

  // Match Markdown image syntax ![alt](src)
  const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of readmeRawString.matchAll(markdownImageRegex)) {
    if (match[1] && /^\.?\//g.test(match[1])) {
      imageSrcs.add(match[1].replace(/^\.?\//g, ""));
    }
  }
  // Match HTML <img> tags
  const htmlImageRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;
  for (const match of readmeRawString.matchAll(htmlImageRegex)) {
    if (match[1] && /^\.?\//g.test(match[1])) {
      imageSrcs.add(match[1].replace(/^\.?\//g, ""));
    }
  }

  return Array.from(imageSrcs);
}
export function parseImageQuery(originalSrc: string) {
  const filenameRegex = /^(.*\/)?(\w[\w.-]*)(\(([^=)]+)=([^)]+)\))*\.svg/;
  const match = originalSrc.match(filenameRegex);

  if (match) {
    const directory = match[1] || "";
    const actualPath = (directory + match[2]).replace(/\/\/$/, "/");
    const searchParamsRegex = /\(([^=)]+)=([^)]+)\)/g;

    let props = undefined as Record<string, string> | undefined;
    for (const queryMatch of originalSrc.matchAll(searchParamsRegex)) {
      if (queryMatch[1] && queryMatch[2]) {
        props ??= {};
        props[queryMatch[1]] = queryMatch[2];
      }
    }

    return {
      originalSrc,
      actualPath,
      props,
    };
  }

  return null;
}
