import { logoIcon } from "#assets/icons/logo";
import { IconButton } from "#components/primitives/button";
import { Icon } from "#components/primitives/icon";
import { mdiMenu } from "@mdi/js";
import { Component, Setter } from "solid-js";

interface TopBarProps {
  setMenuOpened: Setter<boolean>;
}

const TopBar: Component<TopBarProps> = (props) => {
  return (
    <nav class="flex items-center justify-start h-16 md:hidden">
      <Icon path={logoIcon} class="w-12 mr-2 fill-[url(#gradient)]" />
      <span class="flex-1 text-3xl font-bold">Panoton</span>
      <IconButton
        icon={mdiMenu}
        variant="text"
        text="soft"
        onClick={() => {
          props.setMenuOpened((menuOpened) => !menuOpened);
        }}
      />
    </nav>
  );
};

export { TopBar };
