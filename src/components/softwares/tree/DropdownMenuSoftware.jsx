/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";
import SoftwareSettingsModal from "../create/SoftwareSettingsModal";
import TaskSettingsModal from "../create/TaskSettingsModal";
import DeleteNodeTree from "../delete/DeleteNodeTree";
import SoftwareEditModal from "../edit/SoftwareEditModal";
import SubTaskEditModal from "../edit/SubTaskEditModal";
import TaskEditModal from "../edit/TaskEditModal";

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
    await client.delete(`/softwares/${id}`);
    notify("Software deleted successfully!", "success");
    getSoftwareTree();
  };

  const deleteTask = async () => {
    await client.delete(`/tasks/${id}`);
    notify("Task deleted successfully!", "success");
    getSoftwareTree();
  };

  const deleteSubtask = async () => {
    await client.delete(`/subtasks/${id}`);
    notify("Subtask deleted successfully!", "success");
    getSoftwareTree();
  };

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button aria-label="Customise options">
            <BsThreeDotsVertical className="icon" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content css={dropdownMenuStyle} sideOffset={5}>
            {/* ADD */}
            {node !== "subtask" && (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                {node === "software" ? (
                  <button onClick={() => setOpenTask(true)}>Add Task</button>
                ) : (
                  <button onClick={() => setOpenSubtask(true)}>
                    Add SubTask
                  </button>
                )}
              </DropdownMenu.Item>
            )}
            {/* EDIT */}
            {node === "software" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenEditSoftware(true)}>Edit</button>
              </DropdownMenu.Item>
            ) : node === "task" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenEditTask(true)}>Edit</button>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenEditSubtask(true)}>Edit</button>
              </DropdownMenu.Item>
            )}
            {/* DELETE */}
            {node === "software" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteSoftware(true)}>
                  Delete
                </button>
              </DropdownMenu.Item>
            ) : node === "task" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteTask(true)}>Delete</button>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteSubtask(true)}>
                  Delete
                </button>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
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
        setOpen={setOpenEditSoftware}
      />
      <DeleteNodeTree
        deleteNode={deleteTask}
        open={openDeleteTask}
        setOpen={setOpenEditTask}
      />
      <DeleteNodeTree
        deleteNode={deleteSubtask}
        open={openDeleteSubtask}
        setOpen={setOpenEditSubtask}
      />
    </div>
  );
}

const slideUpAndFade = keyframes`
from {
  opacity: 0;
  transform: translateY(2px);
}
to {
  opacity: 1;
  transform: translateY(0);
}`;

const slideRightAndFade = keyframes`
from {
  opacity: 0;
  transform: translateX(-2px);
}
to {
  opacity: 1;
  transform: translateX(0);
}`;

const slideDownAndFade = keyframes`
from {
  opacity: 0;
  transform: translateY(-2px);
}
to {
  opacity: 1;
  transform: translateY(0);
}`;

const slideLeftAndFade = keyframes`
from {
  opacity: 0;
  transform: translateX(2px);
}
to {
  opacity: 1;
  transform: translateX(0);
}`;

const dropdownMenuStyle = {
  minWidth: "auto",
  backgroundColor: "white",
  borderRadius: "6px",
  padding: "5px",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  "&[data-side='top']": {
    animationName: `${slideDownAndFade}`,
  },
  "&[data-side='right']": {
    animationName: `${slideLeftAndFade}`,
  },
  "&[data-side='bottom']": {
    animationName: `${slideUpAndFade}`,
  },
  "&[data-side='left']": {
    animationName: `${slideRightAndFade}`,
  },
  ".DropdownMenuItem": {
    fontSize: "15px",
    lineHeight: "1",
    color: "var(--violet11)",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: "25px",
    padding: "0 5px",
    position: "relative",
    userSelect: "none",
    outline: "none",
    margin: "5px 0",
    "&[data-disabled]": {
      color: "var(--violet1)",
      backgroundColor: "var(--violet9)",
    },
    "&[data-highlighted]": {
      color: "var(--violet1)",
      backgroundColor: "var(--violet9)",
    },
  },
  ".DropdownMenuArrow": {
    fill: "white",
  },
};
