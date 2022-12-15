import clsx from "clsx";
import { Component, JSX } from "solid-js";

interface OverlayProps {
  opened: boolean;
  children?: JSX.Element;
  class?: string;
  shadeClass?: string;
  onOverlayClick?(): void;
}

const Overlay: Component<OverlayProps> = (props) => {
  return (
    <>
      <div
        class={clsx(
          tw`fixed top-0 left-0 z-40 flex items-center justify-center w-screen h-screen transition duration-300 transform`,
          props.opened ? tw`visible opacity-100` : tw`invisible opacity-0`,
          props.class
        )}
      >
        <div
          class={clsx(
            tw`absolute w-full h-full bg-black opacity-70`,
            props.shadeClass
          )}
          onClick={props.onOverlayClick}
        />
        <div class="z-0">{props.children}</div>
      </div>
    </>
  );
};

export { Overlay };
