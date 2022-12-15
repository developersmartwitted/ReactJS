import { Icon } from "./icon";
import clsx from "clsx";
import {
  Component,
  ComponentProps,
  JSX,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

const buttonColors = {
  base: tw`bg-gray-200 fill-current dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700`,
  contrast: tw`bg-gray-100 fill-current dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700`,
  primary: tw`bg-gradient-to-tr fill-[url(#gradient)] hover:from-violet-700 hover:to-violet-700 hover:fill-[url(#gradient-flipped)] dark:hover:bg-gradient-to-bl disabled:opacity-70`,
};
const textColors = {
  base: tw`text-gray-600 dark:text-gray-100`,
  contrast: tw`text-gray-900 dark:text-gray-50`,
  primary: tw`text-white fill-[url(#gradient)]`,
  soft: tw`text-gray-500 dark:text-gray-400`,
};
const buttonSizes = {
  small: tw`px-1 py-0.5 text-sm m-0.5 rounded-md`,
  medium: tw`px-2 py-1 m-1 text-base rounded-xl`,
  large: tw`px-4 py-2 m-1 text-lg rounded-2xl`,
};
const buttonVariants = {
  text: tw`bg-transparent dark:bg-transparent`,
  solid: "",
};
const buttonColorsVariants = {
  primaryText: tw`text-transparent bg-clip-text`,
};
const iconButtonSizes = {
  small: { button: tw`p-0.5`, icon: tw`w-4 h-4` },
  medium: { button: tw`p-1`, icon: tw`w-6 h-6` },
  large: { button: tw`p-2`, icon: tw`w-8 h-8` },
};

type ButtonColor = keyof typeof buttonColors;
type ButtonTextColor = keyof typeof textColors;
type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;
interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string;
  badge?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  text?: ButtonTextColor;
}
interface IconButtonProps extends ButtonProps {
  icon?: string;
  iconProps?: Partial<ComponentProps<typeof Icon>>;
  label?: JSX.Element;
}

const Button: Component<ButtonProps> = (providedProps) => {
  const props = mergeProps(
    {
      color: "base",
      text: providedProps.color || "base",
      variant: "solid",
      size: "medium",
    } as const,
    providedProps
  );
  const [, passedProps] = splitProps(props, [
    "class",
    "color",
    "text",
    "variant",
    "size",
    "badge",
    "children",
  ]);

  return (
    <Dynamic
      component={props.badge ? "div" : "button"}
      class={clsx(
        tw`transition duration-150 focus:outline-none`,
        buttonVariants[props.variant],
        buttonSizes[props.size],
        buttonColors[props.color],
        textColors[props.text],
        {
          [buttonColorsVariants.primaryText]:
            props.color === "primary" && props.variant === "text",
        },
        props.class
      )}
      {...passedProps}
    >
      {props.children}
    </Dynamic>
  );
};
const IconButton: Component<IconButtonProps> = (providedProps) => {
  const props = mergeProps(
    {
      color: "base",
      text: providedProps.color || "base",
      variant: "solid",
      size: "medium",
    } as const,
    providedProps
  );
  const [, passedProps] = splitProps(props, ["icon", "iconProps", "label"]);

  return (
    <Button
      {...passedProps}
      class={clsx(
        tw`flex items-center justify-center`,
        props.variant === "solid" &&
          props.color === "primary" &&
          "fill-current hover:fill-current",
        iconButtonSizes[props.size].button,
        props.class
      )}
    >
      <Show
        when={props.icon}
        fallback={
          <div class={iconButtonSizes[props.size].icon}>{props.children}</div>
        }
      >
        <Icon
          {...props.iconProps}
          path={props.icon || ""}
          class={clsx(
            tw`fill-inherit`,
            iconButtonSizes[props.size].icon,
            props.iconProps?.class
          )}
        />
      </Show>
      <Show when={props.label}>{props.label}</Show>
    </Button>
  );
};

export { Button, IconButton };
