// src/lib/miniReact/index.ts
import { createElement } from './core/createElement';
import { render } from './core/render';
import { useState } from './hooks/useState';
import { useEffect } from './hooks/useEffect';

export { createElement, render, useState, useEffect };
export * from './types';

const MiniReact = {
  createElement,
  render,
  useState,
  useEffect,
};

export default MiniReact;