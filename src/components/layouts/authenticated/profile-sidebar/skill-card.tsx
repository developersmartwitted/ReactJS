import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Component, createSignal } from "solid-js";
import { VerifySkillModal } from "./verify-skill-modal";

interface SkillCardProps {
  skill: {
    skillId: string;
    skillName: string;
    level: string;
    experience: string;
  };
}

const SkillCard: Component<SkillCardProps> = (props) => {
  const [verifyModalOpen, setVerifyModalOpen] = createSignal(false);

  return (
    <>
      <Card class="flex flex-col gap-3 p-5">
        <div class="flex items-center justify-center">
          <h3 class="flex-1 text-lg font-semibold">{props.skill.skillName}</h3>
          <Button onClick={() => setVerifyModalOpen(true)} class="m-0">
            Verify
          </Button>
        </div>
        <div class="flex flex-col">
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">Experience</span>
            <span class="mx-2 font-semibold">
              {props.skill.experience}+ Months
            </span>
          </span>
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">Level</span>
            <span class="mx-2 font-semibold">{props.skill.level}</span>
          </span>
        </div>
      </Card>
      <VerifySkillModal
        id={props.skill.skillId}
        opened={verifyModalOpen()}
        setOpened={setVerifyModalOpen}
      />
    </>
  );
};

export { SkillCard };
