import { getModulePaths } from "@/utils/get-module-paths.js";
import { $ } from "zx";

export async function getTailwindStyles(modulePath: string) {
  const { stdout } =
    await $`./node_modules/.bin/tailwindcss -m -i src/tailwind.css --content ${getModulePaths(modulePath).filename} ./src/readme/svg.tsx`.quiet();
  const TailwindStyles = () => <style>{stdout}</style>;

  return { styleString: stdout, TailwindStyles };
}
