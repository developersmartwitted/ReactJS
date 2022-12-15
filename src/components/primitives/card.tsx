import clsx from "clsx";
import { Component, JSX, mergeProps, splitProps } from "solid-js";
import { Ref } from "#lib/ref";

const cardColors = {
  base: tw`bg-white dark:bg-gray-900`,
  contrast: tw`bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700`,
  soft: tw`bg-gray-200 border-gray-200 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 dark:border-gray-700`,
  primary: tw`text-white border-orange-600 bg-gradient-to-tr`,
};

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  color?: keyof typeof cardColors;
  ref?: Ref<HTMLElement>[1];
}

const Card: Component<CardProps> = (providedProps) => {
  const props = mergeProps(
    { color: "base" } as Required<CardProps>,
    providedProps
  );
  const [, passedProps] = splitProps(props, [
    "class",
    "color",
    "children",
    "ref",
  ]);

  return (
    <div
      {...passedProps}
      class={clsx(
        tw`p-2 shadow-lg rounded-3xl`,
        cardColors[props.color],
        props.class
      )}
      ref={props.ref}
    >
      {props.children}
    </div>
  );
};

export { Card };
