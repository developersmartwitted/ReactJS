import { ComponentProps, JSX } from "solid-js";
import { Input } from "#components/primitives/input";

interface InputField<DK extends string = string> {
  dataKey: DK;
  label: string;
  placeholder?: string;
  attributes?(): Partial<ComponentProps<typeof Input>>;
}
interface Section<DK extends string = string> {
  id: string;
  name?: JSX.Element;
  message?: JSX.Element;
  fields?: Array<InputField<DK>>;
  component?: JSX.Element;
}

const validateCode = (code: string) => {
  return !Number.isNaN(Number(code)) && code.length === 6;
};
const validateEmail = (email: string): boolean => {
  /* prettier-ignore */
  // eslint-disable-next-line no-control-regex
  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return emailRegex.test(email);
};
const validateURL = (inputURL: string) => {
  try {
    const url = new URL(inputURL);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export { validateCode, validateEmail, validateURL };
export type { InputField, Section };
