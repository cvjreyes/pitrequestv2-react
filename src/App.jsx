import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotificationsSystem, {
  atalhoTheme,
  setUpNotifications,
  useNotifications,
} from "reapop";

import { AuthProvider } from "./context/AuthContext";
import ErrorFallback from "./components/general/ErrorFallback";

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

import Login from "./components/authentication/Login";
import Home from "./components/home/Home";
import CheckLogin from "./components/authentication/CheckLogin";
import Signin from "./components/authentication/Signin";
import Softwares from "./components/softwares/Softwares";

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
              <Route path="/softwares" element={<Softwares />} />
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
