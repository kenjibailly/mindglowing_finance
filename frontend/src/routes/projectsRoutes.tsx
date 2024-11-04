import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import NotFound from "../components/NotFound";
import Projects from "../components/projects/Projects";
import Project from "../components/projects/Project";

const projectRoutes: RouteObject[] = [
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
];

export default projectRoutes;
