import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { FileInput } from "#components/primitives/file-input";
import { Input } from "#components/primitives/input";
import { Component, createEffect, on, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthenticatedAPI } from "../guard";

interface AddCertificationsModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetch(): void;
}
interface AddCertificationModalData {
  year: string;
  comments: string;
  certificate: string;
  institution: string;
  file: File | null;
}

const getEmptyAddCertificationModalData = (): AddCertificationModalData => ({
  year: "",
  certificate: "",
  comments: "",
  institution: "",
  file: null,
});
const AddCertificationModal: Component<AddCertificationsModalProps> = (
  props
) => {
  const [data, setData] = createStore<AddCertificationModalData>(
    getEmptyAddCertificationModalData()
  );
  const filled = createMemo(() => {
    return (
      data.year &&
      data.comments &&
      data.certificate &&
      data.institution &&
      data.file
    );
  });
  const authenticatedAPI = useAuthenticatedAPI();

  const addCertification = async () => {
    if (!filled()) {
      return;
    }

    const { fileLocation, fileName, fileMimeType } =
      await authenticatedAPI.uploadFile(data.file!, "certificates");
    await authenticatedAPI.certification.addCertificate({
      year: data.year,
      comments: data.comments,
      certificate: data.certificate,
      institution: data.institution,
      fileName,
      fileLocation,
      fileMimeType,
    });
    props.setOpened(false);
    props.refetch();
  };

  createEffect(
    on([() => props.opened], () => {
      setData(getEmptyAddCertificationModalData());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Add Certificate</h1>
      <span>
        Provide any formal certificates to build your reputation and showcase
        your knowledge.
      </span>
      <FileInput
        note="Only jpeg, png and pdf files are allowed"
        onFileSelected={(file) => setData("file", file)}
        label="Certificate Upload"
      />
      <Input
        value={data.year}
        setValue={(year) => setData("year", year)}
        label="Year"
        class="w-full"
      />
      <Input
        value={data.certificate}
        setValue={(certificate) => setData("certificate", certificate)}
        label="Certificate Name"
        class="w-full"
      />
      <Input
        value={data.institution}
        setValue={(institution) => setData("institution", institution)}
        label="Institution"
        class="w-full"
      />
      <Input
        value={data.comments}
        setValue={(comments) => setData("comments", comments)}
        label="Comments"
        class="w-full"
        textarea
      />

      <Button
        color="primary"
        onClick={() => addCertification()}
        disabled={!filled()}
      >
        Add Certificate
      </Button>
    </Modal>
  );
};

export { AddCertificationModal };
