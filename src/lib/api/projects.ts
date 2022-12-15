import { Schemas } from ".";
import { createAPIFunction, PaginationData } from "./connection";

interface Project {
  projectId: string;
  projectName: string;
  description: string;
  skills: Array<{ skillId: string; skill: string }>;
  budget: string;
  projectLogoName: string;
  projectLogoLocation: string;
  projectLogoMimeType: string;
  applicantCount: number;
}

const exploreProjects = createAPIFunction<
  void,
  { data: Project[]; paginationData: PaginationData },
  { search?: string; page?: string; limit?: string }
>("GET", "/api/projects/explore");
const myProjects = createAPIFunction<
  void,
  { data: Project[]; paginationData: PaginationData },
  {
    createdBy?: "ME" | "ELSE";
    status?: "CREATED" | "LISTED" | "ON_GOING" | "COMPLETED";
  }
>("GET", "/api/projects/my-projects");
const applyForProject = createAPIFunction<Schemas["ApplyProjectDto"], void>(
  "PUT",
  "/api/projects/apply"
);
const createProject = createAPIFunction<
  Omit<Schemas["AddProjectDto"], "files"> & {
    files: Array<{
      fileLocation: string;
      fileMimeType: string;
      fileName: string;
    }>;
  }
>("POST", "/api/projects");

const projectsAPI = {
  exploreProjects,
  myProjects,
  applyForProject,
  createProject,
};

export { projectsAPI };
export type { Project };
