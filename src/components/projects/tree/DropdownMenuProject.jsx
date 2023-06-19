import { Dropdown, IconButton } from "@nachogonzalezv99/ui-library";
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { useNotifications } from "reapop";

import { client } from "../../../helpers/config";

import ProjectEditModal from "../edit/ProjectEditModal";

import CharterSettingsModal from "../create/CharterSettingsModal";
import CharterEditModal from "../edit/CharterEditModal";

import AddAdminSoftwareSettingsModal from "../create/AddAdminSoftwareSettingsModal";
import AddSoftwareSettingsModal from "../create/AddSoftwareSettingsModal";

import AdminChangeModal from "../edit/AdminChangeModal";

import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";

export default function DropdownProject({
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
      await client.delete(
        `/projects/${projectId}/softwares/${softwareId}/admins/${adminId}`
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
      <Dropdown>
        <Dropdown.Trigger>
          <IconButton>
            <AiOutlineMore />
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Menu>
          {/* Create and add actions */}
          <Dropdown.Item>
            {node === "charterfolder" ? (
              <button onClick={() => setOpenCharter(true)}>Add Charter</button>
            ) : node === "softwarefolder" ? (
              <button onClick={() => setOpenSoftware(true)}>
                Add Software
              </button>
            ) : (
              node === "adminfolder" && (
                <button onClick={() => setOpenAdmin(true)}>Add Admin</button>
              )
            )}
          </Dropdown.Item>
          {/* Edit actions */}
          {node === "project" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenEditProject(true)}>Edit</button>
            </Dropdown.Item>
          ) : node === "admin" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenEditAdmin(true)}>
                Change Admin
              </button>
            </Dropdown.Item>
          ) : (
            node === "charter" && (
              <Dropdown.Item>
                <button onClick={() => setOpenEditCharter(true)}>Edit</button>
              </Dropdown.Item>
            )
          )}
          {/* Delete actions */}
          {node === "project" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteProject(true)}>Delete</button>
            </Dropdown.Item>
          ) : node === "software" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteSoftware(true)}>
                Remove
              </button>
            </Dropdown.Item>
          ) : node === "charter" ? (
            <Dropdown.Item>
              <button onClick={() => setOpenDeleteCharter(true)}>Delete</button>
            </Dropdown.Item>
          ) : (
            node === "admin" && (
              <Dropdown.Item>
                <button onClick={() => setOpenDeleteAdmin(true)}>Remove</button>
              </Dropdown.Item>
            )
          )}
        </Dropdown.Menu>
      </Dropdown>
      {/* Modales para crear y se separan para ocultar el Dropdown.Portal */}
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
