import { createAPIFunction, Schemas } from "./connection";

type ClientProjectRecord = Schemas["ClientProjectDto"] & {
  clientProjectId: string;
};
type AddClientProjectRecord = Omit<
  Schemas["AddClientProjectDto"],
  "supportingDocs"
> & {
  supportingDocs: [
    { fileName: string; fileLocation: string; fileMimeType: string }
  ];
};

const getClientProjects = createAPIFunction<void, ClientProjectRecord[]>(
  "GET",
  "/api/client-project"
);
const addClientProject = createAPIFunction<AddClientProjectRecord>(
  "POST",
  "/api/client-project"
);
const verifyClientProject = createAPIFunction<
  Schemas["SendClientProjectInviteDto"]
>("POST", "/api/client-project/send-invite");
const removeClientProject = createAPIFunction<
  Schemas["DeleteClientProjectDto"]
>("DELETE", "/api/client-project");

const clientProjectsAPI = {
  getClientProjects,
  addClientProject,
  verifyClientProject,
  removeClientProject,
};

export { clientProjectsAPI };
export type { ClientProjectRecord, AddClientProjectRecord };
