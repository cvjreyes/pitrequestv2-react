import moment from "moment/moment";
import React from "react";
import { Outlet } from "react-router-dom";
import CreateTicket from "./create/CreateTicket";
import { getAllTickets } from "./hooks/ticket";
import RequestDashboardTable from "./table/RequestDashboardTable";

export default function RequestDashboard() {
  const { tickets } = getAllTickets();

  // Create the rows for the request dashboard table
  const rows =
    tickets?.map((ticket) => ({
      id: ticket.id,
      col1: ticket.code,
      col2: ticket.Project.code,
      col3: ticket.Software.code,
      col4: ticket.Admin.name,
      col5: ticket.subject,
      col6: ticket.description,
      col7: ticket.Charter?.name || "",
      col8: moment(ticket.created_at).format("DD-MM-YYYY"),
      col9: moment(ticket.updated_at).format("DD-MM-YYYY"),
      col10: ticket.Status.name,
      col11: ticket.TicketsAttachment,
    })) || [];

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1>Request Dashboard</h1>
      <div className="">
        <CreateTicket getTickets={tickets} />
      </div>
      <RequestDashboardTable rows={rows} />
      <Outlet />
    </div>
  );
}
