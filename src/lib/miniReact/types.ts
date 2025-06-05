// src/lib/miniReact/types.ts
export interface MiniReactElement {
  type: string | FunctionComponent;
  props: {
    children: MiniReactNode[];
    [key: string]: any;
  };
}

export interface TextElement {
  type: "TEXT_ELEMENT";
  props: {
    nodeValue: string;
    children: never[];
  };
}

export type MiniReactNode = MiniReactElement | TextElement | string | number | null;

export interface Fiber {
  type?: string | FunctionComponent;
  props: {
    children: MiniReactNode[];
    [key: string]: any;
  };
  dom?: HTMLElement | Text | null;
  return?: Fiber | null;
  child?: Fiber | null;
  sibling?: Fiber | null;
  alternate?: Fiber | null;
  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION";
  stateHooks?: Hook[];
  effectHooks?: EffectHook[];
}

export interface Hook {
  state: any;
  queue: any[];
}

export interface EffectHook {
  callback: () => void | (() => void);
  deps?: any[];
  cleanup?: () => void;
}

export type SetStateAction<T> = T | ((prevState: T) => T);
export type Dispatch<T> = (action: SetStateAction<T>) => void;

export type FunctionComponent<P = {}> = (props: P) => MiniReactElement | null;
