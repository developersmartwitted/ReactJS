import { createAPIFunction, Schemas } from "./connection";

type Profile = Schemas["UserListDto"] & { createdAt: string };

const verifySkill = createAPIFunction<
  Omit<Schemas["SkillInviteDto"], "members"> & {
    members: Array<{
      name: string;
      email: string;
      role: string;
    }>;
  }
>("POST", "/api/user/skill/send-invite");
const updateSkills = createAPIFunction<
  Omit<Schemas["AddUserSkillDto"], "skills"> & {
    skills: Array<{ skillId: string; level: string; experience: number }>;
  }
>("POST", "/api/user/skill");
const getSkills = createAPIFunction<void, Schemas["UserSkillDto"][]>(
  "GET",
  "/api/user/skill"
);
const getProfile = createAPIFunction<void, Profile>("GET", "/api/user/profile");
const updateProfile = createAPIFunction<Schemas["UpdateProfileDto"], void>(
  "PUT",
  "/api/user/profile"
);
const changePassword = createAPIFunction<Schemas["ChangePasswordDto"]>(
  "POST",
  "/api/user/change-password"
);

const userAPI = {
  getSkills,
  verifySkill,
  updateSkills,
  getProfile,
  changePassword,
  updateProfile,
};

export { userAPI };
export type { Profile };
