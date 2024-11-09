import { RouteObject } from "react-router-dom";
import accountSettingsRoutes from "./settings/accountSettingsRoutes";
import paymentMethodSettingsRoutes from "./settings/paymentMethodSettingsRoutes";
import customizationSettingsRoutes from "./settings/customizationSettingsRoutes";
import discountsSettingsRoutes from "./settings/discountsSettingsRoutes";

const settingsRoutes: RouteObject[] = [
  ...accountSettingsRoutes,
  ...paymentMethodSettingsRoutes,
  ...customizationSettingsRoutes,
  ...discountsSettingsRoutes,
];

export default settingsRoutes;
