import { Spinner, TreeView } from "@nachogonzalezv99/ui-library";
import React from "react";
import { useProjectTree } from "../hooks/project";

function ProjectTreeView() {
  const { projectTree } = useProjectTree();

  console.log(projectTree);
  return (
    <TreeView>
      {!projectTree ? (
        <Spinner size="md" />
      ) : (
        projectTree.map((project) => (
          <TreeView.Item key={`project-${project.id}`} label={project.name}>
            <TreeView.Item
              key={`charter-folder-${project.id}`}
              label="Charters"
            >
              {project.Charter.map((charter) => (
                <TreeView.Item
                  key={`charter-${charter.id}`}
                  label={charter.name}
                />
              ))}
            </TreeView.Item>
            <TreeView.Item
              key={`softwares-folder-${project.id}`}
              label="Softwares"
            >
              {project.ProjectSoftwares.map((projectSoftware) => (
                // El problema esta en este div
                <>
                  <TreeView.Item
                    key={`project-software-${projectSoftware.software.id}`}
                    label={projectSoftware.software.name}
                  >
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
                  >
                    {projectSoftware.users.map((admin) => (
                      <TreeView.Item
                        key={`admins-${admin.id}`}
                        label={admin.name}
                      />
                    ))}
                  </TreeView.Item>
                </>
              ))}
            </TreeView.Item>
          </TreeView.Item>
        ))
      )}
    </TreeView>
  );
}

export { ProjectTreeView };
