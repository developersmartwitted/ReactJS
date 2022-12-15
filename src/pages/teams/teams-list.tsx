import { useAuthenticatedAPI } from "#components/layouts/authenticated";
import { Button, IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Tooltip } from "#components/primitives/tooltip";
import { Team } from "#lib/api/index";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import { Component, createEffect, createSignal, For, on, Show } from "solid-js";

interface TeamsListProps {
  createTeamModalOpened: boolean;
  editTeamModalOpened: boolean;
  onClick?: (team: Team) => void;
}

const TeamsList: Component<TeamsListProps> = (props) => {
  const [teams, setTeams] = createSignal<Team[]>([]);
  const authenticatedAPI = useAuthenticatedAPI();
  const headers = ["Team", "Skills", "Members", "Actions"];
  const fetchTeams = () => {
    authenticatedAPI.teams.getTeams({}, null).then((fetchedTeams) => {
      if (fetchedTeams.data) {
        setTeams(fetchedTeams.data.data);
      }
    });
  };
  const removeTeam = async (team: Team) => {
    await authenticatedAPI.teams.removeTeam({ teamId: team.teamId });
    fetchTeams();
  };

  createEffect(
    on(
      [() => props.createTeamModalOpened, () => props.editTeamModalOpened],
      () => {
        fetchTeams();
      }
    )
  );

  return (
    <Card class="flex-1 p-4 md:p-6">
      <div class="relative flex flex-col h-full overflow-x-auto">
        <table class="w-full">
          <thead class="text-gray-400">
            <tr>
              <For each={headers}>
                {(header) => {
                  return (
                    <th scope="col" class="px-6 py-3 font-semibold text-start">
                      {header}
                    </th>
                  );
                }}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={teams()}>
              {(team) => {
                return (
                  <tr
                    class="hover:bg-gray-50"
                    // onClick={() => props.onClick?.(team)}
                  >
                    <th scope="row" class="px-6 py-4 text-start">
                      <span class="text-left whitespace-nowrap">
                        {team.teamName}
                      </span>
                    </th>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap items-center justify-start w-full ">
                        <For each={team.skills.slice(0, 2)}>
                          {({ skill }) => {
                            return (
                              <Button
                                text="soft"
                                badge
                                class="whitespace-nowrap"
                              >
                                {skill}
                              </Button>
                            );
                          }}
                        </For>
                        <Show when={team.skills.length > 2}>
                          <Button color="primary" badge class="font-semibold">
                            +{team.skills.length - 2} More
                          </Button>
                        </Show>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4"
                      style={{
                        "min-width": `${
                          Math.min(team.teamMembers.length, 5) * 2
                        }rem`,
                      }}
                    >
                      <div class="relative flex items-center justify-start w-full">
                        <For each={team.teamMembers.slice(0, 4)}>
                          {(member, index) => {
                            return (
                              <Tooltip
                                text={`${member.firstName} ${member.lastName}`}
                                wrapperClass="absolute w-8 h-8"
                                wrapperStyle={{
                                  left: `${0 + index() * 1.25}rem`,
                                }}
                              >
                                <img
                                  src={`https://avatars.dicebear.com/api/initials/${member.firstName[0]}${member.lastName[0]}.svg`}
                                  class="transition-all rounded-xl hover:z-10 hover:shadow-lg"
                                />
                              </Tooltip>
                            );
                          }}
                        </For>
                        <Show when={team.teamMembers.length > 4}>
                          <div
                            class="absolute flex items-center justify-center w-8 h-8 font-semibold text-white rounded-xl bg-gradient-to-tr"
                            style={{ left: `${4 * 1.25}rem` }}
                          >
                            +{team.teamMembers.length - 4}
                          </div>
                        </Show>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex">
                      <IconButton
                        class="m-0 mr-2"
                        icon={mdiFileEdit}
                        text="soft"
                        onClick={() => props.onClick?.(team)}
                      />
 <IconButton
                        class="m-0"
                        icon={mdiTrashCan}
                        text="soft"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTeam(team);
                        }}
                      />
                      </div>
                    
                   
                    </td>
                   
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
        <div class="flex-1" />
        {/*<div class="flex items-center justify-center">
          <Select
            value={perPage()}
            setValue={setPerPage}
            options={[
              { label: "10", value: "10" },
              { label: "25", value: "25" },
              { label: "50", value: "50" },
            ]}
          />
          <span class="ml-2 text-gray-400">Per Page</span>
          <div class="flex-1" />
          <IconButton icon={mdiChevronLeft} text="soft" />
          <For each={[1, 2, 3]}>
            {(page, index) => {
              return (
                <Button
                  class="w-8 h-8 p-1 m-0 font-semibold"
                  text="soft"
                  color={index() === 2 ? "primary" : "base"}
                  variant="text"
                >
                  {page}
                </Button>
              );
            }}
          </For>
          <IconButton icon={mdiChevronRight} text="soft" />
          </div>*/}
      </div>
    </Card>
  );
};

export { TeamsList };
