// src/lib/miniReact/core/fiber.ts
import { Fiber, MiniReactNode, FunctionComponent } from '../types';
import { createDom } from '../dom/createDom';
import { updateDom } from '../dom/updateDom';
import { setWipFiber } from '../hooks/useState';
import { commitEffectHooks } from '../hooks/useEffect';

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions: Fiber[] = [];

export function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    try {
      const next = performUnitOfWork(nextUnitOfWork);
      nextUnitOfWork = next;
    } catch (error) {
      nextUnitOfWork = null;
    }
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  const isFunctionComponent = fiber.type && typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return || null;
  }
  return null;
}

function updateFunctionComponent(fiber: Fiber): void {
  setWipFiber(fiber);
  const children = [(fiber.type as FunctionComponent)(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber): void {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber: Fiber, elements: MiniReactNode[]): void {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber: Fiber | null = null;

    const isElementOrText = element && typeof element === 'object' && 'type' in element;
    const sameType = isElementOrText && oldFiber && element.type === oldFiber.type;

    if (sameType && isElementOrText) {
      newFiber = {
        type: oldFiber!.type,
        props: element.props,
        dom: oldFiber!.dom,
        return: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (isElementOrText && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        return: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling || null;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element && prevSibling) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function commitRoot(): void {
  deletions.forEach(commitWork);
  if (wipRoot?.child) {
    commitWork(wipRoot.child);
  }
  commitEffectHooks();
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitWork(fiber: Fiber | null): void {
  if (!fiber) return;

  let domParentFiber = fiber.return;
  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.return || null;
  }
  const domParent = domParentFiber?.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom && domParent) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom as HTMLElement | Text, fiber.alternate?.props || {}, fiber.props);
  } else if (fiber.effectTag === "DELETION" && domParent) {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child || null);
  commitWork(fiber.sibling || null);
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement | Text): void {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child!, domParent);
  }
}

export function setWorkInProgress(element: MiniReactNode, container: HTMLElement): void {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
    type: undefined,
    child: null,
    sibling: null,
    return: null,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

requestIdleCallback(workLoop);
