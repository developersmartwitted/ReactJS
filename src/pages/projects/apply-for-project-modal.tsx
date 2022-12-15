import { Modal } from "#components/fragments/modal";
import { useAuthenticatedAPI } from "#components/layouts/authenticated";
import { Button } from "#components/primitives/button";
import { Input } from "#components/primitives/input";
import { Loader } from "#components/primitives/loader";
import { Project } from "#lib/API";
import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  on,
  For,
} from "solid-js";

interface ApplyForProjectModalProps {
  opened: boolean;
  project: Project;
  setOpened(opened: boolean): void;
  refetchExploreProjects(): void;
  refetchMyProjects(): void;
}

const ApplyForProjectModal: Component<ApplyForProjectModalProps> = (props) => {
  const image = `https://panoton-dev.s3.amazonaws.com/${props.project.projectLogoLocation}`;
  const [processing, setProcessing] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return Boolean(message());
  });
  const handleSubmit = async () => {
    setProcessing(true);
    await authenticatedAPI.projects.applyForProject({
      projectId: props.project.projectId,
      message: message(),
    });
    setProcessing(false);
    props.refetchExploreProjects();
    props.refetchMyProjects();
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], ([opened]) => {
      if (!opened) {
        setMessage("");
      }
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="flex-1 text-2xl font-bold">Apply for Project</h1>
      <span>
        Got what's need? Ready for your next big opportunity? It's the very
        first thing client sees, so make it count. Stand out by describing your
        expertise in your own words and why you'd be a great fit for this
        project.
      </span>
      <Input
        value={message()}
        setValue={setMessage}
        label="Write Message"
        class="w-full"
        textarea
      />
      <div class="flex m-1">
        <img src={image} class="h-24 border-2 border-gray-200 rounded-2xl" />
        <div class="flex flex-col ml-4">
          <h3 class="text-lg font-semibold">{props.project.projectName}</h3>
          <span>{props.project.description}</span>
          <div class="flex flex-wrap mb-4">
            <For each={props.project.skills}>
              {({ skill }) => {
                return (
                  <Button size="small" badge>
                    {skill}
                  </Button>
                );
              }}
            </For>
          </div>
        </div>
      </div>
      <Button
        disabled={!filled() || processing()}
        onClick={handleSubmit}
        color={processing() ? "base" : "primary"}
        class="flex items-center justify-center"
      >
        {processing() ? <Loader /> : "Submit"}
      </Button>
    </Modal>
  );
};

export { ApplyForProjectModal };
