import fs from "node:fs";
import path from "node:path";
import type { RestEndpointMethodTypes } from "@octokit/rest";
import { pick } from "es-toolkit";
import { Style, css } from "hono/css";
import { marked } from "marked";
import { githubRest } from "./services/github.js";
import { getModulePaths } from "./utils/get-module-paths.js";
import { getTailwindStyles } from "./utils/get-tailwind-styles.js";

function ProfileInfo({
  readmeContent,
  avatar_url,
  name,
  login: username,
  followers,
  following,
  company,
  location,
  blog,
  darkMode = false,
}: Pick<
  RestEndpointMethodTypes["users"]["getByUsername"]["response"]["data"],
  | "avatar_url"
  | "name"
  | "login"
  | "followers"
  | "following"
  | "company"
  | "location"
  | "blog"
> & { readmeContent: string; darkMode?: boolean }) {
  return (
    <div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-4 md:grid md:grid-cols-[256px_1fr] md:px-8 lg:grid-cols-[296px_1fr]">
      <aside class="mt-2">
        <img
          src={avatar_url}
          alt={name ?? username}
          class="aspect-square w-[113px] rounded-full border border-gray-300 bg-gray-100 md:w-full"
        />

        <div class="mt-4">
          {!!name && (
            <h1 class="font-semibold text-xl leading-tight">{name}</h1>
          )}

          <div class="font-light text-lg">{username}</div>

          <button
            type="button"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-800 text-sm hover:bg-gray-200"
          >
            Follow
          </button>

          <div class="mt-4 flex gap-1 text-sm">
            <a href="#" class="hover:text-blue-500">
              <i class="fas fa-users mr-2 w-4" />
              <strong>{followers}</strong> followers
            </a>
            <span>&middot;</span>
            <a href="#" class="hover:text-blue-500">
              <strong>{following}</strong> following
            </a>
          </div>

          <div class="mt-4 hidden space-y-1 text-sm md:block">
            {!!company && (
              <p class="flex items-center gap-2">
                <i class="fas fa-building w-4" /> {company}
              </p>
            )}
            {!!location && (
              <p class="flex items-center gap-2">
                <i class="fas fa-map-marker-alt w-4" /> {location}
              </p>
            )}
            {!!blog && (
              <p class="flex items-center gap-2">
                <i class="fas fa-link w-4" />
                <a href={blog}>{blog}</a>
              </p>
            )}
          </div>
        </div>
      </aside>

      <main>
        <div class="space-y-4 rounded border border-gray-300 p-6">
          <div class="font-mono text-xs">{username}/README.md</div>
          <div
            class="markdown-body mt-4"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: readmeContent,
            }}
            style={`color-scheme: ${darkMode ? "dark" : "light"} !important;`}
            data-theme={darkMode ? "dark" : "light"}
          />
        </div>
      </main>
    </div>
  );
}

export async function ProfilePreview() {
  const readmeRawString = fs.readFileSync(
    path.join(getModulePaths(import.meta.url).dirname, "/readme/readme.md"),
    { encoding: "utf-8" },
  );
  const readmeContent = await marked.parse(readmeRawString);

  const { TailwindStyles } = await getTailwindStyles(import.meta.url);

  const githubProfileInfo = await githubRest.users
    .getByUsername({
      username: process.env.GITHUB_USERNAME!,
    })
    .then((res) =>
      pick(res.data, [
        "avatar_url",
        "name",
        "login",
        "followers",
        "following",
        "company",
        "location",
        "blog",
      ]),
    );

  return (
    <html lang="en">
      <head>
        <title>Preview</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css"
          integrity="sha512-BrOPA520KmDMqieeM7XFe6a3u3Sb3F1JBaQnrIAmWg3EYrciJ+Qqe6ZcKCdfPv26rGcgTrJnZ/IdQEct8h3Zhw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <TailwindStyles />
        <Style>{css`
          [data-theme="dark"] {
            color-scheme: dark;
            --focus-outlineColor: #1f6feb;
            --fgColor-default: #f0f6fc;
            --fgColor-muted: #9198a1;
            --fgColor-accent: #4493f8;
            --fgColor-success: #3fb950;
            --fgColor-attention: #d29922;
            --fgColor-danger: #f85149;
            --fgColor-done: #ab7df8;
            --bgColor-default: #0d1117;
            --bgColor-muted: #151b23;
            --bgColor-neutral-muted: #656c7633;
            --bgColor-attention-muted: #bb800926;
            --borderColor-default: #3d444d;
            --borderColor-muted: #3d444db3;
            --borderColor-neutral-muted: #3d444db3;
            --borderColor-accent-emphasis: #1f6feb;
            --borderColor-success-emphasis: #238636;
            --borderColor-attention-emphasis: #9e6a03;
            --borderColor-danger-emphasis: #da3633;
            --borderColor-done-emphasis: #8957e5;
            --color-prettylights-syntax-comment: #9198a1;
            --color-prettylights-syntax-constant: #79c0ff;
            --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
            --color-prettylights-syntax-entity: #d2a8ff;
            --color-prettylights-syntax-storage-modifier-import: #f0f6fc;
            --color-prettylights-syntax-entity-tag: #7ee787;
            --color-prettylights-syntax-keyword: #ff7b72;
            --color-prettylights-syntax-string: #a5d6ff;
            --color-prettylights-syntax-variable: #ffa657;
            --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
            --color-prettylights-syntax-brackethighlighter-angle: #9198a1;
            --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
            --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
            --color-prettylights-syntax-carriage-return-text: #f0f6fc;
            --color-prettylights-syntax-carriage-return-bg: #b62324;
            --color-prettylights-syntax-string-regexp: #7ee787;
            --color-prettylights-syntax-markup-list: #f2cc60;
            --color-prettylights-syntax-markup-heading: #1f6feb;
            --color-prettylights-syntax-markup-italic: #f0f6fc;
            --color-prettylights-syntax-markup-bold: #f0f6fc;
            --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
            --color-prettylights-syntax-markup-deleted-bg: #67060c;
            --color-prettylights-syntax-markup-inserted-text: #aff5b4;
            --color-prettylights-syntax-markup-inserted-bg: #033a16;
            --color-prettylights-syntax-markup-changed-text: #ffdfb6;
            --color-prettylights-syntax-markup-changed-bg: #5a1e02;
            --color-prettylights-syntax-markup-ignored-text: #f0f6fc;
            --color-prettylights-syntax-markup-ignored-bg: #1158c7;
            --color-prettylights-syntax-meta-diff-range: #d2a8ff;
            --color-prettylights-syntax-sublimelinter-gutter-mark: #3d444d;
          }

          [data-theme="light"] {
            color-scheme: light;
            --focus-outlineColor: #0969da;
            --fgColor-default: #1f2328;
            --fgColor-muted: #59636e;
            --fgColor-accent: #0969da;
            --fgColor-success: #1a7f37;
            --fgColor-attention: #9a6700;
            --fgColor-danger: #d1242f;
            --fgColor-done: #8250df;
            --bgColor-default: #ffffff;
            --bgColor-muted: #f6f8fa;
            --bgColor-neutral-muted: #818b981f;
            --bgColor-attention-muted: #fff8c5;
            --borderColor-default: #d1d9e0;
            --borderColor-muted: #d1d9e0b3;
            --borderColor-neutral-muted: #d1d9e0b3;
            --borderColor-accent-emphasis: #0969da;
            --borderColor-success-emphasis: #1a7f37;
            --borderColor-attention-emphasis: #9a6700;
            --borderColor-danger-emphasis: #cf222e;
            --borderColor-done-emphasis: #8250df;
            --color-prettylights-syntax-comment: #59636e;
            --color-prettylights-syntax-constant: #0550ae;
            --color-prettylights-syntax-constant-other-reference-link: #0a3069;
            --color-prettylights-syntax-entity: #6639ba;
            --color-prettylights-syntax-storage-modifier-import: #1f2328;
            --color-prettylights-syntax-entity-tag: #0550ae;
            --color-prettylights-syntax-keyword: #cf222e;
            --color-prettylights-syntax-string: #0a3069;
            --color-prettylights-syntax-variable: #953800;
            --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
            --color-prettylights-syntax-brackethighlighter-angle: #59636e;
            --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
            --color-prettylights-syntax-invalid-illegal-bg: #82071e;
            --color-prettylights-syntax-carriage-return-text: #f6f8fa;
            --color-prettylights-syntax-carriage-return-bg: #cf222e;
            --color-prettylights-syntax-string-regexp: #116329;
            --color-prettylights-syntax-markup-list: #3b2300;
            --color-prettylights-syntax-markup-heading: #0550ae;
            --color-prettylights-syntax-markup-italic: #1f2328;
            --color-prettylights-syntax-markup-bold: #1f2328;
            --color-prettylights-syntax-markup-deleted-text: #82071e;
            --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
            --color-prettylights-syntax-markup-inserted-text: #116329;
            --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
            --color-prettylights-syntax-markup-changed-text: #953800;
            --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
            --color-prettylights-syntax-markup-ignored-text: #d1d9e0;
            --color-prettylights-syntax-markup-ignored-bg: #0550ae;
            --color-prettylights-syntax-meta-diff-range: #8250df;
            --color-prettylights-syntax-sublimelinter-gutter-mark: #818b98;
          }
        `}</Style>
      </head>
      <body class="overflow-x-hidden font-sans">
        <header class="overflow-x-hidden border-gray-300 border-b bg-[#f6f8fa] px-4 py-3">
          <nav>
            <a href="#" aria-label="Homepage">
              <svg
                height="32"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="32"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
            </a>
          </nav>
        </header>

        <nav class="mb-4 flex overflow-x-clip border-gray-300 border-b bg-[#f6f8fa]">
          <a
            href="#"
            class="border-orange-400 border-b-2 px-4 py-2 font-medium text-gray-800 text-sm"
          >
            Overview
          </a>
          <a href="#" class="px-4 py-2 font-medium text-gray-800 text-sm">
            Repositories
          </a>
          <a href="#" class="px-4 py-2 font-medium text-gray-800 text-sm">
            Projects
          </a>
          <a href="#" class="px-4 py-2 font-medium text-gray-800 text-sm">
            Packages
          </a>
          <a href="#" class="px-4 py-2 font-medium text-gray-800 text-sm">
            Stars
          </a>
        </nav>

        <div
          class="py-8 text-gray-800"
          style="color-scheme: light !important;"
          data-theme="light"
        >
          <ProfileInfo readmeContent={readmeContent} {...githubProfileInfo} />
        </div>
        <hr />
        <div
          class="bg-[#0d1117] py-4 text-[#f0f6fc]"
          style="color-scheme: dark !important;"
          data-theme="dark"
        >
          <ProfileInfo
            readmeContent={readmeContent}
            {...githubProfileInfo}
            darkMode
          />
        </div>
      </body>
    </html>
  );
}
