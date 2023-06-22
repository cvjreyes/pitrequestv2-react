import { Dropdown, IconButton } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useDeleteCharter } from "../hooks/charter";
import { useDeleteProject } from "../hooks/project";

import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";

export default function ProjectOptionsDropdown({ projectId, charterId }) {
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [openDeleteCharter, setOpenDeleteCharter] = useState(false);

  const deleteProjectMutation = useDeleteProject();
  const deleteCharterMutation = useDeleteCharter();

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
            {charterId ? (
              <Link to={`/projects/${projectId}/charter/${charterId}/edit`}>
                <AiOutlineEdit /> Edit
              </Link>
            ) : (
              <Link to={`/projects/${projectId}/edit`}>
                <AiOutlineEdit /> Edit
              </Link>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {charterId ? (
              <button onClick={() => setOpenDeleteCharter(true)}>
                <AiOutlineDelete /> Delete
              </button>
            ) : (
              <button onClick={() => setOpenDeleteProject(true)}>
                <AiOutlineDelete /> Delete
              </button>
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {/* Deletes */}
      <DeleteNodeTree
        deleteNode={() => deleteProjectMutation.mutate({ projectId })}
        open={openDeleteProject}
        setOpen={setOpenDeleteProject}
      />
      <DeleteNodeTree
        deleteNode={() => deleteCharterMutation.mutate({ charterId })}
        open={openDeleteCharter}
        setOpen={setOpenDeleteCharter}
      />
    </>
  );
}
