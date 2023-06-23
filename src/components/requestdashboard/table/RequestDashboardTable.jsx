import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import React from "react";
import Dialogattachment from "./DialogAttachment";

export default function RequestDashboardTable({ rows }) {
  // Columns and headers
  let columns = [
    { field: "col1", headerName: "CODE", width: 100 },
    { field: "col2", headerName: "PROJECT", width: 100 },
    { field: "col3", headerName: "SOFTWARE", width: 100 },
    { field: "col4", headerName: "ASSIGNED TO", width: 200 },
    { field: "col5", headerName: "SUBJECT", width: 200 },
    { field: "col6", headerName: "DESCRIPTION", width: 400 },
    { field: "col7", headerName: "CHARTER", width: 100 },
    { field: "col8", headerName: "CREATED DATE", width: 130 },
    { field: "col9", headerName: "LAST DATE", width: 130 },
    { field: "col10", headerName: "STATUS", width: 120 },
    {
      field: "col11",
      headerName: "ATTACH",
      width: 120,
      renderCell: (params) => <Dialogattachment files={params.row.col11} />,
    },
  ];

  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div className="h-4/6">
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
