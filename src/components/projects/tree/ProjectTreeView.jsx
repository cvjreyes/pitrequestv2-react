import { IconButton, Spinner, TreeView } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

import { useProjectTree, useRemoveSoftware } from "../hooks/project";

import ProjectOptionsDropdown from "./ProjectOptionsDropdown";
import DeleteNodeTree from "../../softwares/delete/DeleteNodeTree";
import { useRemoveAdmin } from "../hooks/user";

function ProjectTreeView() {
  const { projectTree } = useProjectTree();

  const [openRemoveSoftware, setOpenRemoveSoftware] = useState(false);
  const [openRemoveAdmin, setOpenRemoveAdmin] = useState(false);

  const removeSoftwareMutation = useRemoveSoftware();
  const removeAdminMutation = useRemoveAdmin();

  return (
    <TreeView>
      {!projectTree ? (
        <Spinner size="md" />
      ) : (
        projectTree.map((project) => (
          <TreeView.Item
            key={`project-${project.id}`}
            label={project.name}
            actions={[
              <ProjectOptionsDropdown
                projectId={project.id}
                key={`project-dropdown-${project.id}`}
              />,
            ]}
          >
            <TreeView.Item
              key={`charter-folder-${project.id}`}
              label="Charters"
              actions={[
                <Link
                  to={`/projects/${project.id}/charter/create`}
                  key={`charter-create-${project.id}`}
                >
                  <IconButton size="sm" tooltip="Create charter">
                    <AiOutlinePlus />
                  </IconButton>
                </Link>,
              ]}
            >
              {project.Charter.map((charter) => (
                <TreeView.Item
                  key={`charter-${charter.id}`}
                  label={charter.name}
                  actions={[
                    <ProjectOptionsDropdown
                      projectId={project.id}
                      charterId={charter.id}
                      key={`charter-dropdown-${charter.id}`}
                    />,
                  ]}
                />
              ))}
            </TreeView.Item>
            <TreeView.Item
              key={`softwares-folder-${project.id}`}
              label="Softwares"
              actions={[
                <Link
                  to={`/projects/${project.id}/software/add`}
                  key={`software-add-${project.id}`}
                >
                  <IconButton size="sm" tooltip="Add software">
                    <AiOutlinePlus />
                  </IconButton>
                </Link>,
              ]}
            >
              {project.ProjectSoftwares.map((projectSoftware) => (
                <TreeView.Item
                  key={`project-software-${projectSoftware.software.id}`}
                  label={projectSoftware.software.name}
                  actions={[
                    <DeleteNodeTree
                      key={`software-dropdown-${projectSoftware.software.id}`}
                      deleteNode={() =>
                        removeSoftwareMutation.mutate({
                          projectId: project.id,
                          softwareId: projectSoftware.software.id,
                        })
                      }
                      open={openRemoveSoftware}
                      setOpen={setOpenRemoveSoftware}
                    />,
                    <button
                      onClick={() => setOpenRemoveSoftware(true)}
                      key={`software-remove-${projectSoftware.software.id}`}
                    >
                      <AiOutlineDelete />
                    </button>,
                  ]}
                >
                  <TreeView.Item label="View Tasks">
                    {projectSoftware.software.Task.map((taskSoftware) => (
                      <TreeView.Item
                        key={`task-${taskSoftware.id}`}
                        label={taskSoftware.name}
                      >
                        {taskSoftware.Subtask.map((subtaskSoftware) => (
                          <TreeView.Item
                            key={`subtask-${subtaskSoftware.id}`}
                            label={subtaskSoftware.name}
                          />
                        ))}
                      </TreeView.Item>
                    ))}
                  </TreeView.Item>
                  <TreeView.Item
                    key={`admins-folder-${project.id}`}
                    label="Admins"
                    actions={[
                      <Link
                        to={`/projects/${project.id}/software/${projectSoftware.software.id}/admin/add`}
                        key={`admin-add-${project.id}`}
                      >
                        <IconButton size="sm" tooltip="Add Admin">
                          <AiOutlinePlus />
                        </IconButton>
                      </Link>,
                    ]}
                  >
                    {projectSoftware.users.map((admin) => (
                      <TreeView.Item
                        key={`admins-${admin.id}`}
                        label={admin.name}
                        actions={[
                          <DeleteNodeTree
                            key={`admin-dropdown-${projectSoftware.software.id}`}
                            deleteNode={() =>
                              removeAdminMutation.mutate({
                                projectId: project.id,
                                softwareId: projectSoftware.software.id,
                                adminId: admin.id
                              })
                            }
                            open={openRemoveAdmin}
                            setOpen={setOpenRemoveAdmin}
                          />,
                          <button
                            onClick={() => setOpenRemoveAdmin(true)}
                            key={`admin-remove-${projectSoftware.software.id}`}
                          >
                            <AiOutlineDelete />
                          </button>,
                        ]}
                      />
                    ))}
                  </TreeView.Item>
                </TreeView.Item>
              ))}
            </TreeView.Item>
          </TreeView.Item>
        ))
      )}
    </TreeView>
  );
}

export { ProjectTreeView };
