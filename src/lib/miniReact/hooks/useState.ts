// src/lib/miniReact/hooks/useState.ts
import { Fiber, Hook, SetStateAction, Dispatch } from '../types';
import { setWorkInProgress } from '../core/fiber';

let wipFiber: Fiber | null = null;
let stateHookIndex: number | null = null;

export function setWipFiber(fiber: Fiber): void {
  wipFiber = fiber;
  stateHookIndex = 0;
  wipFiber.stateHooks = wipFiber.stateHooks || [];
  wipFiber.effectHooks = wipFiber.effectHooks || [];
}

export function useState<T>(initialState: T): [T, Dispatch<T>] {
  const currentFiber = wipFiber!;
  const hookIndex = stateHookIndex!;
  const oldHook = currentFiber.alternate?.stateHooks?.[hookIndex];

  const stateHook: Hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: oldHook ? oldHook.queue : [],
  };

  if (stateHook.queue.length > 0) {
    stateHook.queue.forEach((action: SetStateAction<T>) => {
      const newState = typeof action === 'function'
        ? (action as (prevState: T) => T)(stateHook.state)
        : action;
      stateHook.state = newState;
    });
    stateHook.queue = [];
  }

  currentFiber.stateHooks![hookIndex] = stateHook;
  stateHookIndex!++;

  function setState(action: SetStateAction<T>): void {
    stateHook.queue.push(action);

    if (currentFiber.return && currentFiber.return.dom) {
      const rootElement = currentFiber.return.props.children[0];
      setWorkInProgress(rootElement, currentFiber.return.dom as HTMLElement);
    }
  }

  return [stateHook.state, setState];
}
