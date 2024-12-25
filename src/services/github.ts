import { graphql } from "@octokit/graphql";
// import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "@octokit/rest";

export const githubGql = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

// const Octokit = OriginalOctokit.plugin(throttling);

export const githubRest = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
