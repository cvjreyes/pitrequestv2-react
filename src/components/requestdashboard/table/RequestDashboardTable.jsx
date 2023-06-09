import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

export default function RequestDashboardTable({ rows }) {
  // Columns and headers
  let columns = [
    { field: "col1", headerName: "CODE", width: 100 },
    { field: "col2", headerName: "PROJECT", width: 100 },
    { field: "col3", headerName: "SOFTWARE", width: 100 },
    { field: "col4", headerName: "ASSIGNED TO", width: 200 },
    { field: "col5", headerName: "SUBJECT", width: 200 },
    { field: "col6", headerName: "DESCRIPTION", width: 400 },
    { field: "col7", headerName: "CREATED DATE", width: 130 },
    { field: "col8", headerName: "LAST DATE", width: 130 },
    { field: "col9", headerName: "STATUS", width: 120 },
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
