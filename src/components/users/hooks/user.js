import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { client } from "../../../helpers/config";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "reapop";

// React Query - Get Users
export function getAllUsers() {
  const { data } = useQuery({
    queryKey: userKeys.all,
    queryFn: () => client.get("/users/projects/roles").then((res) => res.data),
  });
  return { ...data, usersData: data };
}

// React Query - Update Projects and Roles from a user
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const mutation = useMutation({
    mutationFn: ({ email, userId, projectIds, roleIds }) =>
      client.put(`/users/projects/roles`, {
        email,
        userId,
        projectIds,
        roleIds,
      }),
    onSuccess: () => {
      notify("Edit User successfully done", "success");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (data) => {
      notify(data.response.data.error, "error");
    },
  });
  return mutation;
}

// React Query - Delete a User
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const deletedUser = useMutation({
    mutationFn: ({ id }) => client.delete(`/users/${id}`),
    onSuccess: () => {
      notify("Deleted User successfully", "success");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      notify(error.response.data.error, "error");
    },
  });

  return deletedUser;
}
