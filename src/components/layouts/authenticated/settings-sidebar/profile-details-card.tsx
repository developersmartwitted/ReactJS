import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Input } from "#components/primitives/input";
import { Loader } from "#components/primitives/loader";
import { Profile } from "#lib/API";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface ProfileDetailsCardProps {
  menuOpened: boolean;
  profile?: Profile;
  refetchProfile(): void;
}
const getCleanProfileData = (profile?: Profile) => {
  return {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    address: profile?.address || "",
    state: profile?.state || "",
    country: profile?.country || "",
    externalLink: profile?.externalLinks || "",
    hourlyRate: profile?.hourlyRate || 0,
    about: profile?.about || "",
    personalWebsite: profile?.personalWebsite || "",
  };
};

const ProfileDetailsCard: Component<ProfileDetailsCardProps> = (props) => {
  const [profileData, setProfileData] = createStore(getCleanProfileData());
  const [processing, setProcessing] = createSignal(false);
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return (
      profileData.firstName &&
      profileData.lastName &&
      profileData.email &&
      profileData.phoneNumber &&
      profileData.address &&
      profileData.state &&
      profileData.country &&
      profileData.externalLink &&
      profileData.hourlyRate &&
      profileData.about &&
      profileData.personalWebsite
    );
  });
  const handleProfileDetailsUpdate = async () => {
    setProcessing(true);
    await authenticatedAPI.user.updateProfile({
      ...profileData,
      profileImage: props.profile?.profileImage || "",
      termsAndCondition: true,
    });

    props.refetchProfile();
    setProcessing(false);
  };

  createEffect(
    on([() => props.profile], () => {
      setProfileData(getCleanProfileData(props.profile));
    })
  );
  createEffect(
    on([() => props.menuOpened], () => {
      setProfileData(getCleanProfileData(props.profile));
    })
  );

  return (
    <Card class="flex flex-col gap-3 p-5">
      <h3 class="flex-1 text-lg font-semibold">User Details</h3>
      <Input
        label="First Name"
        class="w-full"
        value={profileData.firstName}
        setValue={(firstName) => setProfileData("firstName", firstName)}
      />
      <Input
        label="Last Name"
        class="w-full"
        value={profileData.lastName}
        setValue={(lastName) => setProfileData("lastName", lastName)}
      />
      <Input
        label="Email"
        type="email"
        disabled
        class="w-full"
        value={profileData.email}
        setValue={(email) => setProfileData("email", email)}
      />
      <Input
        label="Phone Number"
        disabled
        class="w-full"
        value={profileData.phoneNumber}
        setValue={(phoneNumber) => setProfileData("phoneNumber", phoneNumber)}
      />
      <Input
        label="Address"
        class="w-full"
        value={profileData.address}
        setValue={(address) => setProfileData("address", address)}
      />
      <Input
        label="State"
        class="w-full"
        value={profileData.state}
        setValue={(state) => setProfileData("state", state)}
      />
      <Input
        label="Country"
        disabled
        class="w-full"
        value={profileData.country}
        setValue={(country) => setProfileData("country", country)}
      />
      <Input
        label="External Link"
        disabled
        class="w-full"
        value={profileData.externalLink}
        setValue={(externalLink) =>
          setProfileData("externalLink", externalLink)
        }
      />
      <Input
        type="number"
        label="Hourly Rate"
        class="w-full"
        value={`${profileData.hourlyRate}`}
        setValue={(hourlyRate) =>
          setProfileData("hourlyRate", Number(hourlyRate))
        }
      />
      <Input
        label="About You"
        textarea
        class="w-full"
        value={profileData.about}
        setValue={(about) => setProfileData("about", about)}
      />
      <Input
        label="Personal Website"
        class="w-full"
        value={profileData.personalWebsite}
        setValue={(personalWebsite) =>
          setProfileData("personalWebsite", personalWebsite)
        }
      />
      <Button
        color={processing() ? "base" : "primary"}
        class="flex items-center justify-center"
        disabled={!filled() || processing()}
        onClick={handleProfileDetailsUpdate}
      >
        {processing() ? <Loader /> : "Update Profile"}
      </Button>
    </Card>
  );
};

export { ProfileDetailsCard };
