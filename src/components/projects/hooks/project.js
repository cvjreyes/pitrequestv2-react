import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { client } from "../../../helpers/config";
import { projectKeys } from "./keys";

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