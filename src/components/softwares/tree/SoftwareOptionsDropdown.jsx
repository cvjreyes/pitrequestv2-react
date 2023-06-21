import { Dropdown, IconButton } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useDeleteSoftware } from "../../../hooks/software";
import { useDeleteSubtask } from "../../../hooks/subtask";
import { useDeleteTask } from "../../../hooks/task";
import DeleteNodeTree from "../delete/DeleteNodeTree";

export default function SoftwareOptionsDropdown({ softwareId, taskId, subtaskId }) {
  const [openDeleteSoftware, setOpenDeleteSoftware] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);
  const [openDeleteSubtask, setOpenDeleteSubtask] = useState(false);

  const deleteSoftwareMutation = useDeleteSoftware();
  const deleteTaskMutation = useDeleteTask();
  const deleteSubtaskMutation = useDeleteSubtask();

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger>
          <IconButton size="sm">
            <FiMoreVertical />
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>
            {subtaskId ? (
              <Link
                to={`/softwares/${softwareId}/task/${taskId}/subtask/${subtaskId}/edit`}
              >
                <AiOutlineEdit /> Edit
              </Link>
            ) : taskId ? (
              <Link to={`/softwares/${softwareId}/task/${taskId}/edit`}>
                <AiOutlineEdit /> Edit
              </Link>
            ) : (
              <Link to={`/softwares/${softwareId}/edit`}>
                <AiOutlineEdit /> Edit
              </Link>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {subtaskId ? (
              <button onClick={() => setOpenDeleteSubtask(true)}>
                <AiOutlineDelete /> Delete
              </button>
            ) : taskId ? (
              <button onClick={() => setOpenDeleteTask(true)}>
                <AiOutlineDelete /> Delete
              </button>
            ) : (
              <button onClick={() => setOpenDeleteSoftware(true)}>
                <AiOutlineDelete /> Delete
              </button>
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {/* Deletes */}
      <DeleteNodeTree
        deleteNode={() => deleteSoftwareMutation.mutate({ softwareId })}
        open={openDeleteSoftware}
        setOpen={setOpenDeleteSoftware}
      />
      <DeleteNodeTree
        deleteNode={() => deleteTaskMutation.mutate({ taskId })}
        open={openDeleteTask}
        setOpen={setOpenDeleteTask}
      />
      <DeleteNodeTree
        deleteNode={() => deleteSubtaskMutation.mutate({ subtaskId })}
        open={openDeleteSubtask}
        setOpen={setOpenDeleteSubtask}
      />
    </>
  );
}
