import { createBrowserRouter } from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../pages/HomePage/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AllClubsPage from "../pages/AllClubPage/AllClubsPage";
import AllEventPage from "../pages/AllEventPage/AllEventPage";
import BeClubManager from "../pages/BeClubManagerPage/BeClubManager";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import UsersManagement from "../pages/Dashboard/UsersManagement/UsersManagement";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayouts></RootLayouts>,
    children: [
        {
            index: true,
            Component: Home
        },
        {
            path: '/login',
            Component: Login
        },
        {
            path: '/register',
            Component: Register
        },
        {
          path: '/all-clubs',
          Component: AllClubsPage
        },
        {
          path: '/all-events',
          Component: AllEventPage
        },
        {
          path: '/be-club-manager',
          Component: BeClubManager
        }
    ]
  },
  {
    path:'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children:[
      {
        path:'users-management',
        element: <UsersManagement></UsersManagement>
      }
    ]
  }
]);

export default router