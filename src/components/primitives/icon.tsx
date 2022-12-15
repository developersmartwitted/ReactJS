import clsx from "clsx";
import { Component } from "solid-js";

interface IconProps {
  path: string;
  class?: string;
}

const Icon: Component<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" class={clsx(tw`fill-current`, props.class)}>
      <path d={props.path} />
    </svg>
  );
};

export { Icon };
