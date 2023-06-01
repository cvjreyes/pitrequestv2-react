/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import { useState } from "react";
import { useNotifications } from "reapop";
import { AiOutlineUserDelete } from "react-icons/ai";

import { client } from "../../../helpers/config";
import { useAuth } from "../../../context/AuthContext";

import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";

export default function UserDeleteDialog({ id, getUsers }) {
  const { notify } = useNotifications();

  const { user, logout } = useAuth();

  // Deletes
  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  const deleteUser = async () => {
    await client.delete(`/users/${id}`);
    notify("User deleted successfully!", "success");
    getUsers();
    if (user.id === id) {
      logout();
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
