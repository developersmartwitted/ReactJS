import {
  Component,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { components } from "#lib/api/schema";
import { Card } from "#components/primitives/card";
import { Overlay } from "#components/primitives/overlay";
import clsx from "clsx";
import { Transition } from "solid-transition-group";
import "#components/transitions/slide.css";
import { Profile } from "#lib/api";
import { useAuthenticatedAPI } from "../guard";
import { Button } from "#components/primitives/button";
import { AddSkillsModal } from "./add-skills-modal";
import { AddClientProjectModal } from "./add-client-project-modal";
import { AddEducationModal } from "./add-education-modal";
import { AddEmploymentModal } from "./add-employment-modal";
import { AddCertificationModal } from "./add-certification-modal";
import {
  mdiBriefcaseVariantOutline,
  mdiCertificateOutline,
  mdiChartBoxOutline,
  mdiListBoxOutline,
  mdiSchoolOutline,
} from "@mdi/js";
import { Loader } from "#components/primitives/loader";
import { Icon } from "#components/primitives/icon";
import { ProfileCard } from "./profile-card";
import { SkillCard } from "./skill-card";
import { EducationCard } from "./education-card";
import { CertificateCard } from "./certificate-card";
import { ClientProjectCard } from "./client-project-card";
import { EmploymentCard } from "./employment-card";

type Schemas = components["schemas"];

interface ProfileSidebarProps {
  profile?: Profile;
  opened: boolean;
  handleClose?(): void;
}

const ProfileSidebar: Component<ProfileSidebarProps> = (props) => {
  const authenticatedAPI = useAuthenticatedAPI();
  const [skills, { refetch: refetchSkills }] = createResource<
    Schemas["UserSkillDto"][]
  >(async () => {
    const { data } = await authenticatedAPI.user.getSkills({}, null);
    return data || [];
  });
  const [education, { refetch: refetchEducation }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.education.getEducationHistory(
        {},
        null
      );
      return data || [];
    }
  );
  const [certifications, { refetch: refetchCertifications }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.certification.getCertificates(
        {},
        null
      );
      return data || [];
    }
  );
  const [projects, { refetch: refetchProjects }] = createResource(async () => {
    const { data } = await authenticatedAPI.clientProjects.getClientProjects(
      {},
      null
    );
    return data || [];
  });
  const [employment, { refetch: refetchEmployment }] = createResource(
    async () => {
      const { data } = await authenticatedAPI.employment.getEmploymentHistory(
        {},
        null
      );
      return data || [];
    }
  );
  const [skillsModalOpened, setSkillsModalOpened] =
    createSignal<boolean>(false);
  const [educationModalOpened, setEducationModalOpened] =
    createSignal<boolean>(false);
  const [certificateModalOpened, setCertificateModalOpened] =
    createSignal<boolean>(false);
  const [employmentModalOpen, setEmploymentModalOpen] =
    createSignal<boolean>(false);
  const [clientProjectModalOpen, setClientProjectModalOpen] =
    createSignal<boolean>(false);

  return (
    <Suspense
      fallback={
        <div class="flex items-center justify-center w-full">
          <Loader />
        </div>
      }
    >
      <Overlay opened={props.opened} onOverlayClick={props.handleClose}>
        <Transition name="slide">
          <Show when={props.opened}>
            <Card
              class={clsx(
                "fixed right-0 z-20 flex flex-col w-full gap-5 p-5 md:w-[30rem] md:rounded-r-none h-[calc(100%-4rem)] md:h-full bottom-0 overflow-auto"
              )}
              color="contrast"
            >
              <Show
                when={props.profile}
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <ProfileCard profile={props.profile!} />
              </Show>
              <div class="flex items-center justify-center">
                <Icon path={mdiChartBoxOutline} class="w-8 h-8" />
                <h2 class="flex-1 ml-2 text-2xl">Skills</h2>
                <Button
                  color="primary"
                  onClick={() => setSkillsModalOpened(true)}
                >
                  Add
                </Button>
              </div>
              <Suspense
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <For each={skills()}>
                  {(skill) => {
                    return <SkillCard skill={skill} />;
                  }}
                </For>
              </Suspense>
              <AddSkillsModal
                opened={skillsModalOpened()}
                setOpened={setSkillsModalOpened}
                refetch={refetchSkills}
              ></AddSkillsModal>

              <div class="flex items-center justify-center">
                <Icon path={mdiSchoolOutline} class="w-8 h-8" />
                <h2 class="flex-1 ml-2 text-2xl">Education</h2>
                <Button
                  color="primary"
                  onClick={() => setEducationModalOpened(true)}
                >
                  Add
                </Button>
              </div>
              <Suspense
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <For each={education()}>
                  {(educationRecord) => (
                    <EducationCard
                      educationRecord={educationRecord}
                      refetchEducationHistory={refetchEducation}
                    />
                  )}
                </For>
              </Suspense>
              <AddEducationModal
                opened={educationModalOpened()}
                setOpened={setEducationModalOpened}
                refetch={refetchEducation}
              />

              <div class="flex items-center justify-center">
                <Icon path={mdiCertificateOutline} class="w-8 h-8" />
                <h2 class="flex-1 ml-2 text-2xl">Certifications</h2>
                <Button
                  color="primary"
                  onClick={() => setCertificateModalOpened(true)}
                >
                  Add
                </Button>
              </div>
              <Suspense
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <For each={certifications()}>
                  {(certificateRecord) => (
                    <CertificateCard certificateRecord={certificateRecord} />
                  )}
                </For>
              </Suspense>
              <AddCertificationModal
                opened={certificateModalOpened()}
                setOpened={setCertificateModalOpened}
                refetch={refetchCertifications}
              />
              <div class="flex items-center justify-center">
                <Icon path={mdiListBoxOutline} class="w-8 h-8" />
                <h2 class="flex-1 ml-2 text-2xl">Client Projects</h2>
                <Button
                  color="primary"
                  onClick={() => setClientProjectModalOpen(true)}
                >
                  Add
                </Button>
              </div>
              <Suspense
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <For each={projects()}>
                  {(clientProjectRecord) => {
                    return (
                      <ClientProjectCard
                        clientProjectRecord={clientProjectRecord}
                      />
                    );
                  }}
                </For>
              </Suspense>
              <AddClientProjectModal
                opened={clientProjectModalOpen()}
                setOpened={setClientProjectModalOpen}
                refetch={refetchProjects}
              />
              <div class="flex items-center justify-center">
                <Icon path={mdiBriefcaseVariantOutline} class="w-8 h-8" />
                <h2 class="flex-1 ml-2 text-2xl">Employment</h2>
                <Button
                  color="primary"
                  onClick={() => setEmploymentModalOpen(true)}
                >
                  Add
                </Button>
              </div>
              <Suspense
                fallback={
                  <div class="flex items-center justify-center w-full">
                    <Loader />
                  </div>
                }
              >
                <For each={employment()}>
                  {(employmentRecord) => {
                    return (
                      <EmploymentCard employmentRecord={employmentRecord} />
                    );
                  }}
                </For>
              </Suspense>
              <AddEmploymentModal
                opened={employmentModalOpen()}
                setOpened={setEmploymentModalOpen}
                refetch={refetchEmployment}
              />
            </Card>
          </Show>
        </Transition>
      </Overlay>
    </Suspense>
  );
};

export { ProfileSidebar };
