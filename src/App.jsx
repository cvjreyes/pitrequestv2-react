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

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

import CheckLogin from "./components/authentication/CheckLogin";
import Login from "./components/authentication/Login";
import { RestrictedRoutes } from "./components/authentication/Restricted";
import Signin from "./components/authentication/Signin";
import Home from "./components/home/Home";
import Projects from "./components/projects/Projects";
import RequestDashboard from "./components/requestdashboard/RequestDashboard";
import Softwares from "./components/softwares/Softwares";
import Users from "./components/users/Users";

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
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
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
                <Route path="/softwares" element={<Softwares />} />
                <Route path="/projects" element={<Projects />} />
              </Route>
              <Route path="/users" element={<Users />} />
              <Route path="/requestdashboard" element={<RequestDashboard />} />
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/log_in/:user_id/:token" element={<CheckLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Signin />} />
            </Route>
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
