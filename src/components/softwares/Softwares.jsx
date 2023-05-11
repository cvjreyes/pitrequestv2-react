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
    flexGrow: 1,
    padding: "20px",
    alignSelf: "flex-start",
    marginTop: "50px",
    width: "50vw",
  },
  ".container_create": {
    marginTop: "50px",
    width: "50vw",
    height: "95vh",
    borderRight: "1px solid black",
    display: "flex",
    flexDirection: "row",
    ".create_software": {
      display: "flex",
      alignItems: "start",
      justifyContent: "space-around",
      ".inputs_software": {
        display: "flex",
        flexDirection: "column",
        input: {
          margin: "10px 0",
        },
      },
    },
  },
};
