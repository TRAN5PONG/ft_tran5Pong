// src/lib/miniReact/jsx.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any; // Allow any HTML element with any props
  }

  interface Element {
    type: string | FunctionComponent;
    props: {
      children: any[];
      [key: string]: any;
    };
  }

  interface ElementChildrenAttribute {
    children: {};
  }

  type ElementType = string | FunctionComponent;
}

type FunctionComponent = (props: any) => JSX.Element | null;