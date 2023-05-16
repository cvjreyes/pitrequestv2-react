import { useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
  MdAddCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdFolder,
  MdFolderOpen,
  MdIndeterminateCheckBox,
  MdInsertDriveFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdRemoveCircle,
} from "react-icons/md";

import ProjectModal from "../create/ProjectModal";

import { client } from "../../../helpers/config";
import DropdownMenuProject from "./DropdownMenuProject";

export default function ProjectTree() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [projectTree, setProjectTree] = useState([]);

  const getProjectTree = async () => {
    const projectTree = await client.get("/project/get_tree");
    setProjectTree(projectTree.data);
    console.log(projectTree.data);
  };

  useEffect(() => {
    getProjectTree();
  }, []);

  const prepareData = (data) =>
    data.map((project, i) => ({
      value: `p-${project.id}`,
      label: (
        <>
          {`${project.name} (${project.code}) => ${project.estimatedHours}h`}
          <DropdownMenuProject
            id={project.id}
            getProjectTree={getProjectTree}
            node={"project"}
          />
        </>
      ),
      showCheckbox: false,
      children: [
        {
          value: `pc-${project.id}`,
          label: (
            <>
              {`Charter`}
              <DropdownMenuProject
                id={project.id}
                getProjectTree={getProjectTree}
                node={"charterfolder"}
              />
            </>
          ),
          showCheckbox: false,
          children: [
            ...(project.Charter
              ? project.Charter.map((charter) => ({
                  value: `ch-${charter.id}`,
                  label: (
                    <>
                      {`${charter.name}`}
                      <DropdownMenuProject
                        id={charter.id}
                        getProjectTree={getProjectTree}
                        node={"charter"}
                      />
                    </>
                  ),
                  showCheckbox: false,
                }))
              : []),
          ],
        },
        {
          value: `psoft-${project.id}`,
          label: "Softwares",
          showCheckbox: false,
          children: [
            ...(project.ProjectSoftwares
              ? project.ProjectSoftwares.map((projectSoftware, j) => ({
                  value: `ps-${projectSoftware.software.id}-${i}-${j}`,
                  label: `${projectSoftware.software.name} (${projectSoftware.software.code})`,
                  children: [
                    ...(projectSoftware.software.Task
                      ? projectSoftware.software.Task.map((task) => ({
                          value: `t-${task.id}-${i}-${j}`,
                          label: task.name,
                          children: task.Subtask
                            ? task.Subtask.map((subtask) => ({
                                value: `st-${subtask.id}-${i}-${j}`,
                                label: subtask.name,
                              }))
                            : [],
                        }))
                      : []),
                    {
                      value: `psoftuser-${i}-${j}`,
                      label: "Admins",
                      showCheckbox: false,
                      children: [
                        ...(projectSoftware.users
                          ? projectSoftware.users.map((user, k) => ({
                              value: `psuser-${i}-${j}-${k}`,
                              label: (
                                <>
                                  {`${user.name}`}
                                  <DropdownMenuProject
                                    adminId={user.id}
                                    softwareId={projectSoftware.software.id}
                                    projectId={project.id}
                                    getProjectTree={getProjectTree}
                                    node={"admin"}
                                  />
                                </>
                              ),
                              showCheckbox: false,
                            }))
                          : []),
                      ],
                    },
                  ],
                }))
              : []),
          ],
        },
      ],
    }));

  // Renderizar solo los nodos con la propiedad showCheckbox definida como true
  return (
    <div className="container-tree">
      <ProjectModal getProjectTree={getProjectTree} />
      <CheckboxTree
        nodes={prepareData(projectTree)}
        checked={checked}
        expanded={expanded}
        onCheck={(checked) => setChecked(checked)}
        onExpand={(expanded) => setExpanded(expanded)}
        icons={{
          check: <MdCheckBox />,
          uncheck: <MdCheckBoxOutlineBlank />,
          halfCheck: <MdIndeterminateCheckBox />,
          expandClose: <MdKeyboardArrowRight />,
          expandOpen: <MdKeyboardArrowDown />,
          expandAll: <MdAddCircle />,
          collapseAll: <MdRemoveCircle />,
          parentClose: <MdFolder />,
          parentOpen: <MdFolderOpen />,
          leaf: <MdInsertDriveFile />,
        }}
        showExpandAll
        showNodeIcon={false}
      />
    </div>
  );
}
