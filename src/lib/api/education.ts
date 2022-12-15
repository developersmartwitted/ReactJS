import { createAPIFunction, Schemas } from "./connection";

type EducationHistory = Schemas["EducationDto"] & {
  id: string;
};

const getEducationHistory = createAPIFunction<void, EducationHistory[]>(
  "GET",
  "/api/education"
);

const addEducationHistory = createAPIFunction<Schemas["AddEducationDto"]>(
  "POST",
  "/api/education"
);

const removeEducationHistory = createAPIFunction<Schemas["DeleteEducationDto"]>(
  "DELETE",
  "/api/education"
);
const educationAPI = {
  getEducationHistory,
  addEducationHistory,
  removeEducationHistory,
};

export { educationAPI };
export type { EducationHistory };
