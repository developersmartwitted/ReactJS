import clsx from "clsx";
import { Component, JSX, JSXElement, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Ref } from "#lib/ref";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
  textarea?: boolean;
  value: string;
  wrapperClass?: string;
  adornmentWrapperClass?: string;
  label?: JSXElement;
  size?: keyof typeof inputSizes;
  ref?: Ref<HTMLInputElement>[1];
  adornment?: JSX.Element;
  setValue(value: string): void;
}

const inputSizes = {
  sm: tw`px-1 py-0.5 text-sm m-0.5 rounded-md`,
  md: tw`p-2 m-1 h-9 rounded-xl`,
  lg: tw`h-12 p-4 m-1 text-lg rounded-2xl`,
};
const textareaSizes = {
  sm: tw`px-1 py-0.5 text-sm m-0.5 rounded-md`,
  md: tw`p-2 py-1.5 m-1 h-24 rounded-xl`,
  lg: tw`h-32 p-4 py-3.5 m-1 text-lg rounded-2xl`,
};
const inputLabelSizes = {
  sm: tw`text-sm`,
  md: tw`text-base`,
  lg: tw`text-lg font-semibold`,
};
const Input: Component<InputProps> = (props) => {
  const [, passedProps] = splitProps(props, [
    "class",
    "children",
    "value",
    "setValue",
    "adornment",
    "wrapperClass",
  ]);

  return (
    <div
      class={clsx(
        tw`flex flex-col items-start justify-center`,
        props.wrapperClass
      )}
    >
      <Show when={props.label}>
        <span
          class={clsx(tw`font-semibold text-[15px] text-black`, inputLabelSizes[props.size || "md"])}
        >
          {props.label}
        </span>
      </Show>
      <div class={tw`relative flex items-center w-full max-w-full`}>
        <Dynamic
          ref={props.ref}
          component={props.textarea ? "textarea" : "input"}
          {...passedProps}
          class={clsx(
            tw`m-0 mt-1 py-2 resize-none text-sm flex items-center justify-start bg-transparent border-[1px] border-gray-200 ring-offset-1 dark:text-white dark:border-gray-900 focus:outline-none focus:border-[#639CFC] placeholder:text-gray-400 disabled:text-gray-300`,
            inputSizes[props.size || "md"],
            props.textarea && textareaSizes[props.size || "md"],
            props.class
          )}
          value={props.value}
          onInput={(
            event: InputEvent & {
              currentTarget: HTMLInputElement;
              target: Element;
            }
          ) => {
            if (typeof props.onInput === "function") {
              props.onInput?.(event);
            }

            props.setValue(event.currentTarget.value);
          }}
        />
        <Show when={props.adornment}>
          <div class={clsx(tw`absolute right-2`, props.adornmentWrapperClass)}>
            <Dynamic component={props.adornment!} />
          </div>
        </Show>
      </div>
    </div>
  );
};

export { Input };
