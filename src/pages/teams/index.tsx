import { Button, IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { mdiClose, mdiDelete, mdiMagnify, mdiPlusCircle } from "@mdi/js";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  on,
  Setter,
  Show,
  Suspense,
} from "solid-js";
import "#styles/backgrounds.css";
import {
  AuthenticatedLayout,
  useAccessToken,
  useAuthenticatedAPI,
} from "#components/layouts/authenticated";
import { TeamsList } from "./teams-list";
import { Input } from "#components/primitives/input";
import { Checkbox } from "#components/primitives/checkbox";
import { API, Profile, Skill } from "#lib/api/index";
import { Overlay } from "#components/primitives/overlay";
import { createRef } from "#lib/ref";
import clsx from "clsx";
import { validateEmail } from "#pages/login/auth-utils";
import { createStore } from "solid-js/store";
import { Menu } from "#components/primitives/menu";
import { components } from "#lib/api/schema";
import { Loader } from "#components/primitives/loader";

type Schemas = components["schemas"];

interface SkillsInputProps {
  skills: Skill[];
  setSkills(skills: Skill[]): void;
}

const SkillsInput: Component<SkillsInputProps> = (props) => {
  const [fetchedSkills, setFetchedSkills] = createSignal<Skill[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [timeoutHandle, setTimeoutHandle] = createRef(0);
  const accessToken = useAccessToken();
  const authenticatedAPI = useAuthenticatedAPI();
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
    debugger
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
        }, 150)
      );
    })
  );

  return (
    <div>
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

interface CreateTeamModalProps {
  opened: boolean;
  profile: Profile;
  setOpened(opened: boolean): void;
}

interface Member {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
}

const CreateTeamModal: Component<CreateTeamModalProps> = (props) => {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [skills, setSkills] = createSignal<Skill[]>([]);
  const [members, setMembers] = createStore<Member[]>([]);
  const [memberFilled, setmemberFilled] = createSignal(false);
  const [newMember, setNewMember] = createStore<Member>({
    designation: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const addMember = () => {debugger
    setMembers((members) => [...members, newMember]);
    //setmemberFilled(true);
    setNewMember({
      designation: "",
      email: "",
      firstName: "",
      lastName: "",
    });
  };
  const removeMember = (index: number) => {
    return setMembers((members) => members.splice(index, 0));
  };

  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    debugger
    const teamDetailsFilled = name() && description() && skills().length > 0;
    const memberDetailsFilled =
      members.length > 0 &&
      members.every(({ lastName, firstName, email, designation }) => {
        return (
          firstName && lastName && email && validateEmail(email) && designation
        );
      });

    return teamDetailsFilled && memberDetailsFilled;
  });
  const newMemberFilled = createMemo(() => {
    return (
      newMember.firstName &&
      newMember.lastName &&
      newMember.email &&
      newMember.email !== props.profile.email &&
      validateEmail(newMember.email) &&
      newMember.designation
    );
  });
  const createTeam = async () => {
    debugger
    await authenticatedAPI.teams.createTeam({
      comment: "Comment",
      description: description(),
      inviteMembers: members.map(
        ({ designation, email, firstName, lastName }) => ({
          designation,
          email,
          firstName,
          lastName,
        })
      ),
      name: name(),
      profileImageLocation: "teams/e50105ca9feb9d5f8a317347f0f8f873.png",
      profileImageMimeType: "png",
      profileImageName: "hero.png",
      skills: skills().map((skill) => skill.id),
    });
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], () => {
      setName("");
      setDescription("");
      setSkills([]);
      setMembers(() => []);
    })
  );

  return (
    <Overlay
      opened={props.opened}
      onOverlayClick={() => props.setOpened(false)}
    >
      <Card
        class="p-3 max-w-[calc(100vw-2rem)] w-screen md:w-[30rem]"
        color="contrast"
      >
        <div class="flex flex-col gap-2 overflow-auto max-h-[calc(100vh-2rem)] p-3">
          <div class="flex items-center w-full">
            <h1 class="flex-1 text-2xl font-bold">Create Team</h1>
            <IconButton
              icon={mdiClose}
              class="m-0"
              onClick={() => props.setOpened(false)}
            />
          </div>
          <h2 class="w-full text-lg font-semibold">Details</h2>
          <Input
            placeholder="Enter team name"
            wrapperClass="w-full"
            class="w-full"
            label="Team name"
            value={name()}
            setValue={setName}
          />
          <Input
            placeholder="Add description"
            wrapperClass="w-full"
            class="w-full"
            label="Team description"
            textarea
            value={description()}
            setValue={setDescription}
          />
          <SkillsInput skills={skills()} setSkills={setSkills} />
          <h2 class="w-full text-lg font-semibold">Members</h2>
          <For each={members}>
            {({ firstName, lastName, designation, email }, index) => (
              <div class="flex items-start rounded-2xl">
                <div class="flex-1">
                  <p class="font-semibold">
                    {firstName} {lastName}{" "}
                    {designation ? `(${designation})` : ""}
                  </p>
                  <span>{email}</span>
                </div>
                <IconButton
                  icon={mdiDelete}
                  onClick={() => removeMember(index())}
                />
              </div>
            )}
          </For>
          <Card class="flex flex-col">
            <div class="flex flex-col md:flex-row">
              <Input
                placeholder="First name"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.firstName}
                setValue={(value) => setNewMember("firstName", value)}
              />
              <Input
                placeholder="Last name"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.lastName}
                setValue={(value) => setNewMember("lastName", value)}
              />
            </div>
            <div class="flex flex-col md:flex-row">
              <Input
                placeholder="Email"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.email}
                setValue={(value) => setNewMember("email", value)}
                type="email"
              />
              <Input
                placeholder="Designation"
                class="w-full md:w-32"
                value={newMember.designation}
                setValue={(value) => setNewMember("designation", value)}
              />
            </div>
            <Button
              disabled={!newMemberFilled()}
              onClick={() => addMember()}
              class="flex-1"
            >
              Add member
            </Button>
          </Card>
          <Button
            color="primary"
            disabled={!filled()}
            onClick={() => createTeam()}
            class="mx-0"
          >
            Create team
          </Button>
        </div>
      </Card>
    </Overlay>
  );
};

interface EditTeamModalProps {
  teamId: string;
  profile: Profile;
  initialData: Partial<{
    name: string;
    description: string;
    skills: Skill[];
    teamMembers: Member[];
  }>;
  opened: boolean;
  setOpened(opened: boolean): void;
}

const EditTeamModal: Component<EditTeamModalProps> = (props) => {
  const [name, setName] = createSignal(props.initialData.name || "");
  const [description, setDescription] = createSignal(
    props.initialData.description || ""
  );
  const [skills, setSkills] = createSignal<Skill[]>(
    props.initialData.skills || []
  );

  const [members, setMembers] = createSignal<Member[]>(
    props.initialData.teamMembers || []
  );

  createEffect(() => setMembers(props.initialData.teamMembers || []));

  const [newMember, setNewMember] = createStore<Member & { comment: string }>({
    designation: "",
    email: "",
    firstName: "",
    lastName: "",
    comment: "",
  });
  const newMemberFilled = createMemo(() => {
    return (
      newMember.firstName &&
      newMember.lastName &&
      newMember.email &&
      newMember.comment &&
      validateEmail(newMember.email) &&
      newMember.designation
    );
  });
  const authenticatedAPI = useAuthenticatedAPI();

  const filled = () => {
    const teamDetailsFilled = name() && description() && skills().length > 0;

    return teamDetailsFilled;
  };
  const editTeam = async () => {
    await authenticatedAPI.teams.updateTeam({
      teamId: props.teamId,
      description: description(),
      name: name(),
      profileImageLocation: "teams/e50105ca9feb9d5f8a317347f0f8f873.png",
      profileImageMimeType: "png",
      profileImageName: "hero.png",
      skills: skills().map((skill) => skill.id),
    });
    props.setOpened(false);
  };

  const removeMember = async (index: number) => {
    await authenticatedAPI.teams.removeTeamMember({
      teamId: props.teamId,
      teamMemberId: members()[index].userId,
    });
    return setMembers((members) => members.splice(index, 1));
  };
  const inviteNewMember = async () => {
    await authenticatedAPI.teams.inviteMembers({
      teamId: props.teamId,
      comment: "props",
      inviteMembers: [newMember],
    });

    setNewMember({
      comment: "",
      designation: "",
      email: "",
      firstName: "",
      lastName: "",
    });
  };

  createEffect(
    on([() => props.opened], () => {
      setName(props.initialData.name || "");
      setDescription(props.initialData.description || "");
      setSkills(props.initialData.skills || []);
    })
  );

  return (
    <Overlay
      opened={props.opened}
      onOverlayClick={() => props.setOpened(false)}
    >
      <Card
        class="p-3 max-w-[calc(100vw-2rem)] w-screen md:w-[30rem]"
        color="contrast"
      >
        <div class="flex flex-col gap-2 overflow-auto max-h-[calc(100vh-2rem)] p-3">
          <div class="flex items-center w-full">
            <h1 class="flex-1 text-2xl font-bold">Edit Team</h1>
            <IconButton
              icon={mdiClose}
              class="m-0"
              onClick={() => props.setOpened(false)}
            />
          </div>
          <h2 class="w-full text-lg font-semibold">Details</h2>
          <Input
            placeholder="Enter team name"
            wrapperClass="w-full"
            class="w-full"
            label="Team name"
            value={name()}
            setValue={setName}
          />
          <Input
            placeholder="Add description"
            wrapperClass="w-full"
            class="w-full"
            label="Team description"
            textarea
            value={description()}
            setValue={setDescription}
          />
          <SkillsInput skills={skills()} setSkills={setSkills} />
          <h2 class="w-full text-lg font-semibold">Members</h2>
          <For each={members()}>
            {({ firstName, lastName, designation, email }, index) => (
              <div class="flex items-start rounded-2xl">
                <div class="flex-1">
                  <p class="font-semibold">
                    {firstName} {lastName}{" "}
                    {designation ? `(${designation})` : ""}
                  </p>
                  <span>{email}</span>
                </div>
                <Show when={email !== props.profile.email}>
                  <IconButton
                    icon={mdiDelete}
                    onClick={() => removeMember(index())}
                  />
                </Show>
              </div>
            )}
          </For>
          <Card class="flex flex-col">
            <div class="flex flex-col md:flex-row">
              <Input
                placeholder="First name"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.firstName}
                setValue={(value) => setNewMember("firstName", value)}
              />
              <Input
                placeholder="Last name"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.lastName}
                setValue={(value) => setNewMember("lastName", value)}
              />
            </div>
            <div class="flex flex-col md:flex-row">
              <Input
                placeholder="Email"
                wrapperClass="w-full"
                class="flex-1"
                value={newMember.email}
                setValue={(value) => setNewMember("email", value)}
                type="email"
              />
              <Input
                placeholder="Designation"
                class="w-full md:w-32"
                value={newMember.designation}
                setValue={(value) => setNewMember("designation", value)}
              />
            </div>
            <Input
              placeholder="Comment"
              class="w-full"
              value={newMember.comment}
              setValue={(value) => setNewMember("comment", value)}
            />
            <Button
              disabled={!newMemberFilled()}
              onClick={() => inviteNewMember()}
              class="flex-1"
            >
              Invite member
            </Button>
          </Card>
          <Button
            color="primary"
            disabled={!filled()}
            onClick={() => editTeam()}
            class="mx-0"
          >
            Save
          </Button>
        </div>
      </Card>
    </Overlay>
  );
};

interface TeamsPageModalsProps {
  createTeamModalOpened: boolean;
  editTeamModalOpened: boolean;
  setCreateTeamModalOpened: Setter<boolean>;
  setEditTeamModalOpened: Setter<boolean>;
  selectedTeam: Schemas["TeamListDto"];
}
const TeamsPageModals: Component<TeamsPageModalsProps> = (props) => {
  const authenticatedAPI = useAuthenticatedAPI();
  const [profile] = createResource(async () => {
    const { data } = await authenticatedAPI.user.getProfile({}, null);
    return data;
  });
  return (
    <>
      <CreateTeamModal
        opened={props.createTeamModalOpened}
        setOpened={props.setCreateTeamModalOpened}
        profile={profile()!}
      />
      <EditTeamModal
        opened={props.editTeamModalOpened}
        teamId={props.selectedTeam.teamId}
        initialData={props.selectedTeam}
        setOpened={props.setEditTeamModalOpened}
        profile={profile()!}
      ></EditTeamModal>
    </>
  );
};
const TeamsPage: Component = () => {
  const [createTeamModalOpened, setCreateTeamModalOpened] = createSignal(false);
  const [editTeamModalOpened, setEditTeamModalOpened] = createSignal(false);
  const [selectedTeam, setSelectedTeam] = createSignal<Schemas["TeamListDto"]>(
    {} as unknown as any
  );

  return (
    <AuthenticatedLayout>
      <Suspense fallback={<Loader />}>
        <div class="flex-1 h-[calc(100%-4rem)] overflow-auto">
          <div class="flex flex-col items-center justify-center px-8 pt-4 md:flex-row">
            <div class="flex-1 w-full pb-4 text-center md:text-left md:pb-0">
              <h1 class="w-full text-4xl font-extrabold">Teams</h1>
              <span class="w-full text-gray-400">Hello, welcome back.</span>
            </div>
            <Input
              wrapperClass="w-full md:w-56"
              class="flex-row-reverse w-full bg-gray-200"
              placeholder="Search Teams"
              adornment={
                <IconButton
                  class="rounded-xl"
                  icon={mdiMagnify}
                  text="soft"
                  variant="text"
                />
              }
              disabled
              adornmentWrapperClass="right-0.5"
            />
          </div>
          <div class="flex flex-col flex-1 h-[calc(100%-5rem)] p-4 md:p-8">
            <div class="flex items-center justify-center pb-4">
              <IconButton
                class="m-0 shadow-md"
                icon={mdiPlusCircle}
                color="primary"
                onClick={() => setCreateTeamModalOpened(true)}
                label={<span class="pl-2 pr-1">Create Team</span>}
              />
              <div class="flex-1" />
            </div>
            <TeamsList
              createTeamModalOpened={createTeamModalOpened()}
              editTeamModalOpened={editTeamModalOpened()}
              onClick={(team) => {
                const transformedVal = {
                  ...team,
                  name: team.teamName,
                  skills: team.skills.map(({ skillId, skill }) => ({
                    id: skillId,
                    name: skill,
                  })),
                };
                setSelectedTeam(transformedVal);
                setEditTeamModalOpened(true);
              }}
            />
          </div>
        </div>
        <div class="flex-col items-center justify-start hidden h-full p-4 ml-2 bg-white border-gray-200 shadow-inner lg:flex w-72">
          <span class="text-gray-500 ">Team Goals</span>
          <span class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr">
            2022
          </span>
          <span class="text-sm text-gray-400">
            Work together to achieve great things!
          </span>

          <Button
            color="primary"
            size="large"
            class="mt-8 shadow-lg shadow-[#6149cd]"
            disabled
          >
            Add new goal
          </Button>
          <div class="flex flex-col items-center justify-start flex-1 w-full gap-4 mt-4">
            <For
              each={[
                {
                  teamName: "Digital Marketing",
                  goal: "Reach $40,000 in revenue",
                  achieved: false,
                },
                {
                  teamName: "AF Development Team",
                  goal: "Have more than 50 clients",
                  achieved: true,
                },
              ]}
            >
              {(item) => {
                return (
                  <div class="flex items-start justify-center w-full">
                    <Checkbox value={item.achieved} class="mr-2" />
                    <div class="flex flex-col flex-1">
                      <span class="font-semibold text-gray-500">
                        {item.goal}
                      </span>
                      <span class="text-sm font-semibold text-gray-400">
                        {item.teamName}
                      </span>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
        <TeamsPageModals
          createTeamModalOpened={createTeamModalOpened()}
          editTeamModalOpened={editTeamModalOpened()}
          selectedTeam={selectedTeam()}
          setCreateTeamModalOpened={setCreateTeamModalOpened}
          setEditTeamModalOpened={setEditTeamModalOpened}
        />
      </Suspense>
    </AuthenticatedLayout>
  );
};

export { TeamsPage };
