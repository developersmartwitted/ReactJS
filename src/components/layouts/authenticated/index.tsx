import {
  AuthGuard,
  useAccessToken,
  useAuthenticatedAPI,
} from "#components/layouts/authenticated/guard";
import { TopBar } from "#components/fragments/top-bar";
import { SideMenu } from "./side-menu";
import { Component, createSignal, JSX } from "solid-js";

interface AuthenticatedLayoutProps {
  children: JSX.Element;
}

const AuthenticatedLayout: Component<AuthenticatedLayoutProps> = (props) => {
  const [menuOpened, setMenuOpened] = createSignal(false);

  return (
    <AuthGuard>
      <TopBar setMenuOpened={setMenuOpened} />
      <div class="flex h-full bg-[#fafafa]">
        <SideMenu opened={menuOpened()} />
        {props.children}
      </div>
    </AuthGuard>
  );
};

export { AuthenticatedLayout, useAccessToken, useAuthenticatedAPI };
