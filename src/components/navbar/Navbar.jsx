import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { twJoin } from "tailwind-merge";
import Restricted from "../authentication/Restricted";
import { ProfileNavbar } from "./ProfileNavbar";

export default function Navbar() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex px-5 py-2 items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              twJoin("text-gray-600", isActive && "text-blue-600")
            }
          >
            Home
          </NavLink>
          <Restricted to={["ADMINTOOL", "ADMINLEAD"]}>
            <React.Fragment>
              <div>
                <NavLink
                  to="/softwares"
                  className={({ isActive }) =>
                    twJoin("text-gray-600", isActive && "text-blue-600")
                  }
                >
                  Softwares
                </NavLink>
              </div>
              <div>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    twJoin("text-gray-600", isActive && "text-blue-600")
                  }
                >
                  Projects
                </NavLink>
              </div>
            </React.Fragment>
          </Restricted>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              twJoin("text-gray-600", isActive && "text-blue-600")
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/requestdashboard"
            className={({ isActive }) =>
              twJoin("text-gray-600", isActive && "text-blue-600")
            }
          >
            Request Dashboard
          </NavLink>
        </div>
        <ProfileNavbar />
      </div>
      <div className="flex-1 h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}
