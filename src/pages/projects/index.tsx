import { Button, IconButton } from "#components/primitives/button";
import { mdiFilter, mdiMagnify, mdiPlusCircle } from "@mdi/js";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  on,
  Show,
  Suspense,
} from "solid-js";
import "#styles/backgrounds.css";
import { useAuthenticatedAPI } from "#components/layouts/authenticated";
import { Input } from "#components/primitives/input";
import { Menu } from "#components/primitives/menu";
import { Loader } from "#components/primitives/loader";
import { ProjectsGrid } from "./projects-grid";
import { Select } from "#components/primitives/select";

const ProjectsPage: Component = () => {
  const [view, setView] = createSignal<"explore" | "my">("explore");
  const [createProjectModalOpened, setCreateProjectModalOpened] =
    createSignal(false);
  const [search, setSearch] = createSignal("");
  const [createdBy, setCreatedBy] = createSignal<"ME" | "ELSE">("ME");
  const [status, setStatus] = createSignal<
    "CREATED" | "LISTED" | "ON_GOING" | "COMPLETED"
  >("CREATED");
  const authenticatedAPI = useAuthenticatedAPI();
  const [exploreProjects, { refetch: refetchExploreProjects }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.projects.exploreProjects(
        { query: search() ? { search: search() } : {} },
        null
      );

      return data?.data || [];
    }
  );
  const [myProjects, { refetch: refetchMyProjects }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.projects.myProjects(
        {
          query: { createdBy: createdBy(), status: status() },
        },
        null
      );

      return data?.data || [];
    }
  );

  createEffect(
    on([view], () => {
      setSearch("");
      setCreatedBy("ME");
      setStatus("CREATED");
    })
  );

  const [menu, setMenu] = createSignal(false);
  return (
    <div class="flex-1 overflow-auto">
      <div class="flex flex-col items-center justify-center px-8 pt-4 md:flex-row">
        <div class="flex-1 w-full pb-4 text-center md:text-left md:pb-0">
          <h1 class="w-full text-4xl font-extrabold">Projects</h1>
          <span class="w-full text-gray-400">Hello, welcome back.</span>
        </div>
        <Input
          wrapperClass="w-full md:w-56"
          class="flex-row-reverse w-full bg-gray-200"
          placeholder="Search Projects"
          disabled={view() === "my"}
          adornment={
            <IconButton
              class="rounded-xl"
              icon={mdiMagnify}
              text="soft"
              variant="text"
              onClick={() => refetchExploreProjects()}
            />
          }
          value={search()}
          setValue={setSearch}
          adornmentWrapperClass="right-0.5"
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              refetchExploreProjects();
            }
          }}
        />
      </div>
      <div class="flex flex-col flex-1 h-[calc(100%-5rem)] p-4 md:p-8">
        <div class="flex items-center justify-center pb-4">
          <IconButton
            class="m-0 shadow-md"
            icon={mdiPlusCircle}
            color="primary"
            onClick={() => setCreateProjectModalOpened(true)}
            label={<span class="pl-2 pr-1">Create Project</span>}
          />
          <Show when={view() === "my"}>
            <Menu
              anchor={
                <IconButton
                  onClick={() => setMenu(!menu())}
                  icon={mdiFilter}
                  label={<span class="pl-2 pr-1">Filter</span>}
                />
              }
              onOutsideClick={() => {
                setMenu(false);
              }}
              opened={menu()}
            >
              <div class="flex flex-col gap-2">
                <div class="flex flex-col">
                  <span class="mr-2 font-semibold">Created By</span>
                  <Select
                    value={createdBy()}
                    setValue={setCreatedBy}
                    class="w-full"
                    options={[
                      { label: "Others", value: "ELSE" },
                      { label: "Me", value: "ME" },
                    ]}
                  />
                </div>
                <div class="flex flex-col">
                  <span class="mr-2 font-semibold">Status</span>
                  <Select
                    value={status()}
                    setValue={setStatus}
                    class="w-full"
                    options={[
                      { label: "Listed", value: "LISTED" },
                      { label: "Created", value: "CREATED" },
                      { label: "On Going", value: "ON_GOING" },
                      { label: "Completed", value: "COMPLETED" },
                    ]}
                  />
                </div>
                <Button
                  color="primary"
                  onClick={() => {
                    setMenu(false);
                    refetchMyProjects();
                  }}
                >
                  Apply
                </Button>
              </div>
            </Menu>
          </Show>
          <div class="flex-1" />
          <Button
            color={view() === "explore" ? "primary" : "base"}
            text={view() === "explore" ? "primary" : "base"}
            onClick={() => setView("explore")}
          >
            Explore Projects
          </Button>
          <Button
            color={view() === "my" ? "primary" : "base"}
            text={view() === "my" ? "primary" : "base"}
            onClick={() => setView("my")}
          >
            My Projects
          </Button>
        </div>
        <Suspense
          fallback={
            <div class="flex items-center justify-center w-full">
              <Loader />
            </div>
          }
        >
          <ProjectsGrid
            view={view()}
            exploreProjects={exploreProjects()!}
            refetchExploreProjects={refetchExploreProjects}
            refetchMyProjects={refetchMyProjects}
            myProjects={myProjects()!}
            createProjectModalOpened={createProjectModalOpened()}
            setCreateProjectModalOpened={setCreateProjectModalOpened}
          />
        </Suspense>
      </div>
    </div>
  );
};

export { ProjectsPage };
