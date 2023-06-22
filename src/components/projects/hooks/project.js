import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { client } from "../../../helpers/config";
import { projectKeys } from "./keys";
import { useNotifications } from "reapop";

export function useProjectTree() {
  const results = useQuery({
    queryKey: projectKeys.tree(),
    queryFn: () => client.get("/projects/tree").then((res) => res.data),
  });
  return { ...results, projectTree: results.data };
}

export function useProject(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => client.get(`/projects/${id}`).then((res) => res.data),
    onError: () => navigate("/projects"),
  });
  return { ...results, project: results.data };
}

export function useUnselectedSoftwares(id) {
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: projectKeys.software(id),
    queryFn: () => client.get(`/projects/${id}/softwares/unselected`).then((res) => res.data),
    onError: () => navigate("/projects"),
  });
  return { ...results, unselectedSoftware: results.data };
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ formCreateProject }) =>
      client.post("/projects/", formCreateProject),
    onSuccess: () => {
      notify("Create Project successfully done", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.tree() });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useAddSoftwareToProject() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  const results = useMutation({
    mutationFn: ({ formAddSoftware }) =>
      client.post("/projects/softwares", formAddSoftware),
    onSuccess: () => {
      notify("Software added successfully", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.tree() });
      navigate("/projects")
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ projectId, formUpdateProject }) =>
      client.put(`/projects/${projectId}`, formUpdateProject),
    onSuccess: () => {
      notify("Edit Project successfully done", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const results = useMutation({
    mutationFn: ({ projectId }) => client.delete(`/projects/${projectId}`),
    onSuccess: () => {
      notify("Deleted Project successfully", "success");
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });

  return results;
}