import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Input } from "#components/primitives/input";
import { Overlay } from "#components/primitives/overlay";
import { Select } from "#components/primitives/select";
import { API, Skill } from "#lib/api";
import {
  Component,
  createSignal,
  createEffect,
  on,
  createMemo,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAccessToken, useAuthenticatedAPI } from "../guard";
import { SkillsInput } from "./skills-input";

interface AddSkillsModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetch(): void;
}

const getEmptyAddSkillsModalData = () => ({
  domain: "",
  role: "",
  experience: 0,
  level: "Beginner",
});
const AddSkillsModal: Component<AddSkillsModalProps> = (props) => {
  const [skill, setSkill] = createSignal<Skill | null>(null);
  const [data, setData] = createStore(getEmptyAddSkillsModalData());
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return data.domain && data.experience && data.level && data.role && skill();
  });
  const addSkills = async () => {
    if (!filled()) {
      return;
    }

    await authenticatedAPI.user.updateSkills({
      domain: data.domain,
      role: data.role,
      skills: [
        {
          experience: data.experience,
          level: data.level,
          skillId: skill()!.id,
        },
      ],
    });
    props.setOpened(false);
    props.refetch();
  };

  createEffect(
    on([() => props.opened], () => {
      setData(getEmptyAddSkillsModalData());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Add Skill</h1>
      <div class="flex w-full">
        <Input
          value={data.domain}
          setValue={(domain) => setData("domain", domain)}
          label="Domain"
          placeholder="Experience domain"
          class="w-full"
          wrapperClass="flex-1"
        />

        <Input
          value={data.role}
          setValue={(role) => setData("role", role)}
          label="Role"
          placeholder="Previous role"
          class="w-full"
          wrapperClass="flex-1"
        />
      </div>
      <SkillsInput
        skills={skill() ? [skill()!] : []}
        setSkills={(skills) => setSkill(skills[0])}
        disabled={Boolean(skill())}
      />
      <div class="flex items-center justify-center w-full">
        <span class="flex-1">Months of experience</span>
        <Input
          value={`${data.experience}`}
          setValue={(experience) => setData("experience", Number(experience))}
          type="number"
        />
      </div>
      <div class="flex items-center justify-center w-full">
        <span class="flex-1">Experience level</span>
        <Select
          value={data.level}
          setValue={(level) => setData("level", level)}
          options={["Beginner", "Intermediate", "Expert"].map((value) => ({
            label: value,
            value: value,
          }))}
        ></Select>
      </div>

      <Button color="primary" onClick={() => addSkills()} disabled={!filled()}>
        Add Skill
      </Button>
    </Modal>
  );
};

export { AddSkillsModal };
