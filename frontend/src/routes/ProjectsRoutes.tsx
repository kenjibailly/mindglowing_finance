import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import NotFound from "../components/NotFound";
import Projects from "../components/projects/Projects";
import Project from "../components/projects/Project";
import CreateProject from "../components/projects/CreateProject";
import EditProject from "../components/projects/EditProject";

const ProjectRoutes: RouteObject[] = [
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Projects" />
          <Projects />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Project" />
          <Project />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/projects/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Project" />
          <CreateProject />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/projects/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Project" />
          <EditProject />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default ProjectRoutes;
