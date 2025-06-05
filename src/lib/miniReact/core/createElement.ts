// src/lib/miniReact/core/createElement.ts
import { MiniReactElement, MiniReactNode, TextElement, FunctionComponent } from '../types';

function createTextNode(nodeValue: string | number): TextElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(nodeValue),
      children: [],
    },
  };
}

export function createElement(
  type: string | FunctionComponent,
  props: Record<string, any> | null,
  ...children: MiniReactNode[]
): MiniReactElement {
  return {
    type,
    props: {
      ...props,
      children: children
        .filter((child) => child != null)
        .map((child) =>
          typeof child === "string" || typeof child === "number"
            ? createTextNode(child)
            : child
        )
        .flat(Infinity) as MiniReactNode[],
    },
  };
}