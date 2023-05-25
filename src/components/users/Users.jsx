/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";
import UsersTable from "./table/UsersTable";

export default function Users() {
  return (
    <div css={usersStyle}>
      <h1>Users</h1>
      <UsersTable />
      <Outlet />
    </div>
  );
}

const usersStyle = {
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
