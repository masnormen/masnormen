import fs from "node:fs";
import path from "node:path";
import { pick } from "es-toolkit";
import { marked } from "marked";
import { githubRest } from "./services/github.js";
import { getModulePaths } from "./utils/get-module-paths.js";
import { getTailwindStyles } from "./utils/get-tailwind-styles.js";

export async function ProfilePreview() {
  const readmeRawString = fs.readFileSync(
    path.join(getModulePaths(import.meta.url).dirname, "/readme/readme.md"),
    { encoding: "utf-8" },
  );
  const readmeContent = await marked.parse(readmeRawString);

  const { TailwindStyles } = await getTailwindStyles(import.meta.url);

  const {
    avatar_url,
    name,
    login: username,
    followers,
    following,
    company,
    location,
    blog,
  } = await githubRest.users
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
        <title>GitHub Profile</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-light.min.css"
          integrity="sha512-X175XRJAO6PHAUi8AA7GP8uUF5Wiv+w9bOi64i02CHKDQBsO1yy0jLSKaUKg/NhRCDYBmOLQCfKaTaXiyZlLrw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <TailwindStyles />
      </head>
      <body class="font-sans text-gray-800">
        <header class="border-gray-300 border-b bg-[#f6f8fa] px-4 py-3">
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

        <nav class="mb-4 flex border-gray-300 border-b bg-[#f6f8fa]">
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

        <div class="mx-auto flex flex-col gap-6 px-4 py-4 md:grid md:grid-cols-[256px_1fr] md:px-8 lg:grid-cols-[296px_1fr]">
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

              <div class="font-light text-gray-600 text-lg">{username}</div>

              <button
                type="button"
                class="mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-sm hover:bg-gray-200"
              >
                Follow
              </button>

              <div class="mt-4 flex gap-1 text-sm">
                <a href="#" class="text-gray-800 hover:text-blue-500">
                  <i class="fas fa-users mr-2 w-4" />
                  <strong>{followers}</strong> followers
                </a>
                <span>&middot;</span>
                <a href="#" class="text-gray-800 hover:text-blue-500">
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
              />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
