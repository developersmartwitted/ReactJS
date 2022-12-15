import { createAPIFunction, PaginationData } from "./connection";

interface Skill {
  createdAt: string;
  id: string;
  name: string;
  status: boolean;
}
interface GetSkillsOutput {
  paginationData: PaginationData;
  data: Skill[];
}

const getSkills = createAPIFunction<
  void,
  GetSkillsOutput,
  { search: string; page: string; limit: string }
>("GET", "/api/skill");

const skillsAPI = { getSkills };

export { skillsAPI };
export type { Skill };
