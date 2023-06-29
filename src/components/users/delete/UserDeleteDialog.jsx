import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import { useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";

import React from "react";
import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";
import { useDeleteUser } from "../hooks/user";

export default function UserDeleteDialog({ id }) {
  // Deletes
  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  const deleteUserMutation = useDeleteUser();

  return (
    <div>
      <button
        onClick={() => {
          setOpenDeleteUser(true);
        }}>
        <AiOutlineUserDelete fontSize={24} />
      </button>
      <DeleteNodeTree
        deleteNode={() => deleteUserMutation.mutate({ id })}
        open={openDeleteUser}
        setOpen={setOpenDeleteUser}
      />
    </div>
  );
}
