import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Restricted({ to, children }) {
  const { user } = useAuth();
  return checkUserRoles(user.roles, to) ? children : null;
}

export function RestrictedRoutes({ to }) {
  const { user } = useAuth();
  return checkUserRoles(user.roles, to) ? <Outlet /> : <Navigate to="/"/>;
}

export default Restricted;

export function checkUserRoles(roles, to) {
  return roles.some((role) => to.includes(role));
}
