import { Button, IconButton } from "#components/primitives/button";
import { API, APIFunctionOptions } from "#lib/api/index";
import {
  enforceFormat,
  formatToPhone,
  toE164Format,
  validatePhoneNumber,
} from "#lib/phone-format";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import {
  Component,
  createEffect,
  createSignal,
  Match,
  on,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthFlow } from "./auth-flow";
import {
  Section,
  validateCode,
  validateEmail,
  validateURL,
} from "./auth-utils";

interface RegisterViewProps {
  setError(error: string): void;
  goToLoginView(): void;
}

const initialData = {
  country: "United States",
  state: "",
  address: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  personalWebsite: "",
  hourlyRate: "",
  about: "",
  externalLink: "",
  phoneCode: "",
  emailCode: "",
};
const RegisterView: Component<RegisterViewProps> = (props) => {
  const [data, setData] = createStore({ ...initialData });
  const [currentSectionId, setCurrentSectionId] = createSignal("email");
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const sections: Section<keyof typeof initialData>[] = [
    {
      name: "Email",
      id: "email",
      fields: [
        {
          label: "Your Email",
          placeholder: "name@example.com",
          dataKey: "email",
        },
      ],
    },
    {
      name: "Verify email address",
      id: "email-code",
      message: "Input the code sent to provided email address.",
      fields: [
        { label: "OTP", placeholder: "6-digit OTP", dataKey: "emailCode" },
      ],
    },
    {
      name: "Basic details",
      id: "basic",
      message:
        "Password must consist one uppercase letter, one lowercase letter and one special character.",
      fields: [
        {
          label: "First Name",
          dataKey: "firstName",
          placeholder: "Enter first name",
        },
        {
          label: "Last Name",
          dataKey: "lastName",
          placeholder: "Enter last name",
        },
        {
          label: "Password",
          placeholder: "Secret password",
          dataKey: "password",
          attributes() {
            return {
              type: passwordVisible() ? "text" : "password",
              adornment() {
                return (
                  <IconButton
                    icon={passwordVisible() ? mdiEyeOff : mdiEye}
                    color="primary"
                    variant="text"
                    onClick={() => setPasswordVisible(!passwordVisible())}
                  />
                );
              },
            };
          },
        },
      ],
    },
    {
      name: "Contact details",
      id: "contact",
      fields: [
        {
          label: "Country",
          dataKey: "country",
          placeholder: "United States",
          attributes() {
            return { disabled: true };
          },
        },
        { label: "State", dataKey: "state", placeholder: "Enter state" },
        { label: "Address", dataKey: "address", placeholder: "Enter address" },
        {
          label: "Phone Number",
          dataKey: "phoneNumber",
          placeholder: "(###) ###-####",
          attributes() {
            return {
              type: "tel",
              onKeyDown: enforceFormat,
              onKeyUp(event) {
                formatToPhone(event);
                setData("phoneNumber", event.currentTarget.value);
              },
            };
          },
        },
      ],
    },
    {
      name: "Verify phone number",
      id: "phone-code",
      message: "Input the code sent to provided phone number.",
      fields: [
        { label: "OTP", placeholder: "6-digit OTP", dataKey: "phoneCode" },
      ],
    },
    {
      name: "Personal details",
      id: "personal",
      fields: [
        {
          label: "Personal Website",
          dataKey: "personalWebsite",
          placeholder: "Website",
        },
        {
          label: "Hourly Rate",
          dataKey: "hourlyRate",
          placeholder: "Rate",
          attributes() {
            return {
              adornment() {
                return (
                  <Button
                    badge
                    color="primary"
                    variant="text"
                    class="font-bold"
                  >
                    USD
                  </Button>
                );
              },
            };
          },
        },
        {
          label: "About bio",
          dataKey: "about",
          placeholder: "About you",
          attributes() {
            return { textarea: true };
          },
        },
        {
          label: "External link",
          dataKey: "externalLink",
          placeholder: "Enter link",
        },
      ],
    },
    {
      name: "Registered",
      id: "success",
      message: "You've registered successfully! Click below to go to login.",
    },
  ];
  const validatePassword = (password: string) => {
    const includesUpperCase = password !== password.toLowerCase();
    const includesLowerCase = password !== password.toUpperCase();
    const includesSpecialCharacters = /[\W_]/g.test(password);

    return includesLowerCase && includesUpperCase && includesSpecialCharacters;
  };
  const getAPIFunctionOptions = (
    nextSection: string
  ): APIFunctionOptions<any> => {
    return {
      onSuccess() {
        setCurrentSectionId(nextSection);
      },
      onError(data) {
        props.setError(data.message);
      },
    };
  };
  const sendVerificationEmail = () => {
    const emailValid = validateEmail(data.email);

    if (!emailValid) {
      return props.setError("Invalid email");
    }

    API.auth.sendEmailOTP(
      { email: data.email },
      {
        onSuccess() {
          setCurrentSectionId("email-code");
        },
        onError(data) {
          if (data.message === "OTP is already verified.") {
            setCurrentSectionId("basic");
          }
          props.setError(data.message);
        },
      }
    );
  };
  const verifyCode = (code: "email" | "phone") => {
    const codeValid = validateCode(
      code === "email" ? data.emailCode : data.phoneCode
    );

    if (!codeValid) {
      return props.setError("Invalid code");
    }

    if (code === "email") {
      return API.auth.verifyEmailOTP(
        { email: data.email, otp: Number(data.emailCode) },
        getAPIFunctionOptions("basic")
      );
    }

    return API.auth.verifyPhoneOTP(
      {
        email: data.email,
        phoneNumber: toE164Format(data.phoneNumber) || "",
        otp: Number(data.phoneCode),
      },
      getAPIFunctionOptions("personal")
    );
  };
  const verifyBasicDetails = () => {
    const passwordValid = validatePassword(data.password);

    if (!passwordValid) {
      return props.setError("Password not secure");
    }

    setCurrentSectionId("contact");
  };
  const verifyContactDetails = () => {
    const phoneValid = validatePhoneNumber(data.phoneNumber);

    if (!phoneValid) {
      return props.setError("Invalid phone number");
    }

    API.auth.sendPhoneOTP(
      { phoneNumber: toE164Format(data.phoneNumber) || "", email: data.email },
      {
        onSuccess({ data }) {
          setCurrentSectionId("phone-code");
          setData("phoneCode", `${data?.otp || ""}`);
        },
        onError(data) {
          if (data.message === "OTP is already verified.") {
            setCurrentSectionId("personal");
          }
          props.setError(data.message);
        },
      }
    );
  };
  const verifyPersonalDetails = () => {
    const personalWebsiteValid = validateURL(data.personalWebsite);
    const externalLinkValid = validateURL(data.externalLink);
    const hourlyRateValid = !Number.isNaN(Number(data.hourlyRate));

    if (!personalWebsiteValid || !externalLinkValid) {
      return props.setError("Invalid URL");
    }

    if (!hourlyRateValid) {
      return props.setError("Invalid hourly rate");
    }

    API.auth.register(
      {
        about: data.about,
        address: data.address,
        country: data.country,
        email: data.email,
        externalLink: data.externalLink,
        firstName: data.firstName,
        hourlyRate: Number(data.hourlyRate),
        invitedBy: null,
        lastName: data.lastName,
        password: data.password,
        personalWebsite: data.personalWebsite,
        phoneNumber: toE164Format(data.phoneNumber) || "",
        profileImage: `https://avatars.dicebear.com/api/initials/${data.firstName[0]}${data.lastName[0]}.svg`,
        state: data.state,
        termsAndCondition: true,
      },
      getAPIFunctionOptions("success")
    );
  };
  const handleContinue = async () => {
    switch (currentSectionId()) {
      case "email":
        return sendVerificationEmail();
      case "email-code":
        return verifyCode("email");
      case "basic":
        return verifyBasicDetails();
      case "contact":
        return verifyContactDetails();
      case "phone-code":
        return verifyCode("phone");
      case "personal":
        return verifyPersonalDetails();
      case "success":
      default:
        props.goToLoginView();
    }
  };

  createEffect(
    on([() => Object.values(data)], () => {
      props.setError("");
    })
  );

  return (
    <AuthFlow
      buttonContent={
        <Switch>
          <Match when={currentSectionId() === "personal"}>Sign up</Match>
          <Match when={currentSectionId() === "success"}>Go to login</Match>
          <Match when={true}>Continue</Match>
        </Switch>
      }
      onButtonClick={() => handleContinue()}
      heading="Sign up"
      currentSectionId={currentSectionId()}
      sections={sections}
      setData={setData}
      data={data}
    />
  );
};

export { RegisterView };
