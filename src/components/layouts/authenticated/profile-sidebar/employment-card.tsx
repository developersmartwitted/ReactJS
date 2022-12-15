import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { EmploymentHistory } from "#lib/API/employment";
import { Component, createSignal } from "solid-js";
import { useAuthenticatedAPI } from "../guard";
import { VerifyEmploymentModal } from "./verify-employment-modal";

interface EmploymentCardProps {
  employmentRecord: EmploymentHistory;
}

const EmploymentCard: Component<EmploymentCardProps> = (props) => {
  const [verifyModalOpen, setVerifyModalOpen] = createSignal<boolean>(false);
  const authenticatedAPI = useAuthenticatedAPI();

  return (
    <>
      <Card class="flex flex-col gap-3 p-5">
        <div class="flex items-center justify-center">
          <div class="relative flex flex-col flex-1">
            <h3 class="flex-1 text-lg font-semibold capitalize">
              {props.employmentRecord.role}
            </h3>
          </div>
          <div class="flex flex-wrap gap-1">
            <Button color="primary" onClick={() => setVerifyModalOpen(true)}>
              Verify
            </Button>
            <Button
              color="base"
              onClick={async () => {
                await authenticatedAPI.employment.removeEmploymentHistory({
                  employmentId: props.employmentRecord.employmentId,
                });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">Organization</span>
            <span class="mx-2 font-semibold">
              {props.employmentRecord.organizationName}
            </span>
          </span>
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">From</span>
            <span class="mx-2 font-semibold">
              {props.employmentRecord.fromMonth}{" "}
              {props.employmentRecord.fromYear}
            </span>
          </span>
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">To</span>
            <span class="mx-2 font-semibold">
              {props.employmentRecord.toMonth} {props.employmentRecord.toYear}
            </span>
          </span>
        </div>
      </Card>
      <VerifyEmploymentModal
        employmentId={props.employmentRecord.employmentId}
        opened={verifyModalOpen()}
        setOpened={setVerifyModalOpen}
      />
    </>
  );
};

export { EmploymentCard };
