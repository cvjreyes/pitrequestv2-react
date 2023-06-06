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

import Restricted from "../../authentication/Restricted";
import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";
import AddAdminSoftwareSettingsModal from "../create/AddAdminSoftwareSettingsModal";
import AddSoftwareSettingsModal from "../create/AddSoftwareSettingsModal";
import CharterSettingsModal from "../create/CharterSettingsModal";
import AdminChangeModal from "../edit/AdminChangeModal";
import CharterEditModal from "../edit/CharterEditModal";
import ProjectEditModal from "../edit/ProjectEditModal";

export default function DropdownMenuProject({
  id,
  adminId,
  softwareId,
  projectId,
  getProjectTree,
  node,
}) {
  const { notify } = useNotifications();

  // Create modal
  const [openCharter, setOpenCharter] = useState(false);
  const [openSoftware, setOpenSoftware] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  // Edit modal
  const [openEditProject, setOpenEditProject] = useState(false);
  const [openEditCharter, setOpenEditCharter] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);

  // Delete modal
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [openDeleteCharter, setOpenDeleteCharter] = useState(false);
  const [openDeleteAdmin, setOpenDeleteAdmin] = useState(false);
  const [openDeleteSoftware, setOpenDeleteSoftware] = useState(false);

  const deleteProject = async () => {
    try {
      await client.delete(`/projects/${id}`);
      notify("Project deleted successfully!", "success");
      getProjectTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
    }
  };

  const deleteCharter = async () => {
    try {
      await client.delete(`/charters/${id}`);
      notify("Charter deleted successfully!", "success");
      getProjectTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
    }
  };

  const removeAdmin = async () => {
    try {
      await client.put(
        `/projects/${projectId}/softwares/${softwareId}/admins/${adminId}`,
        null
      );
      notify("Admin removed successfully!", "success");
      getProjectTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
    }
  };

  const removeSoftware = async () => {
    try {
      await client.delete(`/projects/${projectId}/softwares/${softwareId}`);
      notify("Software removed successfully!", "success");
      getProjectTree();
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
    }
  };

  return (
    <div>
      <DropdownMenu.Root>
        <Restricted to={["ADMINLEAD"]}>
          <DropdownMenu.Trigger asChild>
            <button aria-label="Customise options">
              <BsThreeDotsVertical className="icon" />
            </button>
          </DropdownMenu.Trigger>
        </Restricted>
        <DropdownMenu.Portal>
          <DropdownMenu.Content css={dropdownMenuStyle} sideOffset={5}>
            {/* Create and add actions */}
            <DropdownMenu.Item className="DropdownMenuItem" asChild>
              {node === "charterfolder" ? (
                <button onClick={() => setOpenCharter(true)}>
                  Add Charter
                </button>
              ) : node === "softwarefolder" ? (
                <button onClick={() => setOpenSoftware(true)}>
                  Add Software
                </button>
              ) : (
                node === "adminfolder" && (
                  <button onClick={() => setOpenAdmin(true)}>Add Admin</button>
                )
              )}
            </DropdownMenu.Item>
            {/* Edit actions */}
            {node === "project" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenEditProject(true)}>Edit</button>
              </DropdownMenu.Item>
            ) : node === "admin" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenEditAdmin(true)}>
                  Change Admin
                </button>
              </DropdownMenu.Item>
            ) : (
              node === "charter" && (
                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                  <button onClick={() => setOpenEditCharter(true)}>Edit</button>
                </DropdownMenu.Item>
              )
            )}
            {/* Delete actions */}
            {node === "project" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteProject(true)}>
                  Delete
                </button>
              </DropdownMenu.Item>
            ) : node === "software" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteSoftware(true)}>
                  Remove
                </button>
              </DropdownMenu.Item>
            ) : node === "charter" ? (
              <DropdownMenu.Item className="DropdownMenuItem" asChild>
                <button onClick={() => setOpenDeleteCharter(true)}>
                  Delete
                </button>
              </DropdownMenu.Item>
            ) : (
              node === "admin" && (
                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                  <button onClick={() => setOpenDeleteAdmin(true)}>
                    Remove
                  </button>
                </DropdownMenu.Item>
              )
            )}
            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {/* Modales para crear y se separan para ocultar el dropdownMenu.Portal */}
      <CharterSettingsModal
        id={id}
        getProjectTree={getProjectTree}
        open={openCharter}
        setOpen={setOpenCharter}
      />
      <AddSoftwareSettingsModal
        id={id}
        getProjectTree={getProjectTree}
        open={openSoftware}
        setOpen={setOpenSoftware}
      />
      <AddAdminSoftwareSettingsModal
        id={id}
        getProjectTree={getProjectTree}
        softwareId={softwareId}
        open={openAdmin}
        setOpen={setOpenAdmin}
      />
      {/* Modales para editar */}
      <ProjectEditModal
        id={id}
        getProjectTree={getProjectTree}
        open={openEditProject}
        setOpen={setOpenEditProject}
      />
      <CharterEditModal
        id={id}
        getProjectTree={getProjectTree}
        open={openEditCharter}
        setOpen={setOpenEditCharter}
      />
      <AdminChangeModal
        projectId={projectId}
        softwareId={softwareId}
        adminId={adminId}
        getProjectTree={getProjectTree}
        open={openEditAdmin}
        setOpen={setOpenEditAdmin}
      />
      {/* Modales para eliminar */}
      <DeleteNodeTree
        deleteNode={deleteProject}
        open={openDeleteProject}
        setOpen={setOpenDeleteProject}
      />
      <DeleteNodeTree
        deleteNode={removeSoftware}
        open={openDeleteSoftware}
        setOpen={setOpenDeleteSoftware}
      />
      <DeleteNodeTree
        deleteNode={deleteCharter}
        open={openDeleteCharter}
        setOpen={setOpenDeleteCharter}
      />
      <DeleteNodeTree
        deleteNode={removeAdmin}
        open={openDeleteAdmin}
        setOpen={setOpenDeleteAdmin}
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
    width: "150px",
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
