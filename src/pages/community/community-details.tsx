import { useAuthenticatedAPI } from "#components/layouts/authenticated";
import { Button, IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Tooltip } from "#components/primitives/tooltip";
import { Community } from "#lib/api/community";
import { Team } from "#lib/api/index";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import { Component, createEffect, createSignal, For, on, Show } from "solid-js";

interface CommunityListProps {
  createTeamModalOpened: boolean;
  editTeamModalOpened: boolean;
  onClick?: (community: Community) => void;
}

const CommunityList: Component<CommunityListProps> = (props) => {
  const [community, setCommunity] = createSignal<Community[]>([]);
  const authenticatedAPI = useAuthenticatedAPI();
  const headers = ["Topics", "Replies", "Views", "Like Count", "Activity"];
  const fetchCommunity = () => {
    authenticatedAPI.community.getCommunity({}, null).then((fetchedCommunity) => {
      if (fetchedCommunity.data) {
        setCommunity(fetchedCommunity.data.data);
      }
    });
  };
//   const removeCommunity= async (community: Community) => {
//     await authenticatedAPI.community.removeCommunity({ communityId: community.communityId });
//     fetchCommunity();
//   };

  createEffect(
    on(
      [() => props.createTeamModalOpened, () => props.editTeamModalOpened],
      () => {
        fetchCommunity();
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
            <For each={community()}>
              {(community) => {
                return (
                  <tr
                    class="hover:bg-gray-50"
                    // onClick={() => props.onClick?.(team)}
                  >
                    <th scope="row" class="px-6 py-4 text-start">
                      <span class="text-left whitespace-nowrap">
                        {community.topicId}
                      </span>
                    </th>

                    <th scope="row" class="px-6 py-4 text-start">
                      <span class="text-left whitespace-nowrap">
                        {community.views}
                      </span>
                    </th>

                    <th scope="row" class="px-6 py-4 text-start">
                      <span class="text-left whitespace-nowrap">
                        {community.replyCount}
                      </span>
                    </th>

                    <th scope="row" class="px-6 py-4 text-start">
                      <span class="text-left whitespace-nowrap">
                        {community.likeCount}
                      </span>
                    </th>
                  
                    <td class="px-6 py-4">
                      <div class="flex">
                      <IconButton
                        class="m-0 mr-2"
                        icon={mdiFileEdit}
                        text="soft"
                        onClick={() => props.onClick?.(community)}
                      />
 {/* <IconButton
                        class="m-0"
                        icon={mdiTrashCan}
                        text="soft"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCommunity(community);
                        }}
                      /> */}
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

export { CommunityList };
