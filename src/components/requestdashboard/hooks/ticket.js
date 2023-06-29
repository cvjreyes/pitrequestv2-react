import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ticketKeys } from "./keys";
import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";

// React Query = RQ
// RQ - Get All Tickets
export function getAllTickets() {
  const tickets = useQuery({
    queryKey: ticketKeys.all,
    queryFn: () => client.get("/tickets").then((res) => res.data),
  });
  return { ...tickets, tickets: tickets.data };
}

// RQ - Get All the Keys from the Ticket (Project, Charter, Software, Admin)
export function getAllKeysTicket(projectId, softwareId) {
  const keys = useQuery(["data", projectId, softwareId], async () => {
    const project = await client.get("/projects/name");
    const charter = await client.get(`/charters/project/${projectId}`);
    const software = await client.get(
      `/projects/${projectId}/softwares/selected`
    );
    const admin = await client.get(
      `/projects/${projectId}/softwares/${softwareId}/admins/assigned`
    );

    return {
      projects: project.data.Projects,
      charters: charter.data,
      softwares: software.data,
      admins: admin.data.admins,
    };
  });
  return { ...keys, keys: keys.data };
}

// RQ - Create a Ticket
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const createdUser = useMutation({
    mutationFn: (formData) => client.post("/tickets", formData),
    onSuccess: () => {
      notify("Ticket created successfully", "success");
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
    onError: (error) => {
      notify(error.response.data.error, "error");
    },
  });
  return createdUser;
}
