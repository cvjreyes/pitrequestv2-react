/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";

import SoftwareTree from "./tree/SoftwareTree";

export default function Softwares() {
  return (
    <div css={softwareStyle}>
      <SoftwareTree />
      <Outlet />
    </div>
  );
}

const softwareStyle = {
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  ".container-tree": {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: "20px",
    alignItems: "flex-start",
    marginTop: "50px",
    width: "50vw",
  },
};
