import { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";
import { LoginPage } from "#pages/login";
import { DashboardPage } from "#pages/dashboard";
import { TeamsPage } from "#pages/teams";
import { ProjectsPage } from "#pages/projects";
import { AuthenticatedLayout } from "#components/layouts/authenticated";
import { CommunityPage } from "#pages/community";
const App: Component = () => {
  const Route = useRoutes([
    {
      path: "/login",
      component: LoginPage,
    },
    { path: "/teams", component: TeamsPage },
    {
      path: "/projects",
      component: () => (
        <AuthenticatedLayout>
          <ProjectsPage />
        </AuthenticatedLayout>
      ),
    },
    {
      path: "/",
      component: DashboardPage,
    },
    {
      path:"/community",
      component:CommunityPage
    }
  ]);

  return <Route />;
};

export default App;
