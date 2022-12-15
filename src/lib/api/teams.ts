import { PaginationData, createAPIFunction, Schemas } from "./connection";

interface Team {
  teamId: string;
  teamName: string;
  description: string;
  profileImageName: string;
  profileImageLocation: string;
  profileImageMimeType: string;
  skills: Array<{
    skillId: string;
    skill: string;
  }>;
  type: string;
  teamMembers: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    type: string;
  }>;
}
interface CreateTeamConfig {
  name: string;
  description: string;
  profileImageName: string;
  profileImageLocation: string;
  profileImageMimeType: string;
  skills: string[];
  inviteMembers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
  }>;
  comment: string;
}

interface GetTeamsOutput {
  data: Team[];
  paginationData: PaginationData;
}

const getTeams = createAPIFunction<void, GetTeamsOutput>("GET", "/api/teams");
const createTeam = createAPIFunction<CreateTeamConfig>("POST", "/api/teams");
const updateTeam = createAPIFunction<Schemas["UpdateTeamDto"]>(
  "PUT",
  "/api/teams"
);
const removeTeam = createAPIFunction<{ teamId: string }>(
  "DELETE",
  "/api/teams"
);
const inviteMembers = createAPIFunction<
  Omit<Schemas["SendTeamInviteDto"], "inviteMembers"> & {
    inviteMembers: Array<{
      designation: string;
      email: string;
      firstName: string;
      lastName: string;
    }>;
  }
>("POST", "/api/teams/send-invite");
const removeTeamMember = createAPIFunction<Schemas["DeleteTeamMemberDto"]>(
  "DELETE",
  "/api/teams/member"
);

const teamsAPI = {
  getTeams,
  createTeam,
  updateTeam,
  removeTeam,
  inviteMembers,
  removeTeamMember,
};

export { teamsAPI };
export type { Team };
