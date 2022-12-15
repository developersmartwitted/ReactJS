import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { ClientProjectRecord } from "#lib/API";
import { Component, createSignal } from "solid-js";
import { useAuthenticatedAPI } from "../guard";
import { VerifyClientProjectModal } from "./verify-client-project";

interface ClientProjectCardProps {
  clientProjectRecord: ClientProjectRecord;
}

const ClientProjectCard: Component<ClientProjectCardProps> = (props) => {
  const [verifyModalOpen, setVerifyModalOpen] = createSignal(false);
  const authenticatedAPI = useAuthenticatedAPI();

  return (
    <>
      <Card class="flex flex-col gap-3 p-5">
        <div class="flex items-center justify-center">
          <div class="relative flex flex-col flex-1">
            <h3 class="flex-1 text-lg font-semibold capitalize">
              {props.clientProjectRecord.name}
            </h3>
          </div>
          <div class="flex flex-wrap gap-1">
            <Button color="primary" onClick={() => setVerifyModalOpen(true)}>
              Verify
            </Button>
            <Button
              color="base"
              onClick={async () => {
                await authenticatedAPI.clientProjects.removeClientProject({
                  clientProjectId: props.clientProjectRecord.clientProjectId,
                });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">Description</span>
            <span class="mx-2 font-semibold">
              {props.clientProjectRecord.description}
            </span>
          </span>
          <span class="flex items-center justify-start flex-1">
            <span class="text-xs uppercase opacity-70">URL</span>
            <span class="mx-2 font-semibold">
              {props.clientProjectRecord.url}
            </span>
          </span>
        </div>
      </Card>
      <VerifyClientProjectModal
        id={props.clientProjectRecord.clientProjectId}
        opened={verifyModalOpen()}
        setOpened={setVerifyModalOpen}
      />
    </>
  );
};

export { ClientProjectCard };
