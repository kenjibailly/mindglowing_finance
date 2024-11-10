import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import "./stylesheets/style.css";

import IndexRoutes from "./routes/Index";
import AuthRoutes from "./routes/AuthRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import ProjectRoutes from "./routes/ProjectsRoutes";
import InvoiceRoutes from "./routes/InvoicesRoutes";
import SettingsRoutes from "./routes/SettingsRoutes";

const router = createBrowserRouter([
  ...IndexRoutes,
  ...AuthRoutes,
  ...CustomerRoutes,
  ...ProductRoutes,
  ...ProjectRoutes,
  ...InvoiceRoutes,
  ...SettingsRoutes,
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
