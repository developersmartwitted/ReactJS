import { Project } from "#lib/API";
import { Component, Switch, Match, For } from "solid-js";
import { CreateProjectModal } from "./create-project-modal";
import { ProjectCard } from "./project-card";

interface ProjectsGridProps {
  view: "my" | "explore";
  exploreProjects: Project[];
  myProjects: Project[];
  createProjectModalOpened: boolean;
  refetchExploreProjects(): void;
  refetchMyProjects(): void;
  setCreateProjectModalOpened(opened: boolean): void;
}

const ProjectsGrid: Component<ProjectsGridProps> = (props) => {
  return (
    <>
      <div class="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Switch>
          <Match when={props.view === "explore"}>
            <For
              each={props.exploreProjects}
              fallback={
                <p class="w-full col-span-4 text-center">No projects</p>
              }
            >
              {(project) => {
                return (
                  <ProjectCard
                    project={project}
                    refetchExploreProjects={props.refetchExploreProjects}
                    refetchMyProjects={props.refetchMyProjects}
                  />
                );
              }}
            </For>
          </Match>
          <Match when={props.view === "my"}>
            <For
              each={props.myProjects}
              fallback={
                <p class="w-full col-span-4 text-center">No projects</p>
              }
            >
              {(project) => {
                return (
                  <ProjectCard
                    project={project}
                    showApplicants={true}
                    refetchExploreProjects={props.refetchExploreProjects}
                    refetchMyProjects={props.refetchMyProjects}
                  />
                );
              }}
            </For>
          </Match>
        </Switch>
      </div>
      <CreateProjectModal
        opened={props.createProjectModalOpened}
        setOpened={props.setCreateProjectModalOpened}
        refetchMyProjects={props.refetchMyProjects}
      />
    </>
  );
};

export { ProjectsGrid };
