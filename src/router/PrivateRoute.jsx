import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? (
    <Navbar>
      <Outlet />
    </Navbar>
  ) : (
    <Navigate replace to="/login" />
  );
};

export default PrivateRoute;
