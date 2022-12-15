import clsx from "clsx";
import { Component, ComponentProps, JSX } from "solid-js";
import colors from "tailwindcss/colors";

interface CheckboxProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value"> {
  size?: "sm" | "md" | "lg";
  centered?: boolean;
  value?: boolean;
  setValue?(value: boolean): void;
}

const checkboxIcon = (color: string) => {
  const svgString = `<svg viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(
    svgString.trim().replace(/\s+/g, " ").replace(/"/g, "'")
  )}`;
};
const Checkbox: Component<CheckboxProps> = (props) => {
  const sizeVariants = {
    sm: "p-0.5 h-5 w-5",
    md: "p-1 h-6 w-6",
    lg: "p-2 h-8 w-8",
  };
  const centered = "flex justify-center items-center";
  const currentBackgroundImage = () => {
    if (props.value) {
      return `url("${checkboxIcon(colors.gray["600"])}")`;
    }
    return "";
  };

  return (
    <input
      type="checkbox"
      class={clsx(
        tw`text-transparent text-gray-200 bg-gray-100 border-2 border-gray-200 rounded-lg appearance-none focus:border-gray-400 focus:disabled:border-gray-200 disabled:opacity-40 disabled:pointer-events-none`,
        props.centered ? centered : "",
        sizeVariants[props.size || "md"],
        props.class
      )}
      onInput={({ currentTarget }) => {
        props.setValue?.(currentTarget.checked);
      }}
      style={{
        "background-image": currentBackgroundImage(),
      }}
    ></input>
  );
};

export { Checkbox };
