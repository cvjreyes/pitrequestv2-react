/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";
import ProjectTree from "./tree/ProjectTree";

export default function Projects() {
  return (
    <div css={projectStyle}>
      <div>Projects</div>
      <ProjectTree />
      <Outlet />
    </div>
  );
}

const projectStyle = {
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
    width: "50vw",
    maxHeight: "75vh",
  },
};
