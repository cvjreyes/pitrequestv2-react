/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { DataGrid} from "@mui/x-data-grid";

const rows = [
  { id: 1, col1: "Sean Saez Fuller", col2: "sean.saez-fuller@technipenergies.com" },
  { id: 2, col1: "Ignacio Gonzalez", col2: "ignacio.gonzalez@external.technipenergies.com" },
  { id: 3, col1: "Jorge Reyes", col2: "jorge.reyes-sztayzel@technipenergies.com" },
];

const columns = [
  { field: "col1", headerName: "Name", width: 300 },
  { field: "col2", headerName: "Email", width: 400 },
  { field: "col3", headerName: "Projects", width: 200 },
  { field: "col4", headerName: "Roles", width: 200 },
];

export default function UsersTable() {
  return (
    <div css={usersStyle}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const usersStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: "85vh",
  width: "100%",
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
