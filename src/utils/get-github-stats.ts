import fs from "node:fs";
import path from "node:path";

import { githubGql, githubRest } from "@/services/github.js";
import { getModulePaths } from "@/utils/get-module-paths.js";
import type { User } from "@octokit/graphql-schema";
import { orderBy, sum } from "es-toolkit";
import { z } from "zod";

const GITHUBSTAT_META_PATH = path.resolve(
  getModulePaths(import.meta.url).dirname,
  "../../githubstat-meta.json",
);

const GITHUBSTAT_DEV_PATH = path.resolve(
  getModulePaths(import.meta.url).dirname,
  "../../githubstat-dev.json",
);

export type GitHubStat = {
  username: string | undefined;
  repos: string[];
  stargazers: number;
  forks: number;
  languages: Record<
    string,
    {
      size: number;
      occurrences: number;
      color: string;
      percent: number;
    }
  >;
  addition: number;
  deletion: number;
  commitCount: number;
  contribOrgs: string[];
};

const EXCLUDED_LANGS = (() => {
  try {
    return z.string().array().parse(JSON.parse(process.env.EXCLUDED_LANGS!));
  } catch {
    return [];
  }
})();

const COMBINED_LANGS = (() => {
  try {
    return z
      .string()
      .array()
      .array()
      .parse(JSON.parse(process.env.COMBINED_LANGS!));
  } catch {
    return [];
  }
})();

export async function getGithubStats() {
  if (
    process.env.NODE_ENV !== "production" &&
    fs.existsSync(GITHUBSTAT_DEV_PATH)
  ) {
    const devFile = JSON.parse(
      fs.readFileSync(GITHUBSTAT_DEV_PATH, {
        encoding: "utf-8",
      }),
    ) as GitHubStat & { updatedAt: number };

    const THIRTY_MINUTES = 30 * 60 * 1000;
    if (
      "updatedAt" in devFile &&
      typeof devFile.updatedAt === "number" &&
      devFile.updatedAt + THIRTY_MINUTES > Date.now()
    ) {
      return devFile as GitHubStat;
    }
  }

  console.log("Fetching GitHub stats...");

  const getGitHubInfo = async (nextOwnedBy?: string, nextContrib?: string) => {
    const result = await githubGql<{
      viewer: Pick<
        User,
        "login" | "name" | "repositories" | "repositoriesContributedTo"
      >;
    }>(
      `
      query ($repositoriesAfter: String, $contribAfter: String) {
        viewer {
          login,
          name,
          repositories(
              first: 100,
              orderBy: {
                  field: UPDATED_AT,
                  direction: DESC
              },
              isFork: false,
              after: $repositoriesAfter
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              nameWithOwner
              stargazers {
                totalCount
              }
              forkCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
          repositoriesContributedTo(
              first: 100,
              includeUserRepositories: false,
              orderBy: {
                  field: UPDATED_AT,
                  direction: DESC
              },
              contributionTypes: [
                  COMMIT,
                  ISSUE,
                  REPOSITORY,
                  PULL_REQUEST,
                  PULL_REQUEST_REVIEW
              ]
              after: $contribAfter
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              nameWithOwner
              isInOrganization
              stargazers {
                totalCount
              }
              forkCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }`,
      {
        repositoriesAfter: nextOwnedBy ? nextOwnedBy : null,
        contribAfter: nextContrib ? nextContrib : null,
      },
    );
    return result;
  };

  let nextOwnedBy: string | undefined;
  let nextContrib: string | undefined;

  const stat: GitHubStat = {
    username: undefined,
    repos: [],
    stargazers: 0,
    forks: 0,
    languages: {},
    addition: 0,
    deletion: 0,
    commitCount: 0,
    contribOrgs: [],
  };

  while (true) {
    const result = await getGitHubInfo(nextOwnedBy, nextContrib);

    const viewer = result?.viewer;
    stat.username = viewer?.login ?? "user";

    const contribRepos = viewer?.repositoriesContributedTo;
    const ownedRepos = viewer?.repositories;

    const repos = [...(ownedRepos?.nodes ?? [])];

    for (const repo of contribRepos?.nodes ?? []) {
      if (!repo) continue;

      if (
        !stat.contribOrgs.includes(repo.nameWithOwner.split("/")[0]!) &&
        repo.isInOrganization
      ) {
        stat.contribOrgs.push(repo.nameWithOwner.split("/")[0]!);
      }
    }

    for (const repo of repos) {
      if (!repo) continue;

      if (!stat.repos.includes(repo.nameWithOwner)) {
        stat.repos.push(repo.nameWithOwner);
      }

      stat.stargazers += repo.stargazers.totalCount ?? 0;
      stat.forks += repo.forkCount ?? 0;

      for (const lang of repo.languages?.edges ?? []) {
        if (!lang) continue;
        if (EXCLUDED_LANGS.includes(lang.node.name)) continue;

        const combinedLangName = COMBINED_LANGS.find((l) =>
          l.includes(lang.node.name),
        )?.[0];
        const langName = combinedLangName ?? lang.node.name;

        if (stat.languages[langName]) {
          stat.languages[langName].size += lang.size ?? 0;
          stat.languages[langName].occurrences++;
        } else {
          stat.languages[langName] = {
            size: lang.size ?? 0,
            occurrences: 1,
            color: lang.node.color ?? "#444444",
            percent: 0,
          };
        }
      }
    }

    const hasNextPage =
      ownedRepos?.pageInfo?.hasNextPage || contribRepos?.pageInfo?.hasNextPage;

    if (!hasNextPage) break;

    nextOwnedBy = ownedRepos?.pageInfo?.endCursor ?? nextOwnedBy;
    nextContrib = contribRepos?.pageInfo?.endCursor ?? nextContrib;
  }

  const totalLangSize = sum(Object.values(stat.languages).map((l) => l.size));

  for (const lang of Object.values(stat.languages)) {
    lang.percent = 100 * (lang.size / totalLangSize);
  }

  stat.languages = Object.fromEntries(
    orderBy(Object.entries(stat.languages), [([, l]) => l.percent], ["desc"]),
  );

  for (const repoPath of stat.repos) {
    const [owner, repo] = repoPath.split("/");
    if (owner == null || repo == null) {
      continue;
    }

    const res = await githubRest.repos.getContributorsStats({
      owner,
      repo,
    });

    if (!Array.isArray(res.data) || res.data.length === 0) {
      continue;
    }

    const userContribs = res?.data?.find(
      (c) => c.author?.login === stat.username,
    );

    if (userContribs == null) continue;

    const addition = sum(userContribs.weeks.map((w) => w.a ?? 0));
    const deletion = sum(userContribs.weeks.map((w) => w.d ?? 0));
    const commitCount = sum(userContribs.weeks.map((w) => w.c ?? 0));

    stat.addition += addition;
    stat.deletion += deletion;
    stat.commitCount += commitCount;
  }

  if (fs.existsSync(GITHUBSTAT_META_PATH)) {
    const prevStatMeta = JSON.parse(
      fs.readFileSync(GITHUBSTAT_META_PATH, {
        encoding: "utf-8",
      }),
    ) as Pick<GitHubStat, "addition" | "deletion" | "commitCount">;

    if (prevStatMeta.addition > stat.addition) {
      stat.addition = prevStatMeta.addition;
    }
    if (prevStatMeta.deletion > stat.deletion) {
      stat.deletion = prevStatMeta.deletion;
    }
    if (prevStatMeta.commitCount > stat.commitCount) {
      stat.commitCount = prevStatMeta.commitCount;
    }
  }

  fs.writeFileSync(
    GITHUBSTAT_META_PATH,
    JSON.stringify(
      {
        addition: stat.addition,
        deletion: stat.deletion,
        commitCount: stat.commitCount,
      },
      null,
      2,
    ),
    {
      encoding: "utf-8",
    },
  );

  if (process.env.NODE_ENV !== "production") {
    fs.writeFileSync(
      GITHUBSTAT_DEV_PATH,
      JSON.stringify({ updatedAt: Date.now(), ...stat }, null, 2),
      {
        encoding: "utf-8",
      },
    );
  }

  return stat;
}
