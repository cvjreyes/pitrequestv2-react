/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineEdit } from "react-icons/ai";
import { useEffect, useState } from "react";
import { client } from "../../../helpers/config";

export default function UsersTable() {
  const [rows, setRows] = useState([]);

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
        <div className="edit_btn" onClick={() => console.log(params.row.id)}>
          <AiOutlineEdit /> {/* Componente de react-icons */}
        </div>
      ),
    },
  ];

  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  const getUsers = async () => {
    const response = await client.get("/users/projects/roles");
    const users = response.data;

    const formattedRows = users.map((user) => ({
      id: user.id,
      col1: user.name,
      col2: user.email,
      col3: user.ProjectUsers.map(
        (projectUser) => projectUser.Project.name
      ).join(", "),
      col4: user.UsersRol.map((userRol) => userRol.rol.name).join(", "),
    }));

    setRows(formattedRows);
  };

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
