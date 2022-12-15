import clsx from "clsx";
import { Component, JSX } from "solid-js";

interface ToolbarProps {
  class?: string;
  children?: JSX.Element;
}

const Toolbar: Component<ToolbarProps> = (props) => {
  return (
    <>
      <div class="w-full h-16" />
      <div class={clsx("rounded-lg w-full h-16 fixed top-0 p-2", props.class)}>
        {props.children}
      </div>
    </>
  );
};

export { Toolbar };
