/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineEdit } from "react-icons/ai";

export default function UsersTable() {
  const rows = [
    {
      id: 1,
      col1: "Sean Saez Fuller",
      col2: "sean.saez-fuller@technipenergies.com",
    },
    {
      id: 2,
      col1: "Ignacio Gonzalez",
      col2: "ignacio.gonzalez@external.technipenergies.com",
    },
    {
      id: 3,
      col1: "Jorge Reyes",
      col2: "jorge.reyes-sztayzel@technipenergies.com",
    },
  ];

  const columns = [
    { field: "col1", headerName: "Name", width: 400 },
    { field: "col2", headerName: "Email", width: 400 },
    { field: "col3", headerName: "Projects", width: 200 },
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
