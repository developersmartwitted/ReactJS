import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import clsx from "clsx";
import { computePosition, autoUpdate } from "@floating-ui/dom";
import { Card } from "./card";
import { createRef } from "#lib/ref";
import { Portal } from "solid-js/web";

interface MenuProps {
  children: JSX.Element;
  anchor: JSX.Element;
  class?: string;
  cardClass?: string;
  opened: boolean;
  onOutsideClick?(): void;
}

const Menu: Component<MenuProps> = (props) => {
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [referenceRef, setReferenceRef] = createRef<HTMLElement>();
  const [floatingRef, setFloatingRef] = createRef<HTMLElement>();
  const [cleanupRef, setCleanupRef] = createRef<() => void>();
  const updatePosition = async (): Promise<void> => {
    const referenceElement = referenceRef();
    const floatingElement = floatingRef();

    if (referenceElement && floatingElement) {
      const { x, y } = await computePosition(
        referenceElement,
        floatingElement,
        {
          middleware: [], //[shift(), flip(), hide()],
          placement: "bottom-start",
        }
      );

      setPosition({ x: x || 0, y: y || 0 });
    }
  };

  onMount(() => {
    const referenceElement = referenceRef();
    const floatingElement = floatingRef();

    if (referenceElement && floatingElement) {
      setCleanupRef(
        autoUpdate(referenceElement, floatingElement, updatePosition)
      );
    }
  });
  onCleanup(() => {
    cleanupRef()?.();
  });

  return (
    <div class={clsx(tw`relative`, props.class)} ref={setReferenceRef}>
      {props.anchor}
      <Card
        ref={setFloatingRef}
        style={{ left: `${position().x}px`, top: `${position().y}px` }}
        class={clsx(
          tw`absolute left-0 top-0 min-w-[16rem] shadow-2xl z-10 p-3`,
          props.opened ? "visible" : "invisible pointer-events-none",
          props.cardClass
        )}
      >
        {props.children}
      </Card>
      <Show when={props.opened}>
        <Portal>
          <div
            class="fixed top-0 left-0 w-full h-full"
            onClick={props.onOutsideClick}
          />
        </Portal>
      </Show>
    </div>
  );
};

export { Menu };
