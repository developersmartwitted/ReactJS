import { Button } from "./button";
import { Card } from "./card";
import { Overlay } from "./overlay";
import clsx from "clsx";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  on,
  onMount,
} from "solid-js";
import { computePosition, hide } from "@floating-ui/dom";
import { createRef } from "#lib/ref";

type DropdownPosition = "start" | "center" | "end";

interface DropdownProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  class?: string;
  wrapperClass?: string;
  position?: DropdownPosition;
  children: JSX.Element;
  activatorButton(opened: boolean): JSX.Element;
}

const dropdownWrapperClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};
const Dropdown: Component<DropdownProps> = (props) => {
  const [buttonRef, setButtonRef] = createRef<HTMLElement>();
  const [boxRef, setBoxRef] = createRef<HTMLElement>();
  const [opened, setOpened] = createSignal(false);
  const position = (): DropdownPosition => props.position || "start";

  onMount(() => {
    const button = buttonRef();
    const box = boxRef();

    if (button && box) {
      computePosition(button, box, {
        middleware: [hide()],
        placement: "bottom",
      }).then(({ y }) => {
        box.style.top = `${y}px`;
      });
    }
  });
  createEffect(
    on(opened, (opened) => {
      if (opened) {
        boxRef()?.focus();
      }
    })
  );

  return (
    <div
      class={clsx(
        "relative flex items-center focus:outline-none",
        dropdownWrapperClass[position()]
      )}
      tabindex="0"
    >
      <Overlay
        shadeClass="bg-transparent"
        opened={opened()}
        onOverlayClick={() => setOpened(false)}
      />
      <Button
        ref={setButtonRef}
        onClick={() => setOpened(!opened())}
        class="flex"
      >
        {props.activatorButton(opened())}
      </Button>
      <Card
        class={clsx(
          tw`absolute z-30 flex flex-col invisible p-0 overflow-hidden transition-all duration-300 transform rounded-lg shadow-2xl opacity-0 bg-opacity-60 backdrop-blur-sm`,
          opened() && tw`visible scale-100 opacity-100`
        )}
        ref={setBoxRef}
      >
        {props.children}
      </Card>
    </div>
  );
};

export { Dropdown };
