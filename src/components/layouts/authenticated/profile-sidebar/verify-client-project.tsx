import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import {
  Component,
  createSignal,
  createEffect,
  on,
  createMemo,
} from "solid-js";
import { useAuthenticatedAPI } from "../guard";

interface VerifyClientProjectModalProps {
  id: string;
  opened: boolean;
  setOpened(opened: boolean): void;
}
const VerifyClientProjectModal: Component<VerifyClientProjectModalProps> = (
  props
) => {
  const [name, setName] = createSignal("");
  const [cost, setCost] = createSignal(0);
  const [email, setEmail] = createSignal("");
  const [comments, setComments] = createSignal("");
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return name() && cost() && email() && comments();
  });
  const verifyProject = async () => {
    await authenticatedAPI.clientProjects.verifyClientProject({
      clientProjectId: props.id,
      cost: String(cost()),
      name: name(),
      email: email(),
      comments: comments(),
    });
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], () => {
      setName("");
      setComments("");
      setCost(0);
      setEmail("");
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Verify Project</h1>
      <p>
        Send a message to your client and those individuals you've worked with
        on the project to verify your past experience.
      </p>
      <Input value={name()} setValue={setName} label="Name" class="w-full" />
      <Input
        type="number"
        value={String(cost())}
        setValue={setCost}
        label="Cost"
        class="w-full"
      />
      <Input
        value={email()}
        setValue={setEmail}
        label="Email"
        type="email"
        class="w-full"
      />
      <Input
        value={comments()}
        setValue={setComments}
        label="Comments"
        textarea
        class="w-full"
      />

      <Button
        color="primary"
        onClick={() => verifyProject()}
        disabled={!filled()}
      >
        Verify
      </Button>
    </Modal>
  );
};

export { VerifyClientProjectModal };
