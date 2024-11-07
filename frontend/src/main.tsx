import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import "./stylesheets/style.css";

import indexRoutes from "./routes/index";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import productRoutes from "./routes/productRoutes";
import projectRoutes from "./routes/projectsRoutes";
import settingsRoutes from "./routes/settingsRoutes";

const router = createBrowserRouter([
  ...indexRoutes,
  ...authRoutes,
  ...customerRoutes,
  ...productRoutes,
  ...projectRoutes,
  ...settingsRoutes,
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
