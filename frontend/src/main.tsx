import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Setup from "./components/Setup";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./stylesheets/style.css";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/logout",
    element: <Logout />,
    errorElement: <NotFound />,
  },
  {
    path: "/setup",
    element: <Setup />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Nav />
        <Dashboard />
      </>
    ),
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
