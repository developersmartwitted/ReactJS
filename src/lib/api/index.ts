import { authAPI } from "./auth";
import { CertificationRecord, certificationAPI } from "./certification";
import {
  AddClientProjectRecord,
  ClientProjectRecord,
  clientProjectsAPI,
} from "./client-projects";
import { APIFunctionOptions } from "./connection";
import { EducationHistory, educationAPI } from "./education";
import { EmploymentHistory, employmentAPI } from "./employment";
import { notificationsAPI } from "./notifications";
import { components } from "./schema";
import { Skill, skillsAPI } from "./skills";
import { Team, teamsAPI } from "./teams";
import { Profile, userAPI } from "./user";
import { uploadFile } from "./file";
import { Project, projectsAPI } from "./projects";
import{Community,communityAPI} from "./community"

type Schemas = components["schemas"];

const API = {
  auth: authAPI,
  user: userAPI,
  notifications: notificationsAPI,
  education: educationAPI,
  employment: employmentAPI,
  clientProjects: clientProjectsAPI,
  certification: certificationAPI,
  skills: skillsAPI,
  teams: teamsAPI,
  projects: projectsAPI,
  community:communityAPI,
  uploadFile,
};

export { API };
export type {
  Skill,
  Team,
  Profile,
  Community,
  Project,
  APIFunctionOptions,
  AddClientProjectRecord,
  CertificationRecord,
  ClientProjectRecord,
  EducationHistory,
  EmploymentHistory,
  Schemas,
};
