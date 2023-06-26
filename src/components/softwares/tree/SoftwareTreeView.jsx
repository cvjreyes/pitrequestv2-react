import { IconButton, Spinner, TreeView } from "@nachogonzalezv99/ui-library";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

import { useSoftwareTree } from "../hooks/software";
import SoftwareOptionsDropdown from "./SoftwareOptionsDropdown";

function SoftwareTreeView() {
  const { softwareTree } = useSoftwareTree();

  return (
    <TreeView>
      {!softwareTree ? (
        <Spinner size="md" />
      ) : (
        softwareTree.map((software) => (
          <TreeView.Item
            key={`software-${software.id}`}
            label={software.name}
            actions={[
              <Link
                to={`/softwares/${software.id}/task/create`}
                key={`task-create-${software.id}`}
              >
                <IconButton size="sm" tooltip="Create task">
                  <AiOutlinePlus />
                </IconButton>
              </Link>,
              <SoftwareOptionsDropdown
                softwareId={software.id}
                key={`software-dropdown-${software.id}`}
              />,
            ]}
          >
            {software.Task.map((task) => (
              <TreeView.Item
                label={task.name}
                key={`task-${task.id}`}
                actions={[
                  <Link
                    to={`/softwares/${software.id}/task/${task.id}/subtask/create`}
                    key={`subtask-create-${task.id}`}
                  >
                    <IconButton size="sm" tooltip="Create subtask">
                      <AiOutlinePlus />
                    </IconButton>
                  </Link>,
                  <SoftwareOptionsDropdown
                    softwareId={software.id}
                    taskId={task.id}
                    key={`task-dropdown-${task.id}`}
                  />,
                ]}
              >
                {task.Subtask.map((subtask) => (
                  <TreeView.Item
                    label={subtask.name}
                    key={`subtask-${subtask.id}`}
                    actions={[
                      <SoftwareOptionsDropdown
                        softwareId={software.id}
                        taskId={task.id}
                        subtaskId={subtask.id}
                        key={`task-dropdown-${task.id}`}
                      />,
                    ]}
                  />
                ))}
              </TreeView.Item>
            ))}
          </TreeView.Item>
        ))
      )}
    </TreeView>
  );
}

export { SoftwareTreeView };
