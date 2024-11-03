import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import NotFound from "../components/NotFound";
import Projects from "../components/projects/Projects";

const projectRoutes: RouteObject[] = [
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Products" />
          <Projects />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default projectRoutes;
