/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Outlet } from "react-router-dom";
import UsersTable from "./table/UsersTable";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../general";

export default function Users() {
  return (
    <div css={usersStyle}>
      <h1>Users</h1>
      <Button className="add_user">
        <AiOutlinePlus />
        <label>Add new user</label>
      </Button>
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
  ".add_user": {
    display: "flex",
    height: "5vh",
    width: "150px",
    alignItems: "center",
    alignSelf: "end",
    marginRight: "10%",
  },
  ".container-table": {
    flexGrow: 1,
    marginTop: "25px",
    width: "80vw",
  },
  ".edit_btn": {
    display: "flex",
    width: "5vw",
    justifyContent: "center",
    alignItems: "center",
  },
};
