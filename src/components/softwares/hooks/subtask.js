import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";
import { softwareKeys } from "./keys";
import { useNavigate } from "react-router-dom";

export function useSubtask(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: softwareKeys.subtask(id),
    queryFn: () => client.get(`/subtasks/${id}`).then((res) => res.data),
    onError: () => navigate("/softwares"),
  });
  return { ...results, subtask: results.data };
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ name, taskId }) =>
      client.post("/subtasks", { name, taskId }),
    onSuccess: () => {
      notify("Create Subtask successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ subtaskId, name, taskId }) =>
      client.put(`/subtasks/${subtaskId}`, { name, taskId }),
    onSuccess: () => {
      notify("Edit Subtask successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ subtaskId }) => client.delete(`/subtasks/${subtaskId}`),
    onSuccess: () => {
      notify("Deleted Subtask successfully", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}
