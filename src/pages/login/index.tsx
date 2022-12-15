import {
  Component,
  createEffect,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import sideImage from "#assets/images/login-side-image.jpg";
import { Button } from "#components/primitives/button";
import { LoginView } from "./login";
import { RegisterView } from "./register";
import { ForgotPasswordView } from "./forgot-password";
import { AuthGuard } from "#components/layouts/authenticated/guard";
import MoreButton from "../../assets/icons/button-more.png";


const LoginPage: Component = () => {
  const [error, setError] = createSignal("");
  const [view, setView] = createSignal<
    "login" | "register" | "forgot-password"
  >("login");

  return (
    <AuthGuard>
      <div class="flex min-h-full md:h-full">
        <div class="flex items-center justify-center max-w-[40%]">
          <img
            src={sideImage}
            class="hidden w-full h-full md:block"
          />
        </div>
        <div class="relative flex items-center justify-center flex-1 md:h-full max-w-full px-4 pt-20 pb-8 md:py-16">
          <div class="absolute top-3 md:top-5 right-0 md:right-2 flex items-center justify-end h-12 px-4">
            <Switch>
              <Match when={view() === "login"}>
                <span class="text-sm text-[#7a86a1]">New user?</span>
                <Button class="p-0 text-sm font-medium text-[#6149cd] ml-1 mr-4"
                  color="primary"
                  variant="text"
                  onClick={() => setView("register")}
                >
                  Create an account
                </Button>
                <img
                src={MoreButton}
                class="cursor-pointer"
              />
              </Match>
              <Match when={view() === "register"}>
                <span class="text-sm text-[#7a86a1]">Existing user?</span>
                <Button class="p-0 text-sm font-medium text-[#6149cd] ml-1 mr-4"
                  color="primary"
                  variant="text"
                  onClick={() => setView("login")}
                >
                  Login
                </Button>
                <img
                src={MoreButton}
                class="cursor-pointer"
              />
              </Match>
              <Match when={view() === "forgot-password"}>
                <Button
                  color="primary"
                  variant="text"
                  onClick={() => setView("login")}
                >
                  Login
                </Button>
                <span>/</span>
                <Button
                  color="primary"
                  variant="text"
                  onClick={() => setView("register")}
                >
                  Register
                </Button>
              </Match>
            </Switch>
          </div>
          <Switch>
            <Match when={view() === "login"}>
              <LoginView
                goToForgotPasswordView={() => setView("forgot-password")}
                setError={setError}
              />
            </Match>
            <Match when={view() === "register"}>
              <RegisterView
                goToLoginView={() => setView("login")}
                setError={setError}
              />
            </Match>
            <Match when={view() === "forgot-password"}>
              <ForgotPasswordView
                goToLoginView={() => setView("login")}
                setError={setError}
              />
            </Match>
          </Switch>
          <Show when={error()}>
            <div class="absolute left-0 flex items-center justify-center w-full bottom-8">
              <span class="text-sm text-white bg-red-500 rounded-3xl px-2 py-0.5">
                {error()}
              </span>
            </div>
          </Show>
          {/* <div class="absolute bottom-0 right-0 flex items-center justify-end w-full h-12 px-4">
            <span class="text-sm">Panoton ©2022</span>
          </div> */}
        </div>
      </div>
    </AuthGuard>
  );
};

export { LoginPage };
