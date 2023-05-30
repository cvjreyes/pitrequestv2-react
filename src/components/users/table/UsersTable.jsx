/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { client } from "../../../helpers/config";
import UserEditModal from "../edit/UserEditModal";

export default function UsersTable() {
  const [rows, setRows] = useState([]);

  const getUsers = async () => {
    const response = await client.get("/users/projects/roles");
    const users = response.data;

    const formattedRows = users.map((user) => ({
      id: user.id,
      col1: user.name,
      col2: user.email,
      col3: user.ProjectUsers.map(
        (projectUser) => projectUser.Project.code
      ).join(", "),
      col4: user.UsersRol.map((userRol) => userRol.rol.name).join(", "),
    }));

    setRows(formattedRows);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    { field: "col1", headerName: "Name", width: 300 },
    { field: "col2", headerName: "Email", width: 450 },
    { field: "col3", headerName: "Projects", width: 450 },
    { field: "col4", headerName: "Roles", width: 200 },
    {
      field: "col5",
      headerName: "Actions",
      width: 70,
      renderCell: (params) => (
        <div className="edit_btn" >
          <UserEditModal
            getUsers={getUsers}
            id={params.row.id}
            userProjects={params.row.col3}
            userRoles={params.row.col4}
          />
        </div>
      ),
    },
  ];

  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

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
