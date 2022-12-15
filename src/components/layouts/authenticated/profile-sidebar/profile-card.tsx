import { IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Profile } from "#lib/API";
import { mdiStarOutline } from "@mdi/js";
import { format } from "date-fns";
import { Component, For } from "solid-js";

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: Component<ProfileCardProps> = (props) => {
  debugger
  const items = () => [
    {
      label: "Hourly Rate",
      value: `$${props.profile.hourlyRate}/HR`,
    },
    {
      label: "Location",
      value: `${props.profile.country}`,
    },
    {
      label: "Started On",
      value: format(new Date(props.profile.createdAt), "MMM dd, yyyy"),
    },
  ];

  return (
    <Card
      color="primary"
      class="p-4 bg-gradient-to-tr from-[#56D2FB] to-[#8062FB]"
    >
      <div class="flex items-center gap-5">
        <img
          src={props.profile.profileImage}
          class="w-20 shadow-xl rounded-3xl"
        />
        <div class="flex flex-col items-start flex-1">
          <h2 class="text-2xl font-semibold text-center">
            {props.profile.firstName} {props.profile.lastName}
          </h2>
          <span class="opacity-70">{props.profile.about}</span>
        </div>
        <IconButton
          icon={mdiStarOutline}
          label={<span class="ml-1">{props.profile.reputationScore}</span>}
        />
      </div>
      <div class="flex items-start mx-2 mt-4">
        <For each={items()}>
          {({ label, value }) => (
            <span class="flex flex-col items-center justify-center flex-1">
              <span class="text-xs uppercase opacity-70">{label}</span>
              <span class="font-semibold">{value}</span>
            </span>
          )}
        </For>
      </div>
    </Card>
  );
};

export { ProfileCard };
