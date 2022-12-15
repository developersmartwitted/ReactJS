import { Modal } from "#components/fragments/modal";
import { Button } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Input } from "#components/primitives/input";
import { Overlay } from "#components/primitives/overlay";
import { API } from "#lib/api/index";
import {
  Component,
  createSignal,
  createEffect,
  on,
  createMemo,
  from,
} from "solid-js";
import { useAccessToken, useAuthenticatedAPI } from "../guard";

interface AddEmploymentModalProps {
  opened: boolean;
  setOpened(opened: boolean): void;
  refetch(): void;
}

const AddEmploymentModal: Component<AddEmploymentModalProps> = (props) => {
  const [role, setRole] = createSignal("");
  const [org, setOrg] = createSignal("");
  const [fromDate, setFromDate] = createSignal<Date>(new Date());
  const [toDate, setToDate] = createSignal<Date>(new Date());
  const [description, setDescription] = createSignal("");
  const [currentlyWorkHere, setCurrentlyWorkHere] =
    createSignal<boolean>(false);

  const getMonthName = new Intl.DateTimeFormat("en-US", { month: "long" })
    .format;

  const authenticatedAPI = useAuthenticatedAPI();
  const filled = createMemo(() => {
    return role() && fromDate() && toDate() && description() && org();
  });
  const getDateValue = (date: Date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);

    return date.getFullYear() + "-" + month + "-" + day;
  };
  const addEmployment = async () => {
    await authenticatedAPI.employment.addEmploymentHistory({
      role: role(),
      toYear: String(toDate().getFullYear()),
      toMonth: getMonthName(toDate()),
      fromYear: String(fromDate().getFullYear()),
      fromMonth: getMonthName(fromDate()),
      description: description(),
      organizationName: org(),
      currentlyWorking: currentlyWorkHere(),
      companyLogoName: "hero.png",
      companyLogoLocation: "teams/e50105ca9feb9d5f8a317347f0f8f873.png",
    });
    props.setOpened(false);
    props.refetch();
  };

  createEffect(
    on([() => props.opened], () => {
      setRole("");
      setOrg("");
      setDescription("");
      setToDate(new Date());
      setFromDate(new Date());
    })
  );

  return (
    <Modal opened={props.opened} setOpened={props.setOpened}>
      <h1 class="w-full text-2xl font-bold">Add Employment</h1>
      <p>
        Add your employment history to showcase past experience and reaffirm
        your skill set
      </p>
      <Input value={role()} setValue={setRole} label="Role" class="w-full" />
      <Input
        value={getDateValue(fromDate())}
        setValue={(date) => setFromDate(new Date(date))}
        label="From"
        type="date"
        class="w-full"
      />
      <Input
        value={getDateValue(toDate())}
        setValue={(date) => setToDate(new Date(date))}
        label="To"
        type="date"
        disabled={currentlyWorkHere()}
        class="w-full"
      />
      <Input
        value={org()}
        setValue={setOrg}
        label="Organization Name"
        class="w-full"
      />
      <Input
        value={description()}
        setValue={setDescription}
        label="Description"
        class="w-full"
        textarea
      />
      <Button
        color="primary"
        onClick={() => addEmployment()}
        disabled={!filled()}
      >
        Add Employment
      </Button>
    </Modal>
  );
};

export { AddEmploymentModal };
