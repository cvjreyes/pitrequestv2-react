import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import NotificationsSystem, {
  atalhoTheme,
  setUpNotifications,
  useNotifications,
} from "reapop";

import ErrorFallback from "./components/general/ErrorFallback";
import { AuthProvider } from "./context/AuthContext";

import { RestrictedRoutes } from "./components/authentication/Restricted";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

import CheckLogin from "./components/authentication/CheckLogin";
import Login from "./components/authentication/Login";
import Signin from "./components/authentication/Signin";
import Home from "./components/home/Home";
import Projects from "./components/projects/Projects";
import { AddSoftwareForm } from "./components/projects/create/AddSoftwareForm";
import { CreateCharterForm } from "./components/projects/create/CreateCharterForm";
import { CreateProjectForm } from "./components/projects/create/CreateProjectForm";
import { EditCharterForm } from "./components/projects/edit/EditCharterForm";
import { EditProjectForm } from "./components/projects/edit/EditProjectForm";
import RequestDashboard from "./components/requestdashboard/RequestDashboard";
import Softwares from "./components/softwares/Softwares";
import { CreateSoftwareForm } from "./components/softwares/create/CreateSoftwareForm";
import { CreateSubtaskForm } from "./components/softwares/create/CreateSubtaskForm";
import { CreateTaskForm } from "./components/softwares/create/CreateTaskForm";
import { EditSoftwareForm } from "./components/softwares/edit/EditSoftwareForm";
import { EditSubtaskForm } from "./components/softwares/edit/EditSubtaskForm";
import { EditTaskForm } from "./components/softwares/edit/EditTaskForm";
import Users from "./components/users/Users";
import { AddAdminToSoftwareForm } from "./components/projects/create/AddAdminToSoftwareForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (error.response.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      },
    },
  },
});

export default function App() {
  const { notifications, dismissNotification } = useNotifications();
  // run this function when your application starts before creating any notifications
  setUpNotifications({
    defaultProps: {
      position: "top-right",
      dismissible: true,
      dismissAfter: 3000,
    },
  });
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsSystem
            notifications={notifications}
            dismissNotification={(id) => dismissNotification(id)}
            theme={atalhoTheme}
          />
          <Router basename={import.meta.env.VITE_BASENAME}>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route
                  element={<RestrictedRoutes to={["ADMINTOOL", "ADMINLEAD"]} />}
                >
                  <Route path="/softwares" element={<Softwares />}>
                    <Route path="create" element={<CreateSoftwareForm />} />
                    <Route
                      path=":softwareId/edit"
                      element={<EditSoftwareForm />}
                    />
                    <Route
                      path=":softwareId/task/create"
                      element={<CreateTaskForm />}
                    />
                    <Route
                      path=":softwareId/task/:taskId/edit"
                      element={<EditTaskForm />}
                    />
                    <Route
                      path=":softwareId/task/:taskId/subtask/create"
                      element={<CreateSubtaskForm />}
                    />
                    <Route
                      path=":softwareId/task/:taskId/subtask/:subtaskId/edit"
                      element={<EditSubtaskForm />}
                    />
                  </Route>
                  <Route path="/projects" element={<Projects />}>
                    <Route path="create" element={<CreateProjectForm />} />
                    <Route
                      path=":projectId/edit"
                      element={<EditProjectForm />}
                    />
                    <Route
                      path=":projectId/charter/create"
                      element={<CreateCharterForm />}
                    />
                    <Route
                      path=":projectId/charter/:charterId/edit"
                      element={<EditCharterForm />}
                    />
                    <Route
                      path=":projectId/software/add"
                      element={<AddSoftwareForm />}
                    />
                    <Route
                      path=":projectId/software/:softwareId/admin/add"
                      element={<AddAdminToSoftwareForm />}
                    />
                  </Route>
                </Route>
                <Route path="/users" element={<Users />} />
                <Route
                  path="/requestdashboard"
                  element={<RequestDashboard />}
                />
              </Route>
              <Route element={<PublicRoute />}>
                <Route
                  path="/log_in/:user_id/:token"
                  element={<CheckLogin />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Signin />} />
              </Route>
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
