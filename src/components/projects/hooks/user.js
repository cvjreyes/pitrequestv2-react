import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "./keys";
import { client } from "../../../helpers/config";
import { useNavigate } from "react-router-dom";

export function useAdmins() {
  const results = useQuery({
    queryKey: projectKeys.admins(),
    queryFn: () => client.get("/users/admins").then((res) => res.data),
  });
  return { ...results, admins: results.data };
}

export function useUnselectedAdmins({projectId, softwareId}) {
  console.log(projectId, softwareId);
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
