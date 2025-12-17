import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authPages/Login/Login";
import RegistyerEmployee from "../pages/authPages/Register/RegistyerEmployee";
import RegisterHR from "../pages/authPages/Register/RegisterHR";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome/DashboardHome";
import AddAsset from "../pages/dashboard/AddAsset/AddAsset";
import AssetList from "../pages/dashboard/AssetList/AssetList";
import UpgradePackage from "../pages/dashboard/UpgradePackage/UpgradePackage";
import AllRequests from "../pages/dashboard/AllRequests/AllRequests";
import AllEmployees from "../pages/dashboard/AllEmployees/AllEmployees";
import HrRoute from "./HrRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register-employee",
        Component: RegistyerEmployee,
      },
      {
        path: "register-hr",
        Component: RegisterHR,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "add-asset",
        element: (
          <HrRoute>
            <AddAsset></AddAsset>
          </HrRoute>
        ),
      },
      {
        path: "asset-list",
        element: (
          <HrRoute>
            <AssetList></AssetList>
          </HrRoute>
        ),
      },
      {
        path: "all-requests",
        element: (
          <HrRoute>
            <AllRequests></AllRequests>
          </HrRoute>
        ),
      },
      {
        path: "all-employees",
        element: (
          <HrRoute>
            <AllEmployees></AllEmployees>
          </HrRoute>
        ),
      },
      {
        path: "upgrade-package",
        element: (
          <HrRoute>
            <UpgradePackage></UpgradePackage>
          </HrRoute>
        ),
      },
    ],
  },
]);
