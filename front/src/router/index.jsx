import { lazy } from "react";

import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main";

import Loadable from "../components/Loadable";

const Login = Loadable(lazy(() => import("../views/Login/Main")));
const Forgot = Loadable(lazy(() => import("../views/Login/Forgot")));
const ResetPass = Loadable(lazy(() => import("../views/Login/ResetPass")));
const ErrorPage = Loadable(lazy(() => import("../views/ErrorPage/Main")));

const EmpDashBoard = Loadable(lazy(() => import("../views/dashboard/EmpMain")));

const AdminDashBoard = Loadable(
  lazy(() => import("../views/dashboard/AdminMain"))
);

const DashBoard = Loadable(lazy(() => import("../views/dashboard/Dashboard")));

const Admins = Loadable(lazy(() => import("../views/Admins/Main")));
const Supervisor = Loadable(lazy(() => import("../views/Supervisor/Main")));

const AssignEmployee = Loadable(
  lazy(() => import("../views/Supervisor/AssignEmployee"))
);

const Employees = Loadable(lazy(() => import("../views/Employees/Main")));
const EmpActivity = Loadable(lazy(() => import("../views/Employees/Activity")));

const Results = Loadable(lazy(() => import("../views/Results/Main")));

const Clients = Loadable(lazy(() => import("../views/Clients/Main")));
const Cancel = Loadable(lazy(() => import("../views/Cancel/Main")));
const Calls = Loadable(lazy(() => import("../views/Calls/Main")));
const AddCalls = Loadable(lazy(() => import("../views/Calls/AddCalls")));

const ImportCalls = Loadable(lazy(() => import("../views/Calls/ImportCalls")));

const SearchCalls = Loadable(lazy(() => import("../views/Calls/SearchCalls")));

const Profile = Loadable(lazy(() => import("../views/dashboard/Profile")));

const EditCalls = Loadable(lazy(() => import("../views/Calls/EditCalls")));
const AllReports = Loadable(lazy(() => import("../views/Reports/Main")));

const EmpReports = Loadable(lazy(() => import("../views/Reports/EmpReports")));

const CustomReports = Loadable(
  lazy(() => import("../views/Reports/CustomMain"))
);

const Report = Loadable(lazy(() => import("../views/Reports/Report")));
const Notification = Loadable(lazy(() => import("../views/Notification/Main")));
const Calendars = Loadable(lazy(() => import("../views/Calendar/Main")));

const SlackChat = Loadable(lazy(() => import("../views/Slack/Main")));
const SlackUsers = Loadable(lazy(() => import("../views/Slack/Users")));
const SlackConversion = Loadable(
  lazy(() => import("../views/Slack/Conversion"))
);

const WaChat = Loadable(lazy(() => import("../views/WhatsApp/Main")));
const WaUsers = Loadable(lazy(() => import("../views/WhatsApp/Users")));
const WaConversion = Loadable(
  lazy(() => import("../views/WhatsApp/Conversion"))
);

const Settings = Loadable(lazy(() => import("../views/Settings/Main")));

import { loginState } from "../state/login-atom";
import { useRecoilValue } from "recoil";

//import HistoryView from "../views/WhatsApp/HistoryView";

const HistoryView = Loadable(
  lazy(() => import("../views/Reports/EmpFirstCallReport"))
);

const EmpFcReport = Loadable(
  lazy(() => import("../views/Reports/EmpFirstCallReport"))
);
const EmpFollowReport = Loadable(
  lazy(() => import("../views/Reports/EmpFollowReport"))
);

const Import = Loadable(lazy(() => import("../views/Import/Main")));

//import Calendar from "../views/calendar/Main";

function Router() {
  const login = useRecoilValue(loginState);

  //  console.log("loginStore", login);

  let auth = login.token ? true : false;

  const superAdminRoutes = [
    {
      path: "/",
      element: auth ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: "/",
          element: <Calls />,
        },
        {
          path: "/profile",
          element: <AdminDashBoard />,
        },
        {
          path: "/dashboard",
          element: <DashBoard />,
        },

        {
          path: "/admins",
          element: <Admins />,
        },
        {
          path: "/Supervisor",
          element: <Supervisor />,
        },

        {
          path: "/assign_employee/:id",
          element: <AssignEmployee />,
        },

        {
          path: "/employees",
          element: <Employees />,
        },

        {
          path: "/emp_activity/:id",
          element: <EmpActivity />,
        },
        {
          path: "/slack/chat",
          element: <SlackChat />,
        },
        {
          path: "/slack/users",
          element: <SlackUsers />,
        },
        {
          path: "/slack/conversion",
          element: <SlackConversion />,
        },

        {
          path: "/whatsapp/chat",
          element: <WaChat />,
        },
        {
          path: "/whatsapp/template",
          element: <WaUsers />,
        },
        {
          path: "/whatsapp/message",
          element: <WaConversion />,
        },
        {
          path: "/whatsapp/message/history/:id",
          element: <HistoryView />,
        },

        {
          path: "/calendar",
          element: <Calendars />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/calls/:id",
          element: <Calls />,
        },
        {
          path: "/calls/add",
          element: <AddCalls />,
        },
        {
          path: "/calls/import",
          element: <ImportCalls />,
        },
        {
          path: "/import/:type",
          element: <Import />,
        },
        {
          path: "/calls/search",
          element: <SearchCalls />,
        },
        {
          path: "/calls/edit/:id",
          element: <EditCalls />,
        },

        {
          path: "/reports/",
          element: <AllReports />,
        },
        {
          path: "/creport/",
          element: <CustomReports />,
        },
        {
          path: "/reports/:id",
          element: <Report />,
        },

        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/results/:id",
          element: <Results />,
        },
        {
          path: "/notifications",
          element: <Notification />,
        },

        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },

    {
      path: "/login",
      element: auth ? <Navigate to="/" /> : <Login />,
    },

    {
      path: "/forgot",
      element: auth ? <Navigate to="/" /> : <Forgot />,
    },
    {
      path: "/password/:token/:id",
      element: auth ? <Navigate to="/" /> : <ResetPass />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  const adminRoutes = [
    {
      path: "/",
      element: auth ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: "/",
          element: <Calls />,
        },

        {
          path: "/profile",
          element: <AdminDashBoard />,
        },

        {
          path: "/Supervisor",
          element: <Supervisor />,
        },

        {
          path: "/employees",
          element: <Employees />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/calls/:id",
          element: <Calls />,
        },
        {
          path: "/calls/add",
          element: <AddCalls />,
        },

        {
          path: "/calls/search",
          element: <SearchCalls />,
        },
        {
          path: "/calls/edit/:id",
          element: <EditCalls />,
        },
        {
          path: "/calls/import",
          element: <ImportCalls />,
        },

        {
          path: "/reports/",
          element: <AllReports />,
        },
        {
          path: "/creport/",
          element: <CustomReports />,
        },
        {
          path: "/reports/:id",
          element: <Report />,
        },

        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/calendar",
          element: <Calendars />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/results/:id",
          element: <Results />,
        },
        {
          path: "/notifications",
          element: <Notification />,
        },
      ],
    },

    {
      path: "/login",
      element: auth ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/forgot",
      element: auth ? <Navigate to="/" /> : <Forgot />,
    },

    {
      path: "/password/:token/:id",
      element: auth ? <Navigate to="/" /> : <ResetPass />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];
  const employeeRoutes = [
    {
      path: "/",
      element: auth ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: "/profile",
          element: <AdminDashBoard />,
        },
        {
          path: "/",
          element: <Calls />,
        },
        {
          path: "/calls/:id",
          element: <Calls />,
        },
        {
          path: "/calls/add",
          element: <AddCalls />,
        },
        {
          path: "/calls/import",
          element: <ImportCalls />,
        },

        {
          path: "/calls/edit/:id",
          element: <EditCalls />,
        },
        {
          path: "/calls/search",
          element: <SearchCalls />,
        },


        {
          path: "/results/:id",
          element: <Results />,
        },
        // {
        //   path: "/calls/import",
        //   element: <ImportCalls />,
        // },

        {
          path: "/reports/",
          element: <EmpReports />,
        },
        {
          path: "/fcreport/",
          element: <EmpFcReport />,
        },
        {
          path: "/freport/",
          element: <EmpFollowReport />,
        },
        // {
        //   path: "/reports/:id",
        //   element: <Report />,
        // },

        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/calendar",
          element: <Calendars />,
        },
      ],
    },

    {
      path: "/login",
      element: auth ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/forgot",
      element: auth ? <Navigate to="/" /> : <Forgot />,
    },
    {
      path: "/password/:token/:id",
      element: auth ? <Navigate to="/" /> : <ResetPass />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  const supervisorRoute = [
    {
      path: "/",
      element: auth ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: "/profile",
          element: <AdminDashBoard />,
        },
        {
          path: "/employees",
          element: <Employees />,
        },
        {
          path: "/",
          element: <Calls />,
        },
        {
          path: "/calls/:id",
          element: <Calls />,
        },
        {
          path: "/calls/add",
          element: <AddCalls />,
        },
        {
          path: "/calls/import",
          element: <ImportCalls />,
        },

        {
          path: "/calls/edit/:id",
          element: <EditCalls />,
        },
        {
          path: "/results/:id",
          element: <Results />,
        },
        // {
        //   path: "/calls/import",
        //   element: <ImportCalls />,
        // },

        {
          path: "/reports/",
          element: <EmpReports />,
        },
        {
          path: "/fcreport/",
          element: <EmpFcReport />,
        },
        {
          path: "/freport/",
          element: <EmpFollowReport />,
        },
        // {
        //   path: "/reports/:id",
        //   element: <Report />,
        // },

        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/calendar",
          element: <Calendars />,
        },
      ],
    },

    {
      path: "/login",
      element: auth ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/forgot",
      element: auth ? <Navigate to="/" /> : <Forgot />,
    },
    {
      path: "/password/:token/:id",
      element: auth ? <Navigate to="/" /> : <ResetPass />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  if (login.role == 1) {
    return useRoutes(superAdminRoutes);
  } else if (login.role == 2) {
    return useRoutes(adminRoutes);
  } else if (login.role == 4) {
    return useRoutes(supervisorRoute);
  } else {
    return useRoutes(employeeRoutes);
  }
}

export default Router;
