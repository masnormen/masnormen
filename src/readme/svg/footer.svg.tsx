import Languages from "@/readme/svg/components/languages.svg.js";
import Stats from "@/readme/svg/components/stats.svg.js";
import { getGithubStats } from "@/utils/get-github-stats.js";
import { getTailwindStyles } from "@/utils/get-tailwind-styles.js";
import { ForeignObject } from "@/utils/svg.js";

export default async function Footer({ delay }: { delay?: number }) {
  const { TailwindStyles } = await getTailwindStyles(import.meta.url);

  const githubStat = await getGithubStats();

  const LanguageContent = await Languages({ githubStat });
  const StatsContent = await Stats({ githubStat });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      height="250"
      class="slide-in"
      style="--delay: 0.8s"
    >
      <TailwindStyles />
      {!!delay && (
        <style>{`
          :root {
            --delay: ${delay}s
          }
        `}</style>
      )}
      <ForeignObject class="fade-in relative h-full w-full">
        {/* Wave */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          class="absolute bottom-0 overflow-clip"
          viewBox="0 0 2400 800"
          opacity="0.4"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="sssurf-grad"
            >
              <stop
                stop-color="hsl(1.4, 100%, 67%)"
                stop-opacity="1"
                offset="0%"
              />
              <stop
                stop-color="hsl(167, 52%, 78%)"
                stop-opacity="1"
                offset="100%"
              />
            </linearGradient>
          </defs>
          <g
            fill="url(#sssurf-grad)"
            transform="matrix(1,0,0,1,0,-128.04043579101562)"
          >
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,31)"
              opacity="0.05"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,62)"
              opacity="0.16"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,93)"
              opacity="0.26"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,124)"
              opacity="0.37"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,155)"
              opacity="0.47"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,186)"
              opacity="0.58"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,217)"
              opacity="0.68"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,248)"
              opacity="0.79"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,279)"
              opacity="0.89"
            />
            <path
              d="M 0 324.1150206923284 Q 450 568.0736250425527 600 315.08090279325046 Q 1050 465.5595279607614 1200 336.73315369781096 Q 1650 553.43515465894 1800 321.40751438844364 Q 2250 474.8370436060088 2400 335.97685483898755 L 2400 800 L 0 800 L 0 323.14858984638096 Z"
              transform="matrix(1,0,0,1,0,310)"
              opacity="1.00"
            />
          </g>
        </svg>

        <div
          class="-translate-y-1/2 absolute top-1/2 right-0 mt-0.5 mr-16 flex h-[140px] w-[115px] justify-end opacity-90"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: LanguageContent }}
        />

        <div
          class="-translate-y-1/2 absolute top-1/2 left-0 ml-16 h-[140px] opacity-90"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: StatsContent }}
        />

        {/* <div class="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 flex h-[140px] items-center">
          🔷
        </div> */}

        {/* Circling text */}
        <div class="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 h-[140px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            class="aspect-square h-full animate-fastspin font-mono text-[1rem] text-blue-700"
          >
            <defs>
              <path
                id="circle"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fill="currentColor">
              <textPath href="#circle">MASNORMEN·NOURMAN·HAJAR·</textPath>
            </text>
          </svg>
        </div>

        {/* Circling text */}
        <div class="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 h-[70px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            class="aspect-square h-full animate-slowspin-rev font-bold font-mono text-[1rem] text-blue-700"
          >
            <defs>
              <path
                id="circle"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fill="currentColor">
              <textPath href="#circle">MASNORMEN·NOURMAN·HAJAR·</textPath>
            </text>
          </svg>
        </div>
      </ForeignObject>
    </svg>
  );
}
