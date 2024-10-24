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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/setup",
    element: <Setup />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Nav />
        <Dashboard />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
