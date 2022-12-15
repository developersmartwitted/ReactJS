import { Component } from "solid-js";

const SVGDefs: Component = () => {
  return (
    <svg height="0" width="0">
      <defs>
        <linearGradient id="gradient" x1="0" x2="1" y1="1" y2="0">
          <stop stop-color="#6149cd" offset="0%" />
          <stop stop-color="#6149cd" offset="100%" />
        </linearGradient>
        <linearGradient id="gradient-flipped" x1="1" x2="0" y1="0" y2="1">
          <stop stop-color="#6149cd" offset="0%" />
          <stop stop-color="#6149cd" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export { SVGDefs };
