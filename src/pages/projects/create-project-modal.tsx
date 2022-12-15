import { Modal } from "#components/fragments/modal";
import {
  useAccessToken,
  useAuthenticatedAPI,
} from "#components/layouts/authenticated";
import { Button } from "#components/primitives/button";
import { FileInput } from "#components/primitives/file-input";
import { Input } from "#components/primitives/input";
import { Loader } from "#components/primitives/loader";
import { Skill } from "#lib/API";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { SkillsInput } from "./skills-input";

interface CreateProjectModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetchMyProjects(): void;
}
interface CreateProjectModalData {
  logo: File | null;
  name: string;
  description: string;
  budget: string;
  skills: Skill[];
  docs: File | null;
}
const getEmptyCreateProjectModalData = (): CreateProjectModalData => ({
  logo: null,
  name: "",
  description: "",
  budget: "",
  skills: [],
  docs: null,
});
const CreateProjectModal: Component<CreateProjectModalProps> = (props) => {
  const [processing, setProcessing] = createSignal(false);
  const [data, setData] = createStore(getEmptyCreateProjectModalData());
  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return (
      data.budget &&
      data.description &&
      data.docs &&
      data.logo &&
      data.name &&
      data.skills.length > 0
    );
  });
  const handleSubmit = async () => {
    if (!filled()) {
      return;
    }
    setProcessing(true);
    const logoData = await authenticatedAPI.uploadFile(data.logo!, "projects");
    const docsData = await authenticatedAPI.uploadFile(data.docs!, "projects");

    await authenticatedAPI.projects.createProject({
      name: data.name,
      description: data.description,
      budget: data.budget,
      projectLogoName: logoData.fileName,
      projectLogoLocation: logoData.fileLocation,
      projectLogoMimeType: logoData.fileMimeType,
      skills: data.skills.map((skill) => skill.id),
      files: [
        {
          fileName: docsData.fileName,
          fileLocation: docsData.fileLocation,
          fileMimeType: docsData.fileMimeType,
        },
      ],
    });
    setProcessing(false);
    props.refetchMyProjects();
    props.setOpened(false);
  };

  createEffect(
    on([() => props.opened], ([opened]) => {
      if (!opened) {
        setData(getEmptyCreateProjectModalData());
      }
    })
  );
  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="flex-1 text-2xl font-bold">Create Project</h1>
      <span>
        Create and build out your new projects here. Add all the details to
        define and create your next project.
      </span>
      <FileInput
        note="Only jpeg and png files are allowed"
        label="Project Logo"
        onFileSelected={(file) => setData("logo", file)}
      />
      <Input
        value={data.name}
        setValue={(name) => setData("name", name)}
        label="Project Name"
        class="w-full"
      />
      <Input
        value={data.description}
        setValue={(description) => setData("description", description)}
        label="Project Description"
        class="w-full"
        textarea
      />
      <Input
        value={data.budget}
        setValue={(budget) => setData("budget", budget)}
        label="Project Budget"
        class="w-full"
      />
      <SkillsInput
        skills={data.skills}
        setSkills={(skills) => setData("skills", skills)}
      />
      <FileInput
        note="Only jpeg, png and pdf files are allowed"
        label="Projects Docs"
        icon="document"
        onFileSelected={(file) => setData("docs", file)}
      />
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

export { CreateProjectModal };
