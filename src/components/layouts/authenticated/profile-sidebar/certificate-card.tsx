import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { CertificationRecord } from "#lib/API/certification";
import { Component } from "solid-js";
import { useAuthenticatedAPI } from "../guard";

interface CertificateCardProps {
  certificateRecord: CertificationRecord;
}

const CertificateCard: Component<CertificateCardProps> = (props) => {
  const authenticatedAPI = useAuthenticatedAPI();

  return (
    <Card class="flex flex-col gap-3 p-5">
      <div class="flex items-center justify-center">
        <div class="relative flex flex-col flex-1">
          <h3 class="flex-1 text-lg font-semibold capitalize">
            {props.certificateRecord.certificate} Certificate
          </h3>
        </div>
        <Button
          onClick={async () => {
            await authenticatedAPI.certification.removeCertificate({
              certificateId: props.certificateRecord.id,
            });
          }}
          class="m-0"
        >
          Delete
        </Button>
      </div>
      <div class="flex flex-col">
        <span class="flex items-center justify-start flex-1">
          <span class="text-xs uppercase opacity-70">Institution</span>
          <span class="mx-2 font-semibold">
            {props.certificateRecord.institution}
          </span>
        </span>
        <span class="flex items-center justify-start flex-1">
          <span class="text-xs uppercase opacity-70">Year</span>
          <span class="mx-2 font-semibold">{props.certificateRecord.year}</span>
        </span>
      </div>
    </Card>
  );
};

export { CertificateCard };
