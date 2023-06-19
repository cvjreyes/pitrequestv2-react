import { Dropdown, IconButton } from "@nachogonzalezv99/ui-library";
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { useNotifications } from "reapop";

import { client } from "../../../helpers/config";

import Restricted from "../../authentication/Restricted";

import SoftwareSettingsModal from "../create/SoftwareSettingsModal";
import SoftwareEditModal from "../edit/SoftwareEditModal";

import TaskSettingsModal from "../create/TaskSettingsModal";
import TaskEditModal from "../edit/TaskEditModal";

import SubTaskEditModal from "../edit/SubTaskEditModal";

import DeleteNodeTree from "../delete/DeleteNodeTree";

export default function DropdownMenuSoftware({ id, getSoftwareTree, node }) {
  const { notify } = useNotifications();

  // Create
  const [openTask, setOpenTask] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);

  // Updates
  const [openEditSoftware, setOpenEditSoftware] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [openEditSubtask, setOpenEditSubtask] = useState(false);

  // Deletes
  const [openDeleteSoftware, setOpenDeleteSoftware] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);
  const [openDeleteSubtask, setOpenDeleteSubtask] = useState(false);

  const deleteSoftware = async () => {
    try {
      await client.delete(`/softwares/${id}`);
      notify("Software deleted successfully!", "success");
      getSoftwareTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      getSoftwareTree();
      notify(errorMessage, "error");
    }
  };

  const deleteTask = async () => {
    try {
      await client.delete(`/tasks/${id}`);
      notify("Task deleted successfully!", "success");
      getSoftwareTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      getSoftwareTree();
      notify(errorMessage, "error");
    }
  };

  const deleteSubtask = async () => {
    try {
      await client.delete(`/subtasks/${id}`);
      notify("Subtask deleted successfully!", "success");
      getSoftwareTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      getSoftwareTree();
      notify(errorMessage, "error");
    }
  };

  return (
    <div>
      <Dropdown>
        <Restricted to={["ADMINLEAD"]}>
          <Dropdown.Trigger>
            <IconButton>
              <AiOutlineMore />
            </IconButton>
          </Dropdown.Trigger>
        </Restricted>
        <Dropdown.Menu>
          {/* ADD */}
          {node !== "subtask" && (
            <Dropdown.Item>
              {node === "software" ? (
                <button onClick={() => setOpenTask(true)}>Add Task</button>
              ) : (
                <button onClick={() => setOpenSubtask(true)}>
                  Add SubTask
                </button>
              )}
            </Dropdown.Item>
          )}
          {/* EDIT */}
          {node === "software" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenEditSoftware(true)}>Edit</button>
            </Dropdown.Item>
          ) : node === "task" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenEditTask(true)}>Edit</button>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item>
              <button onClick={() => setOpenEditSubtask(true)}>Edit</button>
            </Dropdown.Item>
          )}
          {/* DELETE */}
          {node === "software" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteSoftware(true)}>
                Delete
              </button>
            </Dropdown.Item>
          ) : node === "task" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteTask(true)}>Delete</button>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteSubtask(true)}>Delete</button>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {/* Modales para crear */}
      <SoftwareSettingsModal
        id={id}
        getSoftwareTree={getSoftwareTree}
        open={openTask}
        setOpen={setOpenTask}
      />
      <TaskSettingsModal
        id={id}
        getSoftwareTree={getSoftwareTree}
        open={openSubtask}
        setOpen={setOpenSubtask}
      />
      {/* Modales para editar */}
      <SoftwareEditModal
        getSoftwareTree={getSoftwareTree}
        open={openEditSoftware}
        setOpen={setOpenEditSoftware}
        id={id}
      />
      <TaskEditModal
        id={id}
        getSoftwareTree={getSoftwareTree}
        open={openEditTask}
        setOpen={setOpenEditTask}
      />
      <SubTaskEditModal
        id={id}
        getSoftwareTree={getSoftwareTree}
        open={openEditSubtask}
        setOpen={setOpenEditSubtask}
      />
      {/* Modales para eliminar */}
      <DeleteNodeTree
        deleteNode={deleteSoftware}
        open={openDeleteSoftware}
        setOpen={setOpenDeleteSoftware}
      />
      <DeleteNodeTree
        deleteNode={deleteTask}
        open={openDeleteTask}
        setOpen={setOpenDeleteTask}
      />
      <DeleteNodeTree
        deleteNode={deleteSubtask}
        open={openDeleteSubtask}
        setOpen={setOpenDeleteSubtask}
      />
    </div>
  );
}
