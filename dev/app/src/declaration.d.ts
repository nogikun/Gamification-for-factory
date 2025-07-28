/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
// Copyright (c) 2025 KazuakiTakahashi
// All rights reserved.
