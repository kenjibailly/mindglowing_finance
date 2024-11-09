import { RouteObject } from "react-router-dom";
import AccountSettingsRoutes from "./settings/AccountSettingsRoutes";
import PaymentMethodSettingsRoutes from "./settings/PaymentMethodSettingsRoutes";
import CustomizationSettingsRoutes from "./settings/CustomizationSettingsRoutes";
import DiscountsSettingsRoutes from "./settings/DiscountsSettingsRoutes";
import ShippingCompanySettingsRoutes from "./settings/ShippingCompanySettingsRoutes";
import TaxSettingsRoutes from "./settings/TaxSettingsRoutes";

const SettingsRoutes: RouteObject[] = [
  ...AccountSettingsRoutes,
  ...PaymentMethodSettingsRoutes,
  ...CustomizationSettingsRoutes,
  ...DiscountsSettingsRoutes,
  ...ShippingCompanySettingsRoutes,
  ...TaxSettingsRoutes,
];

export default SettingsRoutes;
