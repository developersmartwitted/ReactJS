import { IconButton } from "#components/primitives/button";
import { mdiCircle, mdiCircleMedium, mdiCircleSmall } from "@mdi/js";
import { Component, For } from "solid-js";

interface Project {
  name: string;
  hours: number;
  budget: number;
  category: string;
}

interface ProjectsListProps {
  projects: Project[];
}

const formatter = new Intl.NumberFormat("en", {
  currency: "USD",
  style: "currency",
  notation: "compact",
  minimumFractionDigits: 2,
});
const ProjectsList: Component<ProjectsListProps> = (props) => {
  return (
    <div class="flex flex-col">
      <For each={props.projects}>
        {(project) => {
          return (
            <div class="flex flex-col sm:flex-row items-center justify-center py-4 mb-4">
              <div class="hidden w-16 h-16 mr-4 lg:block rounded-3xl tic-tac-toe-gradient" />
              <div>
                <h3 class="font-semibold text-[16px]">{project.name}</h3>
                <span class="text-[14px] text-[#7a86a1]">
                  Planned: {project.hours}h
                </span>
              </div>
              <div class="flex items-center justify-start ml-auto mr-6 sm:min-w-[140px]">
                <IconButton
                  color="primary"
                  icon={mdiCircleMedium}
                  label={project.category}
                  badge
                  class="hidden lg:flex text-base !text-[#6149cd] bg-none !bg-[#f6efff] fill-[#6149cd] px-[12px] py-[6px] rounded-2xl font-medium"
                />
              </div>
              <div>
                <span class="text-[15px] font-semibold text-[#7a86a1]">
                  {formatter.format(project.budget)}
                </span>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export { ProjectsList };
