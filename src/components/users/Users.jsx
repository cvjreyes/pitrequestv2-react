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
  ".container-table": {
    flexGrow: 1,
    marginTop: "25px",
    width: "80vw",
    maxHeight: "80vh",
  },
  ".edit_btn": {
    display: "flex",
    width: "5vw",
    justifyContent: "center",
    alignItems: "center",
  },
};
