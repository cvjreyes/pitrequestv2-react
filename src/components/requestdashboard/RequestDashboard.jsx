/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import RequestDashboardTable from "./table/RequestDashboardTable";
import CreateTicket from "./create/CreateTicket";

export default function RequestDashboard() {
  const [rows, setRows] = useState([]);

  // Create the rows for the request dashboard table
  const getTickets = async () => {
    const response = await client.get("/tickets/");
    const tickets = response.data;

    const createRows = tickets.map((ticket) => ({
      id: ticket.id,
      col1: ticket.code,
      col2: ticket.Project.code,
      col3: ticket.Software.code,
      col4: ticket.Admin.name,
      col5: ticket.subject,
      col6: ticket.description,
      col7: moment(ticket.created_at).format("DD-MM-YYYY"),
      col8: moment(ticket.updated_at).format("DD-MM-YYYY"),
      col9: ticket.Status.name,
    }));

    setRows(createRows);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div css={requestDashboardStyle}>
      <h1>Request Dashboard</h1>
      <CreateTicket getTickets={getTickets} />
      <RequestDashboardTable rows={rows} />
      <Outlet />
    </div>
  );
}

const requestDashboardStyle = {
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
  },
};
