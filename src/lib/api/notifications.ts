import { createAPIFunction, Schemas } from "./connection";

const getNotifications = createAPIFunction<void, Schemas["NotificationsDto"][]>(
  "GET",
  "/api/notification"
);
const updateNotificationStatus = createAPIFunction<
  Schemas["UpdateNotificationStatus"],
  Schemas["NotificationsDto"]
>("PUT", "/api/notification/status");
const getNotificationSettings = createAPIFunction<
  void,
  Schemas["NotificationSettingDto"] & { id: string; createdAt: string }
>("GET", "/api/notification/settings");
const updateNotificationSettings = createAPIFunction<
  Schemas["UpdateNotificationSettings"],
  void
>("PUT", "/api/notification/settings");

const notificationsAPI = {
  getNotifications,
  getNotificationSettings,
  updateNotificationStatus,
  updateNotificationSettings,
};

export { notificationsAPI };
