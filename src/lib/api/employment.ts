import { createAPIFunction, Schemas } from "./connection";

type EmploymentHistory = Schemas["EmploymentDto"] & {
  employmentId: string;
};

const getEmploymentHistory = createAPIFunction<void, EmploymentHistory[]>(
  "GET",
  "/api/employment"
);
const verifyEmploymentHistory = createAPIFunction<
  Schemas["SendEmploymentInvite"]
>("POST", "/api/employment/send-invite");
const addEmploymentHistory = createAPIFunction<Schemas["AddEmploymentDto"]>(
  "POST",
  "/api/employment"
);
const removeEmploymentHistory = createAPIFunction<
  Schemas["DeleteEmploymentDto"]
>("DELETE", "/api/employment");

const employmentAPI = {
  getEmploymentHistory,
  verifyEmploymentHistory,
  addEmploymentHistory,
  removeEmploymentHistory,
};

export { employmentAPI };
export type { EmploymentHistory };
