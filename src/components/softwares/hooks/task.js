import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";
import { softwareKeys } from "./keys";
import { useNavigate } from "react-router-dom";

export function useTask(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: softwareKeys.task(id),
    queryFn: () => client.get(`/tasks/${id}`).then((res) => res.data),
    onError: () => navigate("/softwares"),
  });
  return { ...results, task: results.data };
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ name, softwareId }) =>
      client.post("/tasks", { name, softwareId }),
    onSuccess: () => {
      notify("Create Task successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ taskId, name, softwareId }) =>
      client.put(`/tasks/${taskId}`, { name, softwareId }),
    onSuccess: () => {
      notify("Edit Task successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ taskId }) => client.delete(`/tasks/${taskId}`),
    onSuccess: () => {
      notify("Deleted Task successfully", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}
