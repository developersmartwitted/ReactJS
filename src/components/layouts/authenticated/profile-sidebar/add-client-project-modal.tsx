import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { FileInput } from "#components/primitives/file-input";
import { Input } from "#components/primitives/input";
import {
  Component,
  createSignal,
  createEffect,
  on,
  createMemo,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface AddClientProjectModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetch(): void;
}
interface AddClientProjectModalData {
  name: string;
  url: string;
  description: string;
  logo: File | null;
  supportingDocs: File | null;
}

const getEmptyAddClientProjectModalData = (): AddClientProjectModalData => ({
  name: "",
  url: "",
  description: "",
  logo: null,
  supportingDocs: null,
});
const AddClientProjectModal: Component<AddClientProjectModalProps> = (
  props
) => {
  const [data, setData] = createStore<AddClientProjectModalData>(
    getEmptyAddClientProjectModalData()
  );
  const filled = createMemo(() => {
    return (
      data.name &&
      data.url &&
      data.description &&
      data.logo &&
      data.supportingDocs
    );
  });
  const authenticatedAPI = useAuthenticatedAPI();
  const addClientProject = async () => {
    if (!filled()) {
      return;
    }
    const logoData = await authenticatedAPI.uploadFile(
      data.logo!,
      "clientProjects"
    );
    const supportingDocsData = await authenticatedAPI.uploadFile(
      data.supportingDocs!,
      "clientProjects"
    );
    await authenticatedAPI.clientProjects.addClientProject({
      name: data.name,
      url: data.url,
      description: data.description,
      logoName: logoData.fileName,
      logoLocation: logoData.fileLocation,
      logoMimeType: logoData.fileMimeType,
      supportingDocs: [
        {
          fileName: supportingDocsData.fileName,
          fileLocation: supportingDocsData.fileLocation,
          fileMimeType: supportingDocsData.fileMimeType,
        },
      ],
    });
    props.setOpened(false);
    props.refetch();
  };

  createEffect(
    on([() => props.opened], () => {
      setData(getEmptyAddClientProjectModalData());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Add Client Project</h1>
      <p>
        Document your past client projects to build out your personal resume and
        reputation.
      </p>
      <FileInput
        note="Only jpeg, png and pdf files are allowed"
        onFileSelected={(file) => setData("logo", file)}
        label="Logo of the Project"
      />
      <Input
        value={data.name}
        setValue={(name) => setData("name", name)}
        label="Name"
        class="w-full"
      />
      <Input
        value={data.url}
        setValue={(url) => setData("url", url)}
        label="Url"
        class="w-full"
      />
      <Input
        value={data.description}
        setValue={(description) => setData("description", description)}
        label="Description"
        class="w-full"
        textarea
      />
      <FileInput
        note="Only jpeg and png files are allowed"
        onFileSelected={(file) => setData("supportingDocs", file)}
        label="Supporting Docs"
        icon="document"
      />

      <Button
        color="primary"
        onClick={() => addClientProject()}
        disabled={!filled()}
      >
        Add Client Project
      </Button>
    </Modal>
  );
};

export { AddClientProjectModal };
