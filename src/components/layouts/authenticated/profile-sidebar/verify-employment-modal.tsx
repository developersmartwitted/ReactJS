import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { Component, createSignal, createEffect, on } from "solid-js";
import { useAuthenticatedAPI } from "../guard";

interface VerifyEmploymentModalProps {
  employmentId: string;
  opened: boolean;
  setOpened(opened: boolean): void;
}
const VerifyEmploymentModal: Component<VerifyEmploymentModalProps> = (
  props
) => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [role, setRole] = createSignal("");
  const [comments, setComments] = createSignal("");
  const authenticatedAPI = useAuthenticatedAPI();

  const verifyEmployment = async () => {
    await authenticatedAPI.employment.verifyEmploymentHistory({
      employmentId: props.employmentId,
      role: role(),
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      comments: comments(),
    });
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], () => {
      setRole("");
      setComments("");
      setFirstName("");
      setLastName("");
      setEmail("");
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Verify Employment</h1>
      <p>
        Send a message to your employer to confirm and verify your employment
        history.
      </p>
      <Input value={role()} setValue={setRole} label="Role" class="w-full" />
      <Input
        value={firstName()}
        setValue={setFirstName}
        label="First Name"
        class="w-full"
      />
      <Input
        value={lastName()}
        setValue={setLastName}
        label="Last Name"
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

      <Button color="primary" onClick={() => verifyEmployment()}>
        Verify
      </Button>
    </Modal>
  );
};

export { VerifyEmploymentModal };
