import { IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Overlay } from "#components/primitives/overlay";
import { createRef, Ref } from "#lib/ref";
import { mdiClose } from "@mdi/js";
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  ParentComponent,
  Setter,
  Show,
  useContext,
} from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
}
interface ModalContext {
  ref: Ref<HTMLElement>[0];
  opened: Accessor<boolean>;
  setOpened: Setter<boolean>;
}

const ModalContext = createContext<ModalContext>();
const Modal: ParentComponent<ModalProps> = (props) => {
  const modalContext = useContext(ModalContext)!;
  const canShow = createMemo(() => {
    return props.opened && modalContext.opened() && modalContext.ref();
  });

  createEffect(
    on([() => props.opened], ([opened]) => {
      if (opened && !modalContext.opened()) {
        modalContext.ref()!.textContent = "";
        modalContext.setOpened(true);
      } else if (!opened && modalContext.opened()) {
        modalContext.setOpened(false);
      }
    })
  );
  createEffect(
    on([modalContext.opened], ([opened]) => {
      if (!opened) {
        props.setOpened(false);
      }
    })
  );

  return (
    <Show when={canShow()}>
      <Portal
        mount={modalContext.ref()!}
        ref={(element) => {
          element.classList.add("contents");
        }}
      >
        {props.children}
      </Portal>
    </Show>
  );
};
const ModalContainer: ParentComponent = (props) => {
  const [containerRef, setContainerRef] = createRef<HTMLElement>();
  const [opened, setOpened] = createSignal(false);

  return (
    <ModalContext.Provider value={{ ref: containerRef, opened, setOpened }}>
      <Portal>
        <Overlay opened={opened()} onOverlayClick={() => setOpened(false)}>
          <div class="relative">
            <IconButton
              class="absolute top-5 right-5"
              icon={mdiClose}
              onClick={() => setOpened(false)}
            />
            <Card
              class="flex flex-col gap-2 p-6 max-w-[calc(100vw-2rem)] w-screen md:w-[30rem]"
              ref={setContainerRef}
            ></Card>
          </div>
        </Overlay>
      </Portal>
      {props.children}
    </ModalContext.Provider>
  );
};

export { Modal, ModalContainer };
