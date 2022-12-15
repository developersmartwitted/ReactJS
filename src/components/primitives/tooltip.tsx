import { Fragment } from "./fragment";
import clsx from "clsx";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  onMount,
  Show,
  on,
  onCleanup,
} from "solid-js";
import {
  computePosition,
  flip,
  hide,
  shift,
  autoUpdate,
} from "@floating-ui/dom";
import { Dynamic, Portal } from "solid-js/web";
import { createRef } from "#lib/ref";

type TooltipPosition = {
  x: number;
  y: number;
};
type PositionUpdateHandler = (position?: TooltipPosition) => void;

interface TooltipController {
  updatePosition(position?: TooltipPosition): void;
  onPositionUpdate(handler: PositionUpdateHandler): void;
}
interface TooltipProps {
  children: JSX.Element;
  text: string;
  class?: string;
  side?: "top" | "bottom" | "left" | "right";
  enabled?: boolean;
  fixed?: boolean;
  controller?: TooltipController;
  autoUpdate?: boolean;
  wrapperClass?: string;
  wrapperStyle?: JSX.CSSProperties;
}

const createTooltipController = (): TooltipController => {
  const handlers: PositionUpdateHandler[] = [];

  return {
    onPositionUpdate(handler) {
      handlers.push(handler);
    },
    updatePosition(position) {
      handlers.forEach((handler) => {
        handler(position);
      });
    },
  };
};
const Tooltip: Component<TooltipProps> = (props) => {
  const [position, setPosition] = createSignal<TooltipPosition>({ x: 0, y: 0 });
  const [referenceRef, setReferenceRef] = createRef<HTMLElement>();
  const [floatingRef, setFloatingRef] = createRef<HTMLElement>();
  const [cleanupRef, setCleanupRef] = createRef<() => void>();
  const [visible, setVisible] = createSignal(false);
  const controller = props.controller || createTooltipController();
  const enabled = (): boolean => {
    return typeof props.enabled === "boolean" ? props.enabled : true;
  };
  const updatePosition = async (): Promise<void> => {
    const referenceElement = referenceRef();
    const floatingElement = floatingRef();

    if (referenceElement && floatingElement) {
      const { x, y } = await computePosition(
        referenceElement,
        floatingElement,
        {
          middleware: [shift(), flip(), hide()],
          placement: props.side,
          strategy: props.fixed ? "fixed" : "absolute",
        }
      );

      setPosition({ x: x || 0, y: y || 0 });
    }
  };

  controller.onPositionUpdate(updatePosition);
  onMount(() => {
    const referenceElement = referenceRef();
    const floatingElement = floatingRef();

    if (referenceElement && floatingElement) {
      const cleanup = autoUpdate(
        referenceElement,
        floatingElement,
        controller.updatePosition
      );

      setCleanupRef(cleanup);
    }
  });
  onCleanup(() => {
    cleanupRef()?.();
  });
  createEffect(
    on([() => props.side, () => props.enabled, () => props.fixed], () => {
      return controller.updatePosition();
    })
  );

  return (
    <div
      class={clsx(
        tw`relative flex flex-col items-center justify-center`,
        props.wrapperClass
      )}
      style={props.wrapperStyle}
      ref={setReferenceRef}
      onPointerEnter={() => setVisible(true)}
      onPointerLeave={() => setVisible(false)}
    >
      {props.children}
      <Show when={enabled()}>
        <Dynamic component={props.fixed ? Portal : Fragment}>
          <div
            ref={setFloatingRef}
            style={{ left: `${position().x}px`, top: `${position().y}px` }}
            class={clsx(
              tw`text-sm whitespace-nowrap py-0.5 px-1 leading-none transition-transform transform dark:bg-gray-200 dark:text-gray-800 rounded-md bg-gray-800 text-gray-50 z-30`,
              visible()
                ? tw`group-hover:visible group-hover:scale-100`
                : tw`invisible scale-0`,
              props.fixed ? tw`fixed` : tw`absolute`,
              props.class
            )}
          >
            {props.text}
          </div>
        </Dynamic>
      </Show>
    </div>
  );
};

export { Tooltip, createTooltipController };
