import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import CreateTicket from "./create/CreateTicket";
import RequestDashboardTable from "./table/RequestDashboardTable";

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
      col10: ticket.TicketsAttachment,
    }));

    setRows(createRows);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1>Request Dashboard</h1>
      <div className="">
        <CreateTicket getTickets={getTickets} />
      </div>
      <RequestDashboardTable rows={rows} />
      <Outlet />
    </div>
  );
}
