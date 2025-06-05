// src/lib/miniReact/dom/createDom.ts
import { Fiber } from '../types';
import { updateDom } from './updateDom';

export function createDom(fiber: Fiber): HTMLElement | Text {
  const dom = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type as string);

  updateDom(dom as HTMLElement, {}, fiber.props);
  return dom;
}