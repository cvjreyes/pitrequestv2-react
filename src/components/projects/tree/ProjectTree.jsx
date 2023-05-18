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
  };

  useEffect(() => {
    getProjectTree();
  }, []);

  const prepareData = (data) =>
    data.map((project, i) => ({
      value: `p-${project.id}`,
      label: (
        <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
          <b>{`${project.name} (${project.code}) => ${project.estimatedHours}h`}</b>
          <DropdownMenuProject
            id={project.id}
            getProjectTree={getProjectTree}
            node={"project"}
          />
        </div>
      ),
      showCheckbox: false,
      children: [
        {
          value: `pc-${project.id}`,
          label: (
            <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
              <b><i>Charter</i></b>
              <DropdownMenuProject
                id={project.id}
                getProjectTree={getProjectTree}
                node={"charterfolder"}
              />
            </div>
          ),
          showCheckbox: false,
          children: [
            ...(project.Charter
              ? project.Charter.map((charter) => ({
                  value: `ch-${charter.id}`,
                  label: (
                    <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
                      {`${charter.name}`}
                      <DropdownMenuProject
                        id={charter.id}
                        getProjectTree={getProjectTree}
                        node={"charter"}
                      />
                    </div>
                  ),
                  showCheckbox: false,
                }))
              : []),
          ],
        },
        {
          value: `psoft-${project.id}`,
          label: (
            <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
              <b><i>Softwares</i></b>
              <DropdownMenuProject
                id={project.id}
                getProjectTree={getProjectTree}
                node={"softwarefolder"}
              />
            </div>
          ),
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
                      label: (
                        <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
                          <i>Admins</i>
                          <DropdownMenuProject
                            id={project.id}
                            getProjectTree={getProjectTree}
                            softwareId={projectSoftware.software.id}
                            node={"adminfolder"}
                          />
                        </div>
                      ),
                      showCheckbox: false,
                      children: [
                        ...(projectSoftware.users
                          ? projectSoftware.users.map((user, k) => ({
                              value: `psuser-${i}-${j}-${k}`,
                              label: (
                                <div style={{display: "flex", height: 0, alignItems: "center", margin:"-10px 0"}}>
                                  {`${user.name}`}
                                  <DropdownMenuProject
                                    adminId={user.id}
                                    softwareId={projectSoftware.software.id}
                                    projectId={project.id}
                                    getProjectTree={getProjectTree}
                                    node={"admin"}
                                  />
                                </div>
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
