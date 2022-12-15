import { IconButton, Button } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { Menu } from "#components/primitives/menu";
import { API, Skill } from "#lib/api";
import { createRef } from "#lib/ref";
import { mdiClose } from "@mdi/js";
import clsx from "clsx";
import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  on,
  For,
} from "solid-js";
import { useAccessToken, useAuthenticatedAPI } from "../guard";

interface SkillsInputProps {
  skills: Skill[];
  setSkills(skills: Skill[]): void;
  disabled?: boolean;
}

const SkillsInput: Component<SkillsInputProps> = (props) => {
  const [fetchedSkills, setFetchedSkills] = createSignal<Skill[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [timeoutHandle, setTimeoutHandle] = createRef(0);
  const authenticatedAPI = useAuthenticatedAPI();
  const accessToken = useAccessToken();
  const availableSkills = createMemo(() => {
    return fetchedSkills().filter((filteredSkill) => {
      return !props.skills.find((skill) => {
        return skill.id === filteredSkill.id;
      });
    });
  });
  const fetchSkills = async (search: string) => {
    if (!search) {
      return setFetchedSkills([]);
    }

    const result = await API.skills.getSkills(
      {
        query: { limit: "10", page: "1", search },
      },
      { accessToken: accessToken() }
    );

    if (result.data) {
      setFetchedSkills(result.data.data);
    } else {
      setFetchedSkills([]);
    }
  };
  const handleBlur = () => {
    clearTimeout(timeoutHandle() || 0);
    setFetchedSkills([]);
  };
  const addSkill = (skill: Skill) => {
    setInputValue("");
    setFetchedSkills([]);
    props.setSkills([...props.skills, skill]);
  };
  const removeSkill = (skill: Skill) => {
    props.setSkills(
      props.skills.filter((filteredSkill) => {
        if (filteredSkill.id === skill.id) {
          return false;
        }
        return true;
      })
    );
  };

  createEffect(
    on([inputValue], () => {
      clearTimeout(timeoutHandle() || 0);
      setTimeoutHandle(
        setTimeout(() => {
          fetchSkills(inputValue());
        }, 250)
      );
    })
  );

  return (
    <div class="w-full">
      <span>Skills</span>
      <div
        class={clsx(
          "fixed top-0 left-0 w-screen h-screen",
          availableSkills().length === 0 && "hidden"
        )}
        onClick={handleBlur}
      />
      <div class="flex flex-wrap w-full">
        <For each={props.skills}>
          {(skill) => {
            return (
              <IconButton
                icon={mdiClose}
                color="primary"
                size="small"
                label={<span class="pl-2">{skill.name}</span>}
                onClick={() => removeSkill(skill)}
              />
            );
          }}
        </For>
      </div>
      <Menu
        opened={availableSkills().length !== 0}
        anchor={
          <Input
            placeholder="Add skill"
            wrapperClass="w-full"
            class="w-full"
            list="opt-list"
            value={inputValue()}
            setValue={setInputValue}
            disabled={props.disabled}
          />
        }
      >
        <For each={availableSkills()}>
          {(skill) => {
            return (
              <Button onClick={() => addSkill(skill)}>{skill.name}</Button>
            );
          }}
        </For>
      </Menu>
    </div>
  );
};

export { SkillsInput };
