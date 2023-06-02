/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";

import SoftwareTree from "./tree/SoftwareTree";
import { useAuth } from "../../context/AuthContext";

export default function Softwares() {
  const {user} = useAuth()

  console.log(user)
  return (
    <div css={softwareStyle}>
      <h1>Softwares</h1>
      <SoftwareTree />
      <Outlet />
    </div>
  );
}

const softwareStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: "85vh",
  marginTop: "100px",
  ".container-tree": {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: "20px",
    alignItems: "flex-start",
    marginTop: "25px",
    width: "80vw",
  },
};
