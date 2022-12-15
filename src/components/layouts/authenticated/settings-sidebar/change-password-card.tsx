import { IconButton, Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Input } from "#components/primitives/input";
import { Loader } from "#components/primitives/loader";
import { mdiEyeOff, mdiEye } from "@mdi/js";
import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface ChangePasswordCardProps {
  menuOpened: boolean;
}

const getEmptyPasswordData = () => {
  return {
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
    currentPasswordVisible: false,
    newPasswordVisible: false,
    repeatNewPasswordVisible: false,
  };
};

const ChangePasswordCard: Component<ChangePasswordCardProps> = (props) => {
  const [passwordData, setPasswordData] = createStore(getEmptyPasswordData());
  const [processing, setProcessing] = createSignal(false);
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.repeatNewPassword
    );
  });
  const handlePasswordChange = async () => {
    setProcessing(true);
    await authenticatedAPI.user.changePassword({
      password: passwordData.newPassword,
      confirmPassword: passwordData.repeatNewPassword,
      currentPassword: passwordData.currentPassword,
    });

    setPasswordData(getEmptyPasswordData());
    setProcessing(false);
  };

  createEffect(
    on([() => props.menuOpened], () => {
      setPasswordData(getEmptyPasswordData());
    })
  );

  return (
    <Card class="flex flex-col gap-3 p-5">
      <h3 class="flex-1 text-lg font-semibold">Change Password</h3>
      <Input
        label="Your Current Password"
        class="w-full"
        value={passwordData.currentPassword}
        setValue={(currentPassword) => {
          setPasswordData("currentPassword", currentPassword);
        }}
        type={passwordData.currentPasswordVisible ? "text" : "password"}
        adornment={() => {
          return (
            <IconButton
              icon={passwordData.currentPasswordVisible ? mdiEyeOff : mdiEye}
              color="primary"
              variant="text"
              onClick={() =>
                setPasswordData(
                  "currentPasswordVisible",
                  !passwordData.currentPasswordVisible
                )
              }
            />
          );
        }}
      />
      <Input
        label="New Password"
        class="w-full"
        value={passwordData.newPassword}
        setValue={(newPassword) => {
          setPasswordData("newPassword", newPassword);
        }}
        type={passwordData.newPasswordVisible ? "text" : "password"}
        adornment={() => {
          return (
            <IconButton
              icon={passwordData.newPasswordVisible ? mdiEyeOff : mdiEye}
              color="primary"
              variant="text"
              onClick={() =>
                setPasswordData(
                  "newPasswordVisible",
                  !passwordData.newPasswordVisible
                )
              }
            />
          );
        }}
      />
      <Input
        label="Repeat New Password"
        class="w-full"
        value={passwordData.repeatNewPassword}
        setValue={(repeatNewPassword) => {
          setPasswordData("repeatNewPassword", repeatNewPassword);
        }}
        type={passwordData.repeatNewPasswordVisible ? "text" : "password"}
        adornment={() => {
          return (
            <IconButton
              icon={passwordData.repeatNewPasswordVisible ? mdiEyeOff : mdiEye}
              color="primary"
              variant="text"
              onClick={() =>
                setPasswordData(
                  "repeatNewPasswordVisible",
                  !passwordData.repeatNewPasswordVisible
                )
              }
            />
          );
        }}
      />

      <Button
        class="flex items-center justify-center w-full"
        color={processing() ? "base" : "primary"}
        disabled={!filled() || processing()}
        onClick={handlePasswordChange}
      >
        {processing() ? <Loader /> : "Change Password"}
      </Button>
    </Card>
  );
};

export { ChangePasswordCard };
