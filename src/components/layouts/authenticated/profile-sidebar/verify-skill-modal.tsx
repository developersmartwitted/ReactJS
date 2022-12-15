import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { validateEmail } from "#pages/login/auth-utils";
import { Component, createEffect, on, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface VerifySkillModalProps {
  id: string;
  opened: boolean;
  setOpened(opened: boolean): void;
}

const getEmptyVerifySkillModalMember = () => ({
  name: "",
  email: "",
  role: "",
});
const VerifySkillModal: Component<VerifySkillModalProps> = (props) => {
  const authenticatedAPI = useAuthenticatedAPI();
  const [member, setMember] = createStore(getEmptyVerifySkillModalMember());
  const filled = createMemo(() => {
    return validateEmail(member.email) && member.name && member.role;
  });
  const verifySkill = async () => {
    if (!filled()) {
      return;
    }

    await authenticatedAPI.user.verifySkill({
      skillId: props.id,
      members: [member],
    });
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], () => {
      setMember(getEmptyVerifySkillModalMember());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Verify Skill</h1>
      <span>
        Send a message to the clients, coworkers, managers, and those that
        individuals who can vouch for your skills.
      </span>
      <Input
        value={member.name}
        setValue={(name) => setMember("name", name)}
        label="Name"
        class="w-full"
      ></Input>
      <Input
        type="email"
        value={member.email}
        setValue={(email) => setMember("email", email)}
        label="Email"
        class="w-full"
      ></Input>
      <Input
        label="Role"
        value={member.role}
        class="w-full"
        setValue={(role) => setMember("role", role)}
      ></Input>
      <Button
        color="primary"
        onClick={() => verifySkill()}
        disabled={!filled()}
      >
        Verify
      </Button>
    </Modal>
  );
};

export { VerifySkillModal };
