import { createBrowserRouter } from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../pages/HomePage/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AllClubsPage from "../pages/AllClubPage/AllClubsPage";
import AllEventPage from "../pages/AllEventPage/AllEventPage";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import UsersManagement from "../pages/Dashboard/UsersManagement/UsersManagement";
import MyClubs from "../pages/Dashboard/MyClubs/MyClubs";
import ManageClubs from "../pages/Dashboard/ManageClubs/ManageClubs";
import EventsManagement from "../pages/Dashboard/EventsManagement/EventsManagement";
import ClubDetails from "../pages/ClubDetailsPage/ClubDetails";
import MyMemberships from "../pages/Dashboard/MyMemberships/MyMemberships";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import EventDetails from "../pages/EventDetails/EventDetails";
import ClubMembers from "../pages/Dashboard/ClubMembers/ClubMembers";
import EventRegistration from "../pages/Dashboard/EventRegistration/EventRegistration";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AdminPayments from "../pages/Dashboard/AdminPayments/AdminPayments";
import MyEvents from "../pages/Dashboard/MyEvents/MyEvents";
import MyPayments from "../pages/Dashboard/MyPayments/MyPayments";
import MyProfile from "../pages/MyProfile/MyProfile";
import AboutUs from "../pages/AboutUs/AboutUs";


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
          path: '/clubs/:id',
          Component: ClubDetails
        },
        {
          path: '/all-events',
          Component: AllEventPage
        },
        {
          path: '/events/:id',
          Component: EventDetails
        },
        {
          path: '/about-us',
          Component: AboutUs
        },
        {
          path: '/payment-success',
          Component: PaymentSuccess
        },
        {
          path: '/my-profile',
          element: <PrivateRoute><MyProfile></MyProfile></PrivateRoute>
        }
    ]
  },
  {
    path:'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children:[
      {
        index: true,
        Component: DashboardHome
      },
      {
        path:'users-management',
        element: <UsersManagement></UsersManagement>
      },
      {
        path: 'my-clubs',
        element: <MyClubs></MyClubs>
      },
      {
        path: 'manage-clubs',
        element: <ManageClubs></ManageClubs>
      },
      {
        path: 'event-management',
        element: <EventsManagement></EventsManagement>
      },
      {
        path:'event-registrations',
        element: <EventRegistration></EventRegistration>
      },
      {
        path: 'my-memberships',
        element: <MyMemberships></MyMemberships>
      },
      {
        path: 'club-members',
        element: <ClubMembers></ClubMembers>
      },
      {
        path: 'payment-history',
        element: <AdminPayments></AdminPayments>
      },
      {
        path: 'my-events',
        element:<MyEvents></MyEvents>
      },
      {
        path: 'my-payments',
        element:<MyPayments></MyPayments>
      }
    ]
  }
]);

export default router