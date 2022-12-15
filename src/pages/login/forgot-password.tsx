import { IconButton } from "#components/primitives/button";
import { API, APIFunctionOptions } from "#lib/api";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import {
  Component,
  createEffect,
  createSignal,
  Match,
  on,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthFlow } from "./auth-flow";
import { Section, validateCode, validateEmail } from "./auth-utils";

interface ForgotPasswordViewProps {
  goToLoginView(): void;
  setError(error: string): void;
}

const initialData = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
};
const ForgotPasswordView: Component<ForgotPasswordViewProps> = (props) => {
  const [data, setData] = createStore({ ...initialData });
  const [currentSectionId, setCurrentSectionId] = createSignal("email");
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    createSignal(false);
  const sections: Section<keyof typeof initialData>[] = [
    {
      name: "Verify email",
      id: "email",
      fields: [
        {
          label: "Your Email",
          placeholder: "name@example.com",
          dataKey: "email",
        },
      ],
    },
    {
      name: "Enter verification code",
      id: "code",
      message: "Input the code sent to provided email address.",
      fields: [{ label: "OTP", placeholder: "6-digit OTP", dataKey: "email" }],
    },
    {
      name: "Enter new password",
      id: "password",
      message:
        "Password must consist one uppercase letter, one lowercase letter and one special character.",
      fields: [
        {
          label: "New password",
          placeholder: "password",
          dataKey: "password",
          attributes() {
            return {
              type: passwordVisible() ? "text" : "password",
              adornment() {
                return (
                  <IconButton
                    icon={passwordVisible() ? mdiEyeOff : mdiEye}
                    color="primary"
                    variant="text"
                    onClick={() => setPasswordVisible(!passwordVisible())}
                  />
                );
              },
            };
          },
        },
        {
          label: "Confirm new password",
          placeholder: "Password",
          dataKey: "confirmPassword",
          attributes() {
            return {
              type: confirmPasswordVisible() ? "text" : "password",
              adornment() {
                return (
                  <IconButton
                    icon={confirmPasswordVisible() ? mdiEyeOff : mdiEye}
                    color="primary"
                    variant="text"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible())
                    }
                  />
                );
              },
            };
          },
        },
      ],
    },
    {
      name: "Password changed",
      id: "success",
      message: "Password changed successfully! Click below to go to login.",
    },
  ];
  const validatePassword = (password: string) => {
    const includesUpperCase = password !== password.toLowerCase();
    const includesLowerCase = password !== password.toUpperCase();
    const includesSpecialCharacters = /[\W_]/g.test(password);

    return includesLowerCase && includesUpperCase && includesSpecialCharacters;
  };
  const getAPIFunctionOptions = (
    nextSection: string
  ): APIFunctionOptions<any> => {
    return {
      onSuccess() {
        setCurrentSectionId(nextSection);
      },
      onError(data) {
        props.setError(data.message);
      },
    };
  };
  const sendVerificationEmail = () => {
    const emailValid = validateEmail(data.email);

    if (!emailValid) {
      return props.setError("Invalid email");
    }

    API.auth.sendForgotPasswordOTP(
      { email: data.email },
      getAPIFunctionOptions("code")
    );
  };
  const verifyCode = () => {
    const codeValid = validateCode(data.code);

    if (!codeValid) {
      return props.setError("Invalid code");
    }

    API.auth.verifyForgotPasswordOTP(
      {
        email: data.email,
        otp: Number(data.code),
      },
      getAPIFunctionOptions("password")
    );
  };
  const changePassword = () => {
    const passwordConfirmed = data.password === data.confirmPassword;
    const passwordValid = validatePassword(data.password);
    if (!passwordConfirmed) {
      return props.setError("Passwords not matched");
    }
    if (!passwordValid) {
      return props.setError("Password not secure");
    }

    API.auth.forgotPassword(
      {
        confirmPassword: data.confirmPassword,
        email: data.email,
        otp: Number(data.code),
        password: data.password,
      },
      getAPIFunctionOptions("success")
    );
  };
  const handleContinue = async () => {
    if (currentSectionId() === "email") {
      sendVerificationEmail();
    } else if (currentSectionId() === "code") {
      verifyCode();
    } else if (currentSectionId() === "password") {
      changePassword();
    } else {
      props.goToLoginView();
    }
  };

  createEffect(
    on([() => Object.values(data)], () => {
      props.setError("");
    })
  );

  return (
    <AuthFlow
      buttonContent={
        <Switch>
          <Match when={currentSectionId() === "password"}>
            Change password
          </Match>
          <Match when={currentSectionId() === "success"}>Go to login</Match>
          <Match when={true}>Continue</Match>
        </Switch>
      }
      onButtonClick={() => handleContinue()}
      heading="Restore password"
      currentSectionId={currentSectionId()}
      sections={sections}
      setData={setData}
      data={data}
    />
  );
};

export { ForgotPasswordView };
