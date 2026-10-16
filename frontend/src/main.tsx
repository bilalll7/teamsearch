import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  useRouteError,
  Link,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Workspace, Empty } from "./components/workspace";
import { PageTransition } from "./components/PageTransition";
import { LoginPage, RequireAuth } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import ProfileWorkspacePage from "./pages/ProfileWorkspacePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import {
  OverviewPage,
  ExplorePage,
  ApplicationsPage,
  TeamsPage,
  WelcomePage,
} from "./pages/WorkspacePages";
import {
  CreateRecruitmentPage,
  RecruitmentDetailPage,
} from "./pages/RecruitmentPages";
import "./i18n";
import "./index.css";
import "./workspace.css";
function Root() {
  return (
    <>
      <ScrollRestoration />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </>
  );
}
function RouteError() {
  const error = useRouteError();
  console.error(error);
  return (
    <main style={{ padding: 40 }}>
      <Empty
        title="Halaman belum dapat dibuka"
        text="Muat ulang halaman atau kembali ke ringkasan."
      >
        <Link className="action" to="/dashboard">
          Kembali ke ringkasan
        </Link>
      </Empty>
    </main>
  );
}
const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: (
          <RequireAuth>
            <Workspace />
          </RequireAuth>
        ),
        children: [
          { path: "/dashboard", element: <OverviewPage /> },
          { path: "/opportunities", element: <ExplorePage /> },
          { path: "/opportunities/create", element: <CreateRecruitmentPage /> },
          { path: "/opportunities/:id", element: <RecruitmentDetailPage /> },
          {
            path: "/opportunities/:id/manage",
            element: <RecruitmentDetailPage manage />,
          },
          { path: "/applications", element: <ApplicationsPage /> },
          { path: "/teams", element: <TeamsPage /> },
          { path: "/profile", element: <ProfileWorkspacePage /> },
          { path: "/profile/:userId", element: <PublicProfilePage /> },
          { path: "/profile/skills", element: <ProfileWorkspacePage /> },
          { path: "/profile/portfolio", element: <ProfileWorkspacePage /> },
        ],
      },
      {
        path: "*",
        element: (
          <Empty
            title="Halaman tidak ditemukan"
            text="Alamat ini tidak tersedia. Mari kembali ke workspace."
          >
            <Link className="action" to="/dashboard">
              Buka ringkasan
            </Link>
          </Empty>
        ),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
