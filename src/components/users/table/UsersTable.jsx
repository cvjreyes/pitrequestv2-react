import { useEffect, useState } from "react";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { client } from "../../../helpers/config";

import UserEditModal from "../edit/UserEditModal";
import { useAuth } from "../../../context/AuthContext";
import UserDeleteDialog from "../delete/UserDeleteDialog";
import { checkUserRoles } from "../../authentication/Restricted";

export default function UsersTable() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);

  // Columns and headers
  const columns = [
    { field: "col1", headerName: "Name", width: 250 },
    { field: "col2", headerName: "Email", width: 400 },
    { field: "col3", headerName: "Projects", width: 370 },
    { field: "col4", headerName: "Roles", width: 300 },
    checkUserRoles(user.roles, ["ADMINTOOL", "ADMINLEAD"]) && {
      field: "col5",
      headerName: "Actions",
      width: 70,
      disabled: true,
      renderCell: (params) => (
        <div className="edit_btn">
          <UserEditModal
            users={rows}
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
      headerName: "Delete",
      width: 70,
      renderCell: (params) => (
        <div className="edit_btn">
          <UserDeleteDialog id={params.row.id} getUsers={getUsers} />
        </div>
      ),
    },
    ,
  ];

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
