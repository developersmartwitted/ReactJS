import { IconButton, Button } from "#components/primitives/button";
import { API } from "#lib/API";
import { mdiEyeOff, mdiEye } from "@mdi/js";
import { useNavigate } from "@solidjs/router";
import { Component, createEffect, createSignal, For, on, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { AuthFlow } from "./auth-flow";
import { Section, validateEmail } from "./auth-utils";

interface LoginViewProps {
  goToForgotPasswordView(): void;
  setError(error: string): void;
}

const initialData = {
  email: "",
  password: "",
};
const LoginView: Component<LoginViewProps> = (props) => {
  const [data, setData] = createStore({ ...initialData });
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const navigate = useNavigate();
  const login = async () => {
    const emailValid = validateEmail(data.email);

    if (!emailValid) {
      return props.setError("Invalid email");
    }

    API.auth.login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess() {
          navigate("/");
        },
        onError(data) {
          props.setError(data.message);
        },
      }
    );
  };
  const sections: Section<keyof typeof initialData>[] = [
    {
      id: "form",
      fields: [
        {
          label: "Your email",
          placeholder: "name@example.com",
          dataKey: "email",
        },
        {
          label: "Password",
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
      ],
      component: (
        <div class="flex items-center mt-6 mb-6">
          <label class="text-sm text-[#7a86a1] flex items-center mr-6"><input class="h-[18px] w-[18px] mr-2" type="checkbox" />Remember me</label>
          <Button
            variant="text"
            color="primary"
            onClick={props.goToForgotPasswordView}
            class="p-0 m-0 text-sm font-medium text-[#6149cd]"
          >
            Forgot password?
          </Button>
        </div>
        
      ),
    },
  ];

  createEffect(
    on([() => Object.values(data)], () => {
      props.setError("");
    })
  );

  return (
    <AuthFlow
      onButtonClick={login}
      buttonContent="Sign in"
      heading="Sign in"
      currentSectionId="form"
      sections={sections}
      setData={setData}
      data={data}
    />
  );
};

export { LoginView };
