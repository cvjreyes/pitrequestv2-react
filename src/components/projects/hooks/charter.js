import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { projectKeys } from "./keys";
import { client } from "../../../helpers/config";
import { useNotifications } from "reapop";

export function useCharter(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: projectKeys.charter(id),
    queryFn: () => client.get(`/charters/${id}`).then((res) => res.data),
    onError: () => navigate("/projects"),
  });
  return { ...results, charter: results.data };
}

export function useCreateCharter() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: (form) =>
      client.post("/charters", form),
    onSuccess: () => {
      notify("Create Charter successfully done", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.tree() });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useUpdateCharter() {
    const queryClient = useQueryClient();
    const { notify } = useNotifications();
  
    const results = useMutation({
      mutationFn: ({ charterId, name, projectId }) =>
        client.put(`/charters/${charterId}`, { name, projectId }),
      onSuccess: () => {
        notify("Edit Charter successfully done", "success");
        queryClient.invalidateQueries({ queryKey: projectKeys.all });
      },
      onError: (data) => {
        notify(data.response.data.error, "error");
      },
    });
  
    return results;
  }

  export function useDeleteCharter() {
    const queryClient = useQueryClient();
    const { notify } = useNotifications();
  
    const results = useMutation({
      mutationFn: ({ charterId }) => client.delete(`/charters/${charterId}`),
      onSuccess: () => {
        notify("Deleted Charter successfully", "success");
        queryClient.invalidateQueries({ queryKey: projectKeys.all });
      },
      onError: (data) => {
        notify(data.response.data.error, "error");
      },
    });
  
    return results;
  }