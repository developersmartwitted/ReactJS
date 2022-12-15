import { Icon } from "./icon";
import clsx from "clsx";
import { Component, For, JSX, Show, splitProps } from "solid-js";

interface SelectOption {
  label: string;
  value: string;
}
interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  value: string;
  class?: string;
  placeholder?: string;
  icon?: string;
  setValue(value: string): void;
}

const Select: Component<SelectProps> = (props) => {
  const [, passedProps] = splitProps(props, [
    "options",
    "class",
    "value",
    "placeholder",
    "setValue",
  ]);
  const handleChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (
    event
  ) => {
    props.setValue(event.currentTarget.value);
    event.currentTarget.value = props.value;
  };

  return (
    <div class="relative flex items-center justify-start">
      <Icon
        path={props.icon!}
        class={clsx(
          tw`absolute left-0 w-6 h-6 m-2 pointer-events-none`,
          props.value ? "text-gray-500" : "text-gray-400"
        )}
      />
      <select
        required
        value={props.value}
        onChange={handleChange}
        class={clsx(
          tw`py-1 pl-2 m-1 text-base text-gray-500 bg-gray-200 border-0 rounded-lg dark:bg-gray-900 dark:text-gray-300 pr-9 form-select focus:outline-none focus:ring-0 invalid:text-gray-400`,
          props.icon && tw`pl-8`,
          props.class
        )}
        {...passedProps}
      >
        <Show when={props.placeholder}>
          <option disabled selected value="">
            {props.placeholder}
          </option>
        </Show>
        <For each={props.options}>
          {(option) => {
            return <option value={option.value}>{option.label}</option>;
          }}
        </For>
      </select>
    </div>
  );
};

export { Select };
