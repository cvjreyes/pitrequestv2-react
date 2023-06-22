import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "./keys";
import { client } from "../../../helpers/config";

export function useAdmins() {
    const results = useQuery({
      queryKey: projectKeys.admins(),
      queryFn: () => client.get("/users/admins").then((res) => res.data),
    });
    return { ...results, admins: results.data };
  }