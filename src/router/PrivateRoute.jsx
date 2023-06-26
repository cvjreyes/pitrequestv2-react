import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? (
    <div className="h-screen overflow-hidden">
      <Navbar>
        <Outlet />
      </Navbar>
    </div>
  ) : (
    <Navigate replace to="/login" />
  );
};

export default PrivateRoute;
