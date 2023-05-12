/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";


export default function Projects() {
  return (
    <div css={projectStyle}>
      <div>Projects</div>
      <Outlet />
    </div>
  );
}

const projectStyle = {
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  marginTop:"100px",
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