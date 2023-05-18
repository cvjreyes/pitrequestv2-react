/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNotifications } from "reapop";
import { BsThreeDotsVertical } from "react-icons/bs";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import SoftwareSettingsModal from "../create/SoftwareSettingsModal";
import TaskSettingsModal from "../create/TaskSettingsModal";
import DeleteNodeTree from "../delete/DeleteNodeTree";
import { client } from "../../../helpers/config";
import { useState } from "react";

export default function DropdownMenuSoftware({ id, getSoftwareTree, node }) {
  const { notify } = useNotifications();

  const [openTask, setOpenTask] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);

  const deleteSoftware = async () => {
    await client.delete(`/software/delete/${id}`);
    notify("Software deleted successfully!", "success");
    getSoftwareTree();
  };

  const deleteTask = async () => {
    await client.delete(`/software/delete/task/${id}`);
    notify("Task deleted successfully!", "success");
    getSoftwareTree();
  };

  const deleteSubtask = async () => {
    await client.delete(`/software/delete/task/subtask/${id}`);
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
            {node === "software" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <DeleteNodeTree deleteNode={deleteSoftware} />
              </DropdownMenu.Item>
            ) : node === "task" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <DeleteNodeTree deleteNode={deleteTask} />
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <DeleteNodeTree deleteNode={deleteSubtask} />
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
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
  minWidth: "140px",
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
    fontSize: "13px",
    lineHeight: "1",
    color: "var(--violet11)",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    height: "25px",
    padding: "0 5px",
    position: "relative",
    paddingLeft: "25px",
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
