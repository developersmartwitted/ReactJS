import { IconButton, Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Icon } from "#components/primitives/icon";
import { Project } from "#lib/API";
import { mdiListBoxOutline, mdiTag } from "@mdi/js";
import { Component, createSignal, For, Show } from "solid-js";
import { ApplyForProjectModal } from "./apply-for-project-modal";

interface ProjectCardProps {
  project: Project;
  showApplicants?: boolean;
  refetchMyProjects(): void;
  refetchExploreProjects(): void;
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  debugger
  const image = `https://panoton-dev.s3.amazonaws.com/${props.project.projectLogoLocation}`;
  const [imageState, setImageState] = createSignal<
    "loading" | "success" | "error"
  >("loading");
  const [applyForProjectModalOpened, setApplyForProjectModalOpened] =
    createSignal(false);

  return (
    <>
      <Card class="flex flex-col p-0 overflow-hidden">
        <Show
          when={imageState() !== "error"}
          fallback={
            <div class="flex items-center justify-center w-full h-48 bg-gradient-to-tr from-[#56D2FB] to-[#8062FB]"></div>
          }
        >
          <img
            src={image}
            onLoad={() => setImageState("success")}
            onError={() => setImageState("error")}
          />
        </Show>
        <div class="relative flex flex-col flex-1 p-2">
          <IconButton
            icon={mdiTag}
            size="small"
            class="absolute -top-8"
            label={<span class="ml-1">{props.project.budget} USD</span>}
          ></IconButton>
          <h2 class="text-xl font-bold">{props.project.projectName}</h2>
          <p class="mb-2">{props.project.description}</p>
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
          <div class="flex-1" />
          <Button
            color={props.showApplicants ? "base" : "primary"}
            badge={props.showApplicants}
            class="text-center"
            onClick={() => {
              if (!props.showApplicants) {
                setApplyForProjectModalOpened(true);
              }
            }}
          >
            {props.showApplicants
              ? `Total Applicants: ${props.project.applicantCount}`
              : "Apply for Project"}
          </Button>
        </div>
      </Card>
      <ApplyForProjectModal
        project={props.project}
        opened={applyForProjectModalOpened()}
        setOpened={setApplyForProjectModalOpened}
        refetchExploreProjects={props.refetchExploreProjects}
        refetchMyProjects={props.refetchMyProjects}
      />
    </>
  );
};

export { ProjectCard };
