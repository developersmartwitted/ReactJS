import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Checkbox } from "#components/primitives/checkbox";
import { Input } from "#components/primitives/input";
import { Loader } from "#components/primitives/loader";
import { Schemas } from "#lib/API";
import {
  Component,
  createSignal,
  createMemo,
  createResource,
  createEffect,
  on,
  Suspense,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface NotificationSettingsCardProps {
  menuOpened: boolean;
}

const getCleanNotificationSettingsData = (
  notificationSettings?: Schemas["NotificationSettingDto"]
) => {
  return {
    emailNotifications: notificationSettings?.isEmail || false,
    externalConnections: notificationSettings?.externalConnection || 0,
    internalConnections: notificationSettings?.internalConnection || 0,
  };
};

const NotificationSettingsCard: Component<NotificationSettingsCardProps> = (
  props
) => {
  const [notificationSettingsData, setNotificationSettingsData] = createStore(
    getCleanNotificationSettingsData()
  );
  const [processing, setProcessing] = createSignal(false);
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return (
      notificationSettingsData.externalConnections &&
      notificationSettingsData.internalConnections
    );
  });
  const [notificationSettings, { refetch: refetchNotificationSettings }] =
    createResource(async () => {
      const { data } =
        await authenticatedAPI.notifications.getNotificationSettings({}, null);

      return data!;
    });
  const handleNotificationSettingsUpdate = async () => {
    setProcessing(true);
    await authenticatedAPI.notifications.updateNotificationSettings({
      externalConnection: notificationSettingsData.externalConnections,
      internalConnection: notificationSettingsData.internalConnections,
      isEmail: notificationSettingsData.emailNotifications,
      notificationSettingId: notificationSettings()?.id || "",
    });

    refetchNotificationSettings();
    setProcessing(false);
  };

  createEffect(
    on([notificationSettings], () => {
      setNotificationSettingsData(
        getCleanNotificationSettingsData(notificationSettings())
      );
    })
  );
  createEffect(
    on([() => props.menuOpened], () => {
      setNotificationSettingsData(
        getCleanNotificationSettingsData(notificationSettings())
      );
    })
  );

  return (
    <Suspense
      fallback={
        <div class="flex items-center justify-center w-full">
          <Loader />
        </div>
      }
    >
      <Card class="flex flex-col gap-3 p-5">
        <h3 class="flex-1 text-lg font-semibold">Notification Settings</h3>
        <div class="flex items-center justify-center">
          <span class="flex-1 font-semibold text-left">
            Receive notifications via email
          </span>
          <Checkbox
            value={notificationSettingsData.emailNotifications}
            setValue={(emailNotifications) => {
              setNotificationSettingsData(
                "emailNotifications",
                emailNotifications
              );
            }}
          />
        </div>
        <Input
          type="number"
          label="Total External Connections Allowed"
          class="w-full"
          value={`${notificationSettingsData.externalConnections}`}
          setValue={(externalConnections) => {
            return setNotificationSettingsData(
              "externalConnections",
              Number(externalConnections)
            );
          }}
        />
        <Input
          type="number"
          label="Total Internal Connections Allowed"
          class="w-full"
          value={`${notificationSettingsData.internalConnections}`}
          setValue={(internalConnections) => {
            return setNotificationSettingsData(
              "internalConnections",
              Number(internalConnections)
            );
          }}
        />
        <Button
          color={processing() ? "base" : "primary"}
          class="flex items-center justify-center"
          disabled={!filled() || processing()}
          onClick={handleNotificationSettingsUpdate}
        >
          {processing() ? <Loader /> : "Update Settings"}
        </Button>
      </Card>
    </Suspense>
  );
};

export { NotificationSettingsCard };
