import { LineChart } from "#components/fragments/line-chart";
import { Button, IconButton } from "#components/primitives/button";
import { Card } from "#components/primitives/card";
import { Icon } from "#components/primitives/icon";
import {
  mdiAccountMultipleOutline,
  mdiBriefcaseOutline,
  mdiDotsVertical,
  mdiMagnify,
  mdiPercentCircleOutline,
  mdiStarOutline,
  mdiWalletOutline,
} from "@mdi/js";
import { Component, For } from "solid-js";
import "#styles/backgrounds.css";
import { BarChart } from "#components/fragments/bar-chart";
import { ProjectsList } from "./projects-list";
import { logoIcon } from "#assets/icons/logo";
import { AuthenticatedLayout } from "#components/layouts/authenticated";
import { Input } from "#components/primitives/input";

const DashboardPage: Component = () => {
  return (
    <AuthenticatedLayout>
      <div class="flex-1 h-auto overflow-auto">
        <div class="flex flex-col items-center justify-center px-8 pt-4 md:items-start md:flex-row">
          <div class="flex-1 pb-4 md:pb-0">
            <h1 class="text-4xl font-extrabold">Dashboard</h1>
            <span class="text-gray-400">Hello Arek, welcome back.</span>
          </div>
        <div class="relative">
          <Input
            class="flex-row-reverse w-full bg-gray-200 pl-12 text-base bg-transparent border-0"
            wrapperClass="w-full md:w-56"
            placeholder="Search dashboard"
            adornment={
              <IconButton
                class="rounded-xl m-0"
                icon={mdiMagnify}
                text="soft"
                variant="text"
              />
            }
            adornmentWrapperClass="left-[5px] top-[6px] right-auto"
          />
          </div>
        </div>
        <div class="grid items-start flex-1 h-auto grid-cols-1 gap-3 p-3 md:gap-6 md:p-6 md:grid-cols-2 md:grid-rows-4 xl:grid-cols-3 xl:grid-rows-5">
          <Card class="flex flex-col h-full p-5 md:p-6 md:col-span-2 md:row-span-2">
            <div class="flex items-center justify-center pb-4">
              <h2 class="flex-1 text-2xl font-bold">Revenue</h2>
              <Button color="primary" class="px-4 md:px-6 py-[6px] md:py-2 rounded-[16px] m-0">Weekly</Button>
              <Button text="soft" class="px-4 md:px-6 py-[6px] md:py-2 rounded-[16px] m-0 ml-2 md:ml-3">Monthly</Button>
            </div>
            <LineChart class="flex-1" />
          </Card>
          <Card class="flex flex-col h-full gap-4 md:row-span-2 bg-none rounded-0 p-0 shadow-none	bg-transparent">
          <h2 class="text-2xl font-bold purple-100">Statistics</h2>
            <div class="bg-[#f6efff] mb-3 p-8 rounded-3xl shadow">
              <div class="flex flex-col">
                <div class="p-2 mr-4 bg-white rounded-full w-14 h-14 mb-4">
                  <Icon
                    path={mdiStarOutline}
                    class="w-10 h-10 fill-[url(#gradient)]"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-bold text-black">85%</span>
                  <h2 class="flex-1 text-base text-[#7a86a1]">Reputation</h2>
                </div>
              </div>
            </div>
            
            <div class="bg-[#fff4f2] p-8 rounded-3xl shadow">
              <div class="flex flex-col">
                <div class="p-2 mr-4 bg-white rounded-full w-14 h-14 mb-4">
                  <Icon
                    path={mdiAccountMultipleOutline}
                    class="w-10 h-10 fill-[url(#gradient)]"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-bold text-black">58%</span>
                  <h2 class="flex-1 text-base text-[#7a86a1]">Team Activities</h2>
                </div>
              </div>
            </div>
          </Card>
          <Card class="flex flex-col h-full p-5 md:p-6 md:row-span-2">
            <div class="flex flex-row items-center justify-center pb-4">
              <h2 class="flex-1 text-2xl font-bold">Visitors</h2>
              <IconButton
                icon={mdiDotsVertical}
                text="soft"
                variant="text"
                class="m-0"
              />
            </div>
            <BarChart class="flex-1" />
          </Card>
          <Card class="flex flex-col h-full p-5 md:p-6 md:col-span-2 md:row-span-3">
            <div class="flex items-center justify-center pb-4">
              <h2 class="flex-1 text-2xl font-bold">Featured Projects</h2>
              <IconButton
                icon={mdiDotsVertical}
                text="soft"
                variant="text"
                class="m-0"
              />
            </div>
            <ProjectsList
              projects={[
                {
                  name: "AFO Marketing Project",
                  hours: 48,
                  category: "Marketing",
                  budget: 450,
                },
                {
                  name: "OKP Finance Project",
                  hours: 72,
                  category: "Finance",
                  budget: 610,
                },
                {
                  name: "ADQ IT Support Project",
                  hours: 68,
                  category: "IT Support",
                  budget: 450,
                },
              ]}
            />
            <Card
              color="primary"
              class="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 tic-tac-toe-gradient mt-6 px-6 md:px-12"
            >
              <div class="flex flex-col items-start justify-center">
                <h3 class="flex-1 font-bold text-[19px] lg:text-[22px]">
                  Discover all Projects
                </h3>
                <span class="text-sm text-white text-[15px] text-opacity-70 block mb-5">
                  Make more money with Panoton
                </span>
                <Button
                  size="small"
                  class="bg-white lg:hidden hover:bg-gray-100 rounded-[16px] text-base text-[#6149cd] px-8 py-3 font-semibold	m-0"
                >
                  See all Projects
                </Button>
                <Button
                  size="large"
                  class="hidden bg-white lg:block hover:bg-gray-100 rounded-[16px] text-base text-[#6149cd] px-8 py-3 font-semibold	m-0"
                >
                  See all Projects
                </Button>
              </div>
              <Icon path={logoIcon} class="max-h-52" />
            </Card>
          </Card>
          <Card class="h-full"></Card>
        </div>
      </div>
      <div class="flex-col items-center justify-start hidden h-full p-4 ml-2 bg-white border-gray-200 shadow-inner lg:flex w-72">
        <span class="text-base lg:text-lg text-[#7a86a1] mt-10">Your earnings this month</span>
        <span class="text-5xl font-bold my-3">$2,309.68</span>
        <span class="text-base lg:text-lg text-[#7a86a1]">28 Jun 2022 at 10:38</span>
        <Button
          size="large"
          class="m-0 my-8 inline-flex items-center justify-center h-[46px] min-h-[46px] lg:min-h-[52px] lg:h-[52px] font-bold text-base text-[#6149cd] rounded-[14px] md:rounded-[18px] bg-[#FFFFFF] px-8 py-2 shadow-[0px_16px_40px_rgba(105,54,151,14%)]"
        >
          Withdraw earnings
        </Button>
        <div class="flex flex-col items-center justify-center w-full gap-4 mt-4">
          <For
            each={[
              {
                label: "Total earnings",
                icon: mdiWalletOutline,
                amount: 2368.1,
              },
              {
                label: "Projects earnings",
                icon: mdiBriefcaseOutline,
                amount: 2168.07,
              },
              {
                label: "Tax withheld",
                icon: mdiPercentCircleOutline,
                amount: 210.03,
              },
            ]}
          >
            {(item) => {
              return (
                <div class="flex items-center justify-center w-full">
                  <IconButton class="bg-[#f6efff] h-16 w-16	rounded-3xl	bg-none m-0 mr-4 text-[#6149cd]"
                    size="large"
                    icon={item.icon}
                    variant="text"
                  />
                  <div class="flex flex-col flex-1">
                    <span class="font-semibold text-[#7a86a1] text-[15px]">
                      {item.label}
                    </span>
                    <span class="text-xl font-bold text-black">
                      {item.amount.toLocaleString("en", {
                        currency: "USD",
                        style: "currency",
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export { DashboardPage };
