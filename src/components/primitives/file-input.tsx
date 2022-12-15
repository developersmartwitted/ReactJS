import clsx from "clsx";
import {
  Component,
  createMemo,
  createSignal,
  JSX,
  Show,
  splitProps,
} from "solid-js";
import { nanoid } from "nanoid";
import { Icon } from "./icon";
import { mdiFileDocumentOutline, mdiImageOutline, mdiUpload } from "@mdi/js";
import { IconButton } from "./button";
import { getMimeType } from "#lib/utils";

interface FileInputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  wrapperClass?: string;
  note?: string;
  label?: string;
  icon?: "image" | "document";
  onFileSelected?(file: File): void;
}

const FileInput: Component<FileInputProps> = (props) => {
  const id = nanoid();
  const [file, setFile] = createSignal<File | null>(null);
  const [, passedProps] = splitProps(props, [
    "class",
    "children",
    "onFileSelected",
    "wrapperClass",
  ]);
  const previewURL = createMemo<string>((previousValue) => {
    if (previousValue) {
      URL.revokeObjectURL(previousValue);
    }
    if (file()) {
      const mimeType = getMimeType(file()!.type);

      if (mimeType !== "unsupported" && mimeType !== "pdf") {
        return URL.createObjectURL(file()!);
      }
    }

    return "";
  });

  return (
    <div
      class={clsx(
        tw`flex flex-col items-start justify-center`,
        props.wrapperClass
      )}
    >
      <Show when={props.label}>
        <span class="font-semibold">{props.label}</span>
      </Show>
      <div class={tw`relative flex items-center w-full max-w-full`}>
        <label
          for={id}
          class={clsx(
            tw`flex items-center justify-center w-full m-1 bg-transparent border-2 border-gray-200 cursor-pointer rounded-2xl`,
            props.class
          )}
        >
          <Show
            when={previewURL()}
            fallback={
              <Icon
                path={
                  props.icon === "document"
                    ? mdiFileDocumentOutline
                    : mdiImageOutline
                }
                class="mx-1 w-28 h-28"
              />
            }
          >
            <div class="p-4 h-28 w-28">
              <img
                src={previewURL()}
                class="object-cover w-20 h-20 border-2 border-gray-200 rounded-2xl"
              />
            </div>
          </Show>
          <div class="items-center justify-center flex-1 h-full p-4 pl-0">
            <Show when={props.note}>
              <span class="text-gray-400">
                <span class="font-bold text-gray-500">Note:</span>{" "}
                <span>{props.note}</span>
              </span>
            </Show>

            <IconButton
              badge
              icon={mdiUpload}
              label="Upload file"
              class="w-full m-0"
            ></IconButton>
          </div>
        </label>
        <input
          id={id}
          class="hidden"
          type="file"
          onChange={(
            event: Event & {
              currentTarget: HTMLInputElement;
              target: Element;
            }
          ) => {
            const files = event.currentTarget.files;
            const file = files?.item(0);

            if (files && file) {
              setFile(file);
              props.onFileSelected?.(file);
            }
          }}
          {...passedProps}
        />
      </div>
    </div>
  );
};

export { FileInput };
