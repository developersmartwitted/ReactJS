import { createAPIFunction, Schemas } from "./connection";

type CertificationRecord = Schemas["CertificationDto"] & { id: string };

const getCertificates = createAPIFunction<void, CertificationRecord[]>(
  "GET",
  "/api/certificate"
);

const addCertificate = createAPIFunction<Schemas["AddCertificateDto"]>(
  "POST",
  "/api/certificate"
);

const removeCertificate = createAPIFunction<Schemas["DeleteCertificateDto"]>(
  "DELETE",
  "/api/certificate"
);

const certificationAPI = {
  getCertificates,
  addCertificate,
  removeCertificate,
};

export { certificationAPI };
export type { CertificationRecord };
