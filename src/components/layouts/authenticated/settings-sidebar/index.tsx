import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  on,
  Show,
  Suspense,
} from "solid-js";
import { components } from "#lib/api/schema";
import { Card } from "#components/primitives/card";
import { Overlay } from "#components/primitives/overlay";
import clsx from "clsx";
import { Transition } from "solid-transition-group";
import "#components/transitions/slide.css";
import { useAuthenticatedAPI } from "../guard";
import {
  mdiAccountOutline,
  mdiBellOutline,
  mdiCog,
  mdiEye,
  mdiEyeOff,
  mdiLockOutline,
} from "@mdi/js";
import { Loader } from "#components/primitives/loader";
import { Icon } from "#components/primitives/icon";
import { Button, IconButton } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { Checkbox } from "#components/primitives/checkbox";
import { createStore } from "solid-js/store";
import { Profile } from "#lib/API";
import { ChangePasswordCard } from "./change-password-card";
import { NotificationSettingsCard } from "./notification-settings-card";
import { ProfileDetailsCard } from "./profile-details-card";

interface SettingsSidebarProps {
  profile?: Profile;
  opened: boolean;
  handleClose?(): void;
  refetchProfile(): void;
}

const SettingsSidebar: Component<SettingsSidebarProps> = (props) => {
  return (
    <Overlay opened={props.opened} onOverlayClick={props.handleClose}>
      <Transition name="slide">
        <Show when={props.opened}>
          <Card
            class={clsx(
              "fixed right-0 z-20 flex flex-col w-full gap-5 p-5 md:w-[30rem] md:rounded-r-none h-[calc(100%-4rem)] md:h-full bottom-0 overflow-auto"
            )}
            color="contrast"
          >
            <div class="flex items-center justify-center">
              <Icon path={mdiCog} class="w-10 h-10" />
              <h1 class="flex-1 ml-2 text-3xl font-semibold">Settings</h1>
            </div>
            <div class="flex items-center justify-center">
              <Icon path={mdiAccountOutline} class="w-8 h-8" />
              <h2 class="flex-1 ml-2 text-2xl">Profile</h2>
            </div>
            <ProfileDetailsCard
              menuOpened={props.opened}
              profile={props.profile}
              refetchProfile={props.refetchProfile}
            />
            <div class="flex items-center justify-center">
              <Icon path={mdiBellOutline} class="w-8 h-8" />
              <h2 class="flex-1 ml-2 text-2xl">Notifications</h2>
            </div>
            <NotificationSettingsCard menuOpened={props.opened} />
            <div class="flex items-center justify-center">
              <Icon path={mdiLockOutline} class="w-8 h-8" />
              <h2 class="flex-1 ml-2 text-2xl">Password</h2>
            </div>
            <ChangePasswordCard menuOpened={props.opened} />
          </Card>
        </Show>
      </Transition>
    </Overlay>
  );
};

export { SettingsSidebar };
