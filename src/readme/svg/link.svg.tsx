import { getTailwindStyles } from "@/utils/get-tailwind-styles.js";
import { ForeignObject, SVGContainer } from "@/utils/svg.js";
import { sum } from "es-toolkit";

export default async function Link({
  text,
  delay,
}: { text: string; delay?: number }) {
  const { TailwindStyles } = await getTailwindStyles(import.meta.url);

  const SLIM_LETTERS = "fijlt" as const;
  const width =
    sum(
      Array.from(text).map((char) =>
        SLIM_LETTERS.includes(char.toLowerCase()) || /\W/.test(char) ? 7 : 10,
      ),
    ) + 11.5;

  return (
    <SVGContainer height="20" width={width}>
      <TailwindStyles />
      {!!delay && (
        <style>{`
          :root {
            --delay: ${delay}s
          }
        `}</style>
      )}
      <ForeignObject class="fade-in">
        <span class="font-medium text-blue-700 leading-[1]">
          {text}
          <div class="inline-block animate-bounce-side text-red-900">↗</div>
        </span>
      </ForeignObject>
    </SVGContainer>
  );
}
