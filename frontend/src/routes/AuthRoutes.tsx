import { RouteObject } from "react-router-dom";
import Login from "../components/user/Login";
import Logout from "../components/user/Logout";
import NotFound from "../components/NotFound";

const AuthRoutes: RouteObject[] = [
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
];

export default AuthRoutes;
