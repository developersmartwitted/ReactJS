import { Button, IconButton } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { mdiChevronLeft } from "@mdi/js";
import { Component, createMemo, For, JSX, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store/types";
import { Section } from "./auth-utils";

interface AuthFlowProps {
  heading: string;
  sections: Array<Section<string>>;
  buttonContent: JSX.Element;
  currentSectionId: string;
  data: Record<string, string>;
  setData: SetStoreFunction<Record<string, string>>;
  onButtonClick(): void;
}

const AuthFlow: Component<AuthFlowProps> = (props) => {
  const currentSection = createMemo(() => {
    const section = props.sections.find((section) => {
      return section.id === props.currentSectionId;
    });

    if (section) {
      return section;
    }

    return {
      id: "empty",
      name: "",
    };
  });
  const isSectionFilled = (section: Section) => {
    if (section.fields) {
      return section.fields
        .map((field) => field.dataKey)
        .every((dataKey) => Boolean(props.data[dataKey]));
    }

    return true;
  };

  return (
    <div class="flex flex-col items-start justify-center w-full max-w-[610px]">
      <h1 class="text-3xl font-bold text-[#000000] mb-8">{props.heading}</h1>
      <div class="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-14">
      <a href="#" class="inline-flex items-center justify-center h-[44px] md:h-[50px] min-w-[220px] md:min-w-[235px] lg:min-w-[350px] font-bold text-base text-white rounded-[14px] md:rounded-[18px] whitespace-nowrap bg-gradient-to-l from-[#f96767] to-[#f9b035] px-6 py-2 shadow-[5px_23px_57px_rgba(249,103,103,26%)]">
       <i class="fab fa-google mr-3"></i> Sign in with Google
        </a>
        <a href="#" class="inline-flex items-center justify-center h-[44px] md:h-[50px] min-w-[180px] md:min-w-[200px] lg:min-w-[230px] font-bold text-base text-[#6149cd] rounded-[14px] md:rounded-[18px] bg-[#FFFFFF] px-6 py-2 shadow-[0px_16px_40px_rgba(105,54,151,14%)]">
        <i class="fab fa-facebook mr-3"></i> With facebook
        </a>
      </div>
      <span class="border-t-2 border-[#c0bdcc] w-10"></span>
        <p class="text-sm text-[#7a86a1] mt-4">Or sign in using your email address</p>
      {/* <Show when={currentSection().name}>
        <h2 class="text-2xl text-left text-gray-400">
          {currentSection().name}
        </h2>
      </Show> */}
      <Show when={currentSection().message}>
        <div class="max-w-full mt-4 w-96">{currentSection().message}</div>
      </Show>
      
      
      <Show when={currentSection().fields}>
        <div class="flex flex-col md:flex-row items-end justify-center w-full mt-6 gap-4">
          <For each={currentSection().fields}>
            {(inputField) => {
              return (
                <Input
                  size="lg"
                  placeholder={inputField.placeholder || ""}
                  wrapperClass="w-full"
                  class="w-full"
                  label={inputField.label}
                  value={props.data[inputField.dataKey]}
                  setValue={(value) => props.setData(inputField.dataKey, value)}
                  {...(inputField.attributes?.() || {})}
                />
              );
            }}
          </For>
        </div>
      </Show>
      {currentSection().component}
      <div>
        <Button
          class="h-[50px] min-w-[215px] lg:min-w-[250px] font-bold text-base text-white rounded-[18px] mt-3 bg-gradient-to-l from-[#ea5f8b] to-[#6149cd] px-6 py-2 shadow-[5px_23px_57px_rgba(94,74,204,26%)]"
          disabled={!isSectionFilled(currentSection())}
          onClick={props.onButtonClick}
        >
          {props.buttonContent}
        </Button>
      </div>
    </div>
  );
};

export { AuthFlow };
