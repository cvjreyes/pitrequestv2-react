import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../helpers/config";
import { useNotifications } from "reapop";
import { useNavigate } from "react-router-dom";
import { softwareKeys } from "./keys";

export function useSoftwareTree() {
  const results = useQuery({
    queryKey: softwareKeys.tree(),
    queryFn: () => client.get("/softwares/tree").then((res) => res.data),
  });
  return { ...results, softwareTree: results.data };
}

export function useSoftware(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: softwareKeys.detail(id),
    queryFn: () => client.get(`/softwares/${id}`).then((res) => res.data),
    onError: () => navigate("/softwares"),
  });
  return { ...results, software: results.data };
}

export function useCreateSoftware() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ formCreateSoftware }) =>
      client.post("/softwares/", formCreateSoftware),
    onSuccess: () => {
      notify("Create Software successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.tree() });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useUpdateSoftware() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ softwareId, formUpdateSoftware }) =>
      client.put(`/softwares/${softwareId}`, formUpdateSoftware),
    onSuccess: () => {
      notify("Edit Software successfully done", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useDeleteSoftware() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ softwareId }) => client.delete(`/softwares/${softwareId}`),
    onSuccess: () => {
      notify("Deleted Software successfully", "success");
      queryClient.invalidateQueries({ queryKey: softwareKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}
