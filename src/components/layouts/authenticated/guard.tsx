import { Button, IconButton } from "#components/primitives/button";
import { Loader } from "#components/primitives/loader";
import { API, APIFunctionOptions } from "#lib/api";
import { mdiClose, mdiCloseCircle } from "@mdi/js";
import { useLocation, useNavigate } from "@solidjs/router";
import { Motion, Presence } from "@motionone/solid";
import clsx from "clsx";
import {
  ParentComponent,
  onMount,
  createSignal,
  Show,
  createContext,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

interface AuthGuardStore {
  token: string;
}
interface MessageDetails {
  message: string;
  type: "error" | "success";
}
interface AuthGuardMethods {
  onMessage(messageDetails: MessageDetails): void;
}

let authenticatedAPIProxy: typeof API;
let authenticatedAPIGroupProxies: Record<string, unknown> = {};

const AuthGuardContext = createContext<[AuthGuardStore, AuthGuardMethods]>([
  { token: "" },
  { onMessage() {} },
]);
const useAccessToken = () => {
  const [store] = useContext(AuthGuardContext);

  return () => store.token;
};
const useAuthenticatedAPI = () => {
  if (authenticatedAPIProxy) return authenticatedAPIProxy;

  authenticatedAPIProxy = new Proxy(API, {
    get(api, apiGroupKey: string) {
      const [, methods] = useContext(AuthGuardContext);
      const accessToken = useAccessToken();
      if (typeof authenticatedAPIGroupProxies[apiGroupKey] === "function") {
        return authenticatedAPIGroupProxies[apiGroupKey];
      }
      if (authenticatedAPIGroupProxies[apiGroupKey]) {
        return authenticatedAPIGroupProxies[apiGroupKey];
      }

      authenticatedAPIGroupProxies[apiGroupKey] = new Proxy(
        api[apiGroupKey as keyof typeof api],
        {
          get(apiGroup, apiMethodKey: string) {
            return (...args: unknown[]) => {
              const apiMethod = apiGroup[
                apiMethodKey as keyof typeof apiGroup
              ] as Function;
              const apiMethodOptions: APIFunctionOptions<{}> = {
                accessToken: accessToken(),
              };
              if (args[args.length - 1] === null) {
                return apiMethod(...args.slice(0, -1), apiMethodOptions);
              }

              apiMethodOptions.onError = ({ message }) => {
                methods.onMessage({ message, type: "error" });
              };
              apiMethodOptions.onSuccess = ({ message }) => {
                methods.onMessage({ message, type: "success" });
              };

              return apiMethod(...args, apiMethodOptions);
            };
          },
        }
      );

      return authenticatedAPIGroupProxies[apiGroupKey];
    },
  });

  return authenticatedAPIProxy;
};
const AuthGuard: ParentComponent = (props) => {
  const [store, setStore] = createStore<AuthGuardStore>({ token: "" });
  const [timeoutHandle, setTimeoutHandle] = createSignal(0);
  const [message, setMessage] = createSignal<MessageDetails | null>(null);
  const [verified, setVerified] = createSignal(false);
  const location = useLocation();
  const navigate = useNavigate();
  const methods: AuthGuardMethods = {
    onMessage(message) {
      setMessage(null);
      clearTimeout(timeoutHandle());
      setMessage(message);
      setTimeoutHandle(
        setTimeout(() => {
          setMessage(null);
        }, 5000)
      );
    },
  };
  onMount(async () => {
    try {
      const { data } = await API.auth.refresh({});

      if (data?.token) {
        setStore("token", data?.token.accessToken);

        if (location.pathname.includes("login")) {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      navigate("/login");
    } finally {
      setVerified(true);
    }
  });

  return (
    <AuthGuardContext.Provider value={[store, methods]}>
      <Presence>
        <Show when={Boolean(message())}>
          <Motion.div
            class={clsx(
              "fixed bottom-0 left-0 z-50 p-2 rounded-tr-2xl",
              message()!.type === "success"
                ? "bg-green-500 hover:bg-green-600 "
                : "bg-red-500 hover:bg-red-600"
            )}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <IconButton
              class="flex-row-reverse text-white hover:bg-transparent"
              icon={mdiClose}
              label={<span class="ml-1 mr-2">{message()!.message}</span>}
              onClick={() => {
                setMessage(null);
              }}
              variant="text"
            ></IconButton>
          </Motion.div>
        </Show>
      </Presence>
      <Show
        when={verified()}
        fallback={
          <div class="flex items-center justify-center w-full h-full">
            <Loader size="large" />
          </div>
        }
      >
        {props.children}
      </Show>
    </AuthGuardContext.Provider>
  );
};

export { AuthGuard, useAccessToken, useAuthenticatedAPI };
