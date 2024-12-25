import type { PropsWithChildren } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";

export function SVGContainer({
  children,
  style,
  ...props
}: PropsWithChildren<{ style?: string }> & JSX.IntrinsicElements["svg"]) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      {!!style && <style>{style}</style>}
      {children}
    </svg>
  );
}

export function ForeignObject({
  children,
  ...props
}: PropsWithChildren & JSX.IntrinsicElements["main"]) {
  return (
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" {...props}>
        {children}
      </div>
    </foreignObject>
  );
}
