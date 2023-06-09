/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ProfileNavbar } from "./ProfileNavbar";
import Restricted from "../authentication/Restricted";

export default function Navbar() {
  return (
    <>
      <div css={navbarStyle}>
        <div className="containerNavbar">
          <div className="menu">
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? { color: "white" } : null)}
            >
              Home
            </NavLink>
            <Restricted to={["ADMINTOOL", "ADMINLEAD"]}>
              <React.Fragment>
                <div>
                  <NavLink
                    to="/softwares"
                    style={({ isActive }) =>
                      isActive ? { color: "white" } : null
                    }
                  >
                    Softwares
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    to="/projects"
                    style={({ isActive }) =>
                      isActive ? { color: "white" } : null
                    }
                  >
                    Projects
                  </NavLink>
                </div>
              </React.Fragment>
            </Restricted>
            <NavLink
              to="/users"
              style={({ isActive }) => (isActive ? { color: "white" } : null)}
            >
              Users
            </NavLink>
            <NavLink
              to="/requestdashboard"
              style={({ isActive }) => (isActive ? { color: "white" } : null)}
            >
              Request Dashboard
            </NavLink>
          </div>
          <ProfileNavbar />
        </div>
      </div>
      <Outlet />
    </>
  );
}

const navbarStyle = {
  ".a": {
    backgroundColor: "red",
  },
  zIndex: 10,
  width: "100%",
  backgroundColor: "#0054B3",
  color: "#C3C3C3",
  position: "fixed",
  top: 0,
  ".containerNavbar": {
    maxWidth: "100rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "50px",
    padding: "0 5vw",
    margin: "auto",
  },
  a: {
    transition: "color 0.2s ease-in-out",
    ":hover": {
      color: "lightgray",
    },
  },
  ".menu": {
    display: "flex",
    gap: "1.1rem",
    alignItems: "center",
    "> div": {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
  ".buttonLink": {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  ".dropdownTrigger": {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    color: "white",
    ".imgContainer": {
      width: "2.3rem",
      height: "2.3rem",
    },
    img: {
      borderRadius: "100%",
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
  ".dropdownContent": {
    backgroundColor: "white",
    border: "1px solid black!important",
    color: "red",
  },
};
