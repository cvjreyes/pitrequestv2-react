import React, { useEffect, useState } from "react";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { client } from "../../../helpers/config";
import { useAuth } from "../../../context/AuthContext";
import { checkUserRoles } from "../../authentication/Restricted";

import UserEditModal from "../edit/UserEditModal";
import UserDeleteDialog from "../delete/UserDeleteDialog";

export default function UsersTable() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);

  const hasRoles = checkUserRoles(user.roles, ["ADMINTOOL", "ADMINLEAD"]);
  // Columns and headers
  let columns = [
    { field: "col1", headerName: "NAME", width: 250 },
    { field: "col2", headerName: "EMAIL", width: 500 },
    { field: "col3", headerName: "PROJECTS", width: 370 },
    { field: "col4", headerName: "ROLES", width: 300 },
  ];

  if (hasRoles) {
    columns.push(
      {
        field: "col5",
        headerName: "ACTIONS",
        width: 80,
        disabled: true,
        renderCell: (params) => (
          <div className="edit_btn">
            <UserEditModal
              users={rows}
              email={params.row.col2}
              getUsers={getUsers}
              id={params.row.id}
              userProjects={params.row.col3}
              userRoles={params.row.col4.filter((role) => role !== "USER")}
            />
          </div>
        ),
      },
      {
        field: "col6",
        headerName: "DELETE",
        width: 70,
        renderCell: (params) => (
          <div className="edit_btn">
            <UserDeleteDialog id={params.row.id} getUsers={getUsers} />
          </div>
        ),
      }
    );
  }

  // Create the rows for the users table
  const getUsers = async () => {
    const response = await client.get("/users/projects/roles");
    const users = response.data;

    const createRows = users.map((user) => ({
      id: user.id,
      col1: user.name,
      col2: user.email,
      col3: user.ProjectUsers.map((projectUser) => projectUser.Project.code),
      col4: user.UsersRole.map((userRole) => userRole.role.name),
    }));

    setRows(createRows);
  };

  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container-table">
      <DataGrid
        {...data}
        rows={rows}
        columns={columns}
        checkboxSelection
        loading={loading}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
