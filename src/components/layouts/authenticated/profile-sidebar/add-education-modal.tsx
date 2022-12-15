import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { FileInput } from "#components/primitives/file-input";
import { Input } from "#components/primitives/input";
import { Overlay } from "#components/primitives/overlay";
import {
  Component,
  createEffect,
  on,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface AddEducationModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetch(): void;
}
interface AddEducationModalData {
  degree: string;
  school: string;
  year: string;
  file: File | null;
}

const getEmptyAddEducationModalData = (): AddEducationModalData => ({
  degree: "",
  school: "",
  year: "",
  file: null,
});
const AddEducationModal: Component<AddEducationModalProps> = (props) => {
  const authenticatedAPI = useAuthenticatedAPI();
  const [data, setData] = createStore<AddEducationModalData>(
    getEmptyAddEducationModalData()
  );
  const filled = createMemo(() => {
    return data.degree && data.school && data.year && data.file;
  });
  const addEducation = async () => {
    if (!filled()) {
      return;
    }
    const { fileLocation, fileName, fileMimeType } =
      await authenticatedAPI.uploadFile(data.file!, "education");
    await authenticatedAPI.education.addEducationHistory({
      degree: data.degree,
      school: data.school,
      year: data.year,
      fileMimeType,
      fileName,
      fileLocation,
    });
    props.setOpened(false);
    props.refetch();
  };

  createEffect(
    on([() => props.opened], () => {
      setData(getEmptyAddEducationModalData());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Add Education</h1>
      <span>
        Provide any formal education history to build your reputation.
      </span>
      <FileInput
        note="Only jpeg, png and pdf files are allowed"
        onFileSelected={(file) => setData("file", file)}
        label="Education Degree Upload"
      />
      <Input
        value={data.degree}
        setValue={(degree) => setData("degree", degree)}
        label="Degree"
        class="w-full"
      />
      <Input
        value={data.school}
        setValue={(school) => setData("school", school)}
        label="School"
        class="w-full"
      />
      <Input
        value={data.year}
        setValue={(year) => setData("year", year)}
        label="Year"
        class="w-full"
      />
      <Button
        color="primary"
        onClick={() => addEducation()}
        disabled={!filled()}
      >
        Add Education
      </Button>
    </Modal>
  );
};

export { AddEducationModal };
