import type { GitHubStat } from "@/utils/get-github-stats.js";
import { getTailwindStyles } from "@/utils/get-tailwind-styles.js";

export default async function Languages({
  githubStat,
}: { githubStat: GitHubStat }) {
  const { TailwindStyles } = await getTailwindStyles(import.meta.url);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%">
      <TailwindStyles />

      <foreignObject width="100%" height="100%">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="flex h-full flex-col flex-wrap justify-center"
        >
          <ul class="flex flex-col gap-1 font-mono text-[11px] text-blue-700">
            {Object.entries(githubStat.languages)
              .slice(0, 8)
              .map(([lang, data], idx) => (
                <li key={lang} class="flex flex-row items-center gap-1">
                  <div
                    class="inline aspect-square h-2 w-2 rounded-full border border-blue-700 bg-[var(--dot-color)]"
                    style={`--dot-color: ${data.color};`}
                  />
                  <span class="font-semibold">{lang}</span>
                  <span class="text-[9px]">{data.percent.toFixed(2)}%</span>
                </li>
              ))}
          </ul>
        </div>
      </foreignObject>
    </svg>
  );
}
