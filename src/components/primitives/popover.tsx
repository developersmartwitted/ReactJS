import {
  Component,
  createEffect,
  JSXElement,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { createMediaQuery } from "@solid-primitives/media";
import { Icon } from "./icon";
import { mdiClose } from "@mdi/js";
import { Card } from "./card";
import { createRef } from "#lib/ref";

type Pos = "left" | "right" | "top" | "bottom";
interface Props {
  open: boolean;
  position: Pos;
  relatedTo: HTMLElement;
  children?: JSXElement;
}

export const Popover: Component<Props> = (props) => {
  const [containerRef, setContainerRef] = createRef<HTMLElement>();
  const [pos, setPos] = createStore<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMobile = createMediaQuery("(max-width: 768px)");
  const updatePos = (pos: Pos, element: HTMLElement) => {
    const container = containerRef();
    if (!container) {
      return;
    }

    const { height, width, right, bottom, top, left } =
      element.getBoundingClientRect();
    const selfBox = container.getBoundingClientRect();

    let x, y;

    switch (pos) {
      case "top":
        x = left + (width - selfBox.width) / 2;
        y = top - selfBox.height;
        break;
      case "bottom":
        x = left + (width - selfBox.width) / 2;
        y = bottom;
        break;
      case "right":
        x = right;
        y = top + (height - selfBox.height) / 2;
        break;
      case "left":
        x = left;
        y = top + (height - selfBox.height) / 2;
        break;
    }
    setPos({ x, y });
  };

  createEffect(() => props.open && updatePos(props.position, props.relatedTo));

  onMount(() => {
    const onResize = () =>
      props.open && updatePos(props.position, props.relatedTo);
    window.addEventListener("resize", onResize, { passive: true });
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  return (
    <Show when={props.open}>
      <div
        ref={setContainerRef}
        class="fixed p-3"
        classList={{ "bg-gray-50": isMobile() }}
        style={{
          inset: isMobile() ? 0 : undefined,
          left: !isMobile() ? pos.x + "px" : undefined,
          top: !isMobile() ? pos.y + "px" : undefined,
        }}
      >
        {props.children}
      </div>
    </Show>
  );
};

export default Popover;
