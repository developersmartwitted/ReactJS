import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Loader } from "#components/primitives/loader";
import { EducationHistory } from "#lib/API/education";
import { Component, createSignal, Show } from "solid-js";
import { useAuthenticatedAPI } from "../guard";

interface EducationCardProps {
  educationRecord: EducationHistory;
  refetchEducationHistory(): void;
}

const EducationCard: Component<EducationCardProps> = (props) => {
  const [processing, setProcessing] = createSignal(false);
  const authenticatedAPI = useAuthenticatedAPI();
  const handleRemoveEducationHistory = async () => {
    setProcessing(true);
    await authenticatedAPI.education.removeEducationHistory({
      educationId: props.educationRecord.id,
    });
    setProcessing(false);
    props.refetchEducationHistory();
  };

  return (
    <Card class="relative flex flex-col gap-3 p-5">
      <div class="flex items-center justify-center">
        <div class="relative flex flex-col flex-1">
          <h3 class="flex-1 text-lg font-semibold capitalize">
            {props.educationRecord.degree} Degree
          </h3>
        </div>
        <Button onClick={handleRemoveEducationHistory} class="m-0">
          Remove
        </Button>
      </div>
      <div class="flex flex-col">
        <span class="flex items-center justify-start flex-1">
          <span class="text-xs uppercase opacity-70">Year</span>
          <span class="mx-2 font-semibold">{props.educationRecord.year}</span>
        </span>
        <span class="flex items-center justify-start flex-1">
          <span class="text-xs uppercase opacity-70">School</span>
          <span class="mx-2 font-semibold">{props.educationRecord.school}</span>
        </span>
      </div>
      <Show when={processing()}>
        <div class="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 rounded-2xl">
          <Loader />
        </div>
      </Show>
    </Card>
  );
};

export { EducationCard };
