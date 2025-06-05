// src/lib/miniReact/hooks/useEffect.ts
import { Fiber, EffectHook } from '../types';

let wipFiber: Fiber | null = null;
let wipRoot: Fiber | null = null;

export function useEffect(callback: () => void | (() => void), deps?: any[]): void {
  const effectHook: EffectHook = {
    callback,
    deps,
    cleanup: undefined,
  };
  wipFiber!.effectHooks!.push(effectHook);
}

function isDepsEqual(deps: any[] | undefined, newDeps: any[] | undefined): boolean {
  if (!deps || !newDeps || deps.length !== newDeps.length) {
    return false;
  }
  return deps.every((dep, i) => dep === newDeps[i]);
}

export function commitEffectHooks(): void {
  function runCleanup(fiber: Fiber | null): void {
    if (!fiber) return;
    fiber.alternate?.effectHooks?.forEach((hook, index) => {
      const deps = fiber.effectHooks?.[index]?.deps;
      if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
        hook.cleanup?.();
      }
    });
    runCleanup(fiber.child || null);
    runCleanup(fiber.sibling || null);
  }

  function run(fiber: Fiber | null): void {
    if (!fiber) return;
    fiber.effectHooks?.forEach((newHook, index) => {
      if (!fiber.alternate) {
        const result = newHook.callback();
        if (typeof result === 'function') {
          newHook.cleanup = result;
        }
        return;
      }
      if (!newHook.deps) {
        const result = newHook.callback();
        if (typeof result === 'function') {
          newHook.cleanup = result;
        }
      }
      if (newHook.deps?.length) {
        const oldHook = fiber.alternate?.effectHooks?.[index];
        if (!isDepsEqual(oldHook?.deps, newHook.deps)) {
          const result = newHook.callback();
          if (typeof result === 'function') {
            newHook.cleanup = result;
          }
        }
      }
    });
    run(fiber.child || null);
    run(fiber.sibling || null);
  }

  runCleanup(wipRoot);
  run(wipRoot);
}