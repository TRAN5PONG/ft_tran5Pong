// src/lib/miniReact/dom/updateDom.ts
const isEvent = (key: string): boolean => key.startsWith("on");
const isProperty = (key: string): boolean => key !== "children" && !isEvent(key);

export function updateDom(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
): void {
  if (dom instanceof Text) {
    const newValue = nextProps.nodeValue || "";
    if (prevProps.nodeValue !== newValue) {
      dom.nodeValue = newValue;
    }
    return;
  }

  // Remove old event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || prevProps[key] !== nextProps[key])
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2).replace(/^on/, '');
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(key => !(key in nextProps))
    .forEach(name => {
      (dom as any)[name] = "";
    });

  // Set new properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(key => prevProps[key] !== nextProps[key])
    .forEach(name => {
      (dom as any)[name] = nextProps[name];
    });

  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(key => prevProps[key] !== nextProps[key])
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2).replace(/^on/, '');
      dom.addEventListener(eventType, nextProps[name]);
    });
}
