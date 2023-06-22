import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "./keys";
import { client } from "../../../helpers/config";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "reapop";

export function useAdmins() {
  const results = useQuery({
    queryKey: projectKeys.admins(),
    queryFn: () => client.get("/users/admins").then((res) => res.data),
  });
  return { ...results, admins: results.data };
}

export function useUnselectedAdmins({projectId, softwareId}) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: projectKeys.unassignedAdmins(projectId, softwareId),
    queryFn: () =>
      client
        .get(`/projects/${projectId}/softwares/${softwareId}/admins/unassigned`)
        .then((res) => res.data),
    onError: () => navigate("/projects"),
  });
  return { ...results, unassignedAdmins: results.data };
}

export function useRemoveAdmin() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ projectId, softwareId, adminId }) =>
      client.delete(`/projects/${projectId}/softwares/${softwareId}/admins/${adminId}`),
    onSuccess: () => {
      notify("Admin removed from Software successfully", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.removeAdmin });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}