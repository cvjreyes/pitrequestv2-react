import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import { useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import { useNotifications } from "reapop";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../helpers/config";

import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";

export default function UserDeleteDialog({ id, getUsers }) {
  const { notify } = useNotifications();

  const { user, logout } = useAuth();

  // Deletes
  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  const deleteUser = async () => {
    try {
      await client.delete(`/users/${id}`);
      notify("User deleted successfully!", "success");
      getUsers();
      if (user.id === id) {
        logout();
      }
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
    }
  };

  return (
    <div>
      <button onClick={() => setOpenDeleteUser(true)}>
        <AiOutlineUserDelete fontSize={24} />
      </button>
      <DeleteNodeTree
        deleteNode={deleteUser}
        open={openDeleteUser}
        setOpen={setOpenDeleteUser}
      />
    </div>
  );
}
