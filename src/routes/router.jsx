import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authPages/Login/Login";
import RegisterEmployee from "../pages/authPages/Register/RegisterEmployee";
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
import EmployeeRoute from "./EmployeeRoute";
import RequestAnAsset from "../pages/dashboard/RequestAnAsset/RequestAnAsset";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import MyProfile from "../pages/dashboard/MyProfile/MyProfile";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../pages/dashboard/PaymentCancelled/PaymentCancelled";
import MyAssets from "../pages/dashboard/MyAssets/MyAssets";
import MyTeam from "../pages/dashboard/MyTeam/MyTeam";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
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
        Component: RegisterEmployee,
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
        path: "my-employees",
        element: (
          <HrRoute>
            <AllEmployees></AllEmployees>
          </HrRoute>
        ),
      },
      {
        path: "upgrade-package-hr",
        element: (
          <HrRoute>
            <UpgradePackage></UpgradePackage>
          </HrRoute>
        ),
      },

      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "my-assets",
        element: (
          <EmployeeRoute>
            <MyAssets></MyAssets>
          </EmployeeRoute>
        ),
      },
      {
        path: "request-asset",
        element: (
          <EmployeeRoute>
            <RequestAnAsset></RequestAnAsset>
          </EmployeeRoute>
        ),
      },
      {
        path: "my-team",
        element: (
          <EmployeeRoute>
            <MyTeam></MyTeam>
          </EmployeeRoute>
        ),
      },
      {
        path: "my-profile",
        Component: MyProfile,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard></AdminDashboard>
          </AdminRoute>
        ),
      },
    ],
  },
]);
