import {
  Component,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { logoIcon } from "#assets/icons/logo";
import { Button, IconButton } from "#components/primitives/button";
import {
  mdiAccountMultipleOutline,
  mdiBellOutline,
  mdiChartBoxOutline,
  mdiClose,
  mdiCompassOutline,
  mdiEmailOutline,
  mdiListBoxOutline,
  mdiLogout,
  mdiMessageOutline,
  mdiStarShootingOutline,
  mdiTune,
  mdiViewDashboardOutline,
  mdiWalletOutline,
} from "@mdi/js";
import { Card } from "#components/primitives/card";
import { Icon } from "#components/primitives/icon";
import { useLocation, useNavigate } from "@solidjs/router";
import clsx from "clsx";
import Popover from "#components/primitives/popover";
import { ProfileSidebar } from "./profile-sidebar";
import { Loader } from "#components/primitives/loader";
import { SettingsSidebar } from "./settings-sidebar";
import { useAuthenticatedAPI } from "./guard";

interface SideMenuProps {
  opened: boolean;
}

const SideMenu: Component<SideMenuProps> = (props) => {
  let notificationRef!: HTMLElement;
  const authenticatedAPI = useAuthenticatedAPI();
  const [notificationOpen, setNotificationOpen] = createSignal<boolean>(false);
  const [profile, { refetch: refetchProfile }] = createResource(async () => {
    const { data } = await authenticatedAPI.user.getProfile({}, null);
    return data;
  });
  const profileImageLink = () => profile()?.profileImage;
  const [notifications, { refetch: refetchNotifications }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.notifications.getNotifications(
        {},
        null
      );
      return data;
    }
  );
  const unseenNotifications = () => {
    return notifications()?.filter(({ isViewed }) => !isViewed) ?? [];
  };
  const [profileSidebarOpened, setProfileSidebarOpened] =
    createSignal<boolean>(false);
  const [settingsSidebarOpened, setSettingsSidebarOpened] =
    createSignal<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      icon: mdiViewDashboardOutline,
      label: "Dashboard",
      path: "/",
    },
    { icon: mdiChartBoxOutline, label: "Skills" },
    { icon: mdiAccountMultipleOutline, label: "Teams", path: "/teams" },
    { icon: mdiCompassOutline, label: "Community" ,path:"/community" },
    { icon: mdiListBoxOutline, label: "Projects", path: "/projects" },
    { icon: mdiWalletOutline, label: "Payouts" },
  ];
  const insightMenuItem = [
    { icon: mdiEmailOutline, label: "Inbox", active: false, count: "99+" },
    {
      icon: mdiBellOutline,
      label: "Notifications",
      count: unseenNotifications().length,
      ref: (ref: HTMLElement) => (notificationRef = ref),
      onClick() {
        setNotificationOpen((val) => !val);
      },
    },
    { icon: mdiMessageOutline, label: "Chat", count: 5 },
  ];
  const logout = async () => {
    try {
      const response = await authenticatedAPI.auth.logout({});
      navigate("/login");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  return (
    <>
      <div
        class={clsx(
          "fixed md:relative z-10 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full p-4 bg-white border-gray-200 shadow-lg md:w-64 md:flex transform transition-transform duration-500",
          props.opened
            ? "ease-out"
            : "ease-in translate-y-full md:translate-y-0"
        )}
      >
        <div class="items-center justify-start hidden w-full mb-8 md:flex">
          <Icon path={logoIcon} class="w-12 mr-2 fill-[url(#gradient)]" />
          <span class="text-3xl font-bold">Panoton</span>
        </div>
        <div class="flex flex-col w-full">
          <For each={menuItems}>
            {(menuItem) => {
              return (
                <IconButton
                  icon={menuItem.icon}
                  label={<span class="pl-2">{menuItem.label}</span>}
                  variant={
                    location.pathname === menuItem.path ? "solid" : "text"
                  }
                  color={
                    location.pathname === menuItem.path ? "primary" : "base"
                  }
                  text={
                    location.pathname === menuItem.path ? "primary" : "soft"
                  }
                  class="justify-start w-full px-[18px] py-3"
                  onClick={() => {
                    navigate(menuItem.path || "/");
                  }}
                />
              );
            }}
          </For>
          <span class="mt-8 mb-2 text-sm text-gray-400 pl-2">Insights</span>

          <For each={insightMenuItem}>
            {(menuItem) => {
              return (
                <IconButton
                  ref={menuItem.ref}
                  icon={menuItem.icon}
                  label={
                    <div class="flex items-center justify-start w-full">
                      <span class="flex-1 pl-2 text-start">
                        {menuItem.label}
                      </span>
                      <Show when={menuItem.count}>
                        <div class="flex items-center justify-center min-w-[22px] h-[22px] max-w-lg text-white rounded-full min-w-6 bg-gradient-to-tr text-sm">
                          <span class="px-1">{menuItem.count}</span>
                        </div>
                      </Show>
                    </div>
                  }
                  variant={menuItem.active ? "solid" : "text"}
                  color={menuItem.active ? "primary" : "base"}
                  text={menuItem.active ? "primary" : "soft"}
                  class="justify-start w-full"
                  onClick={menuItem.onClick}
                />
              );
            }}
          </For>
          <Popover
            open={notificationOpen()}
            relatedTo={notificationRef}
            position="right"
          >
            <Card class="shadow-xl p-3 min-w-[18rem] w-full flex flex-col justify-center items-center gap-3">
              <div class="flex items-center justify-between w-full">
                <h3 class="text-xl">Notifications</h3>
                <IconButton
                  icon={mdiClose}
                  class="m-0"
                  onClick={() => setNotificationOpen(false)}
                />
              </div>
              <Suspense fallback={<Loader />}>
                <Show
                  when={unseenNotifications().length > 0}
                  fallback={<p>No Notifications</p>}
                >
                  <ul>
                    <For each={unseenNotifications()}>
                      {({ id, notificationType, typeId, message }) => (
                        <li>
                          <Button
                            class="p-2 text-left"
                            color="contrast"
                            onClick={async () => {
                              if (notificationType === "TEAM") {
                                const { isVerified, isRegistered } =
                                  await authenticatedAPI.auth
                                    .verify(
                                      {
                                        questionType: "TEAM",
                                        verificationId:
                                          typeId as unknown as string,
                                      },
                                      null
                                    )
                                    .then(({ data }) => data || {});
                                if (isRegistered) {
                                  if (isVerified) {
                                    await authenticatedAPI.notifications.updateNotificationStatus(
                                      {
                                        notificationId: id,
                                        viewed: true,
                                        remove: true,
                                      },
                                      null
                                    );
                                  } else {
                                    await authenticatedAPI.auth
                                      .acceptInvite({
                                        id: typeId as unknown as string,
                                      })
                                      .then(async () => {
                                        await authenticatedAPI.notifications.updateNotificationStatus(
                                          {
                                            notificationId: id,
                                            viewed: true,
                                            remove: true,
                                          },
                                          null
                                        );
                                      });
                                  }
                                }
                              } else {
                                await authenticatedAPI.notifications.updateNotificationStatus(
                                  {
                                    notificationId: id,
                                    viewed: true,
                                    remove: false,
                                  },
                                  null
                                );
                              }
                              await refetchNotifications();
                            }}
                          >
                            {message}
                          </Button>
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
              </Suspense>
            </Card>
          </Popover>
        </div>
        <Card
          color="primary"
          class="flex flex-col items-end justify-center mt-6 mb-2 from-[#56D2FB] to-[#8062FB] tic-tac-toe-gradient shadow-[#56D2FB] p-3"
        >
          <div class="flex items-center justify-center mb-2">
            <span class="text-lg leading-6">Access more Projects</span>
            <IconButton
              size="large"
              icon={mdiStarShootingOutline}
              class="bg-white hover:bg-gray-100"
              text="primary"
            />
          </div>
          <span class="text-base text-white text-opacity-70 pr-2">Upgrade to Pro</span>
        </Card>
        <div class="flex-1" />
        <div class="flex items-center justify-center w-full">
          <button
            onClick={() => setProfileSidebarOpened(true)}
            class="w-12 h-12 mr-4 bg-cover border-2 border-gray-200 rounded-2xl"
            style={{
              "background-image": `url(https://panoton-dev.s3.amazonaws.com/${profileImageLink()})`,
            }}
          />
          <div class="flex-1" />
          <IconButton
            icon={mdiTune}
            text="soft"
            variant="text"
            onClick={() => setSettingsSidebarOpened(true)}
          />
          <IconButton
            icon={mdiLogout}
            text="soft"
            variant="text"
            onClick={logout}
          />
        </div>
      </div>
      <ProfileSidebar
        profile={profile()}
        opened={profileSidebarOpened()}
        handleClose={() => setProfileSidebarOpened(false)}
      />
      <SettingsSidebar
        profile={profile()}
        opened={settingsSidebarOpened()}
        handleClose={() => setSettingsSidebarOpened(false)}
        refetchProfile={refetchProfile}
      />
    </>
  );
};

export { SideMenu };
