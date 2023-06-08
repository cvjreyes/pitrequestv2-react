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

import { client } from "../../../helpers/config";
import { useAuth } from "../../../context/AuthContext";

import DropdownMenuProject from "./DropdownMenuProject";
import ProjectModal from "../create/ProjectModal";
import { Input } from "../../general";
import Restricted from "../../authentication/Restricted";

export default function ProjectTree() {
  const { user } = useAuth();

  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [projectTree, setProjectTree] = useState([]);
  const [filter, setFilter] = useState("");

  const getProjectTree = async () => {
    const projectTree = await client.get("/projects/tree");
    setProjectTree(projectTree.data);
  };

  useEffect(() => {
    getProjectTree();
  }, []);

  const prepareData = (data) =>
    data
      .filter((project) =>
        filter
          ? project.name.toLowerCase().includes(filter.toLowerCase()) ||
            project.code.toLowerCase().includes(filter.toLowerCase())
          : true
      )
      .map((project, i) => ({
        value: `p-${project.id}`,
        label: (
          <div
            style={{
              display: "flex",
              height: 0,
              alignItems: "center",
              margin: "-10px 0",
            }}
          >
            <b>{`${project.name} (${project.code}) => ${project.estimatedHours}h`}</b>
            <Restricted to={["ADMINLEAD"]}>
              <DropdownMenuProject
                id={project.id}
                getProjectTree={getProjectTree}
                node={"project"}
              />
            </Restricted>
          </div>
        ),
        title: `${project.userProjectId}`,
        showCheckbox: false,
        children: [
          {
            value: `pc-${project.id}`,
            label: (
              <div
                style={{
                  display: "flex",
                  height: 0,
                  alignItems: "center",
                  margin: "-10px 0",
                }}
              >
                <b>
                  <i>Charter</i>
                </b>
                <Restricted to={["ADMINLEAD"]}>
                  <DropdownMenuProject
                    id={project.id}
                    getProjectTree={getProjectTree}
                    node={"charterfolder"}
                  />
                </Restricted>
              </div>
            ),
            showCheckbox: false,
            children: [
              ...(project.Charter
                ? project.Charter.map((charter) => ({
                    value: `ch-${charter.id}`,
                    label: (
                      <div
                        style={{
                          display: "flex",
                          height: 0,
                          alignItems: "center",
                          margin: "-10px 0",
                        }}
                      >
                        {`${charter.name}`}
                        <Restricted to={["ADMINLEAD"]}>
                          <DropdownMenuProject
                            id={charter.id}
                            getProjectTree={getProjectTree}
                            node={"charter"}
                          />
                        </Restricted>
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
              <div
                style={{
                  display: "flex",
                  height: 0,
                  alignItems: "center",
                  margin: "-10px 0",
                }}
              >
                <b>
                  <i>Softwares</i>
                </b>
                <Restricted to={["ADMINLEAD"]}>
                  <DropdownMenuProject
                    id={project.id}
                    getProjectTree={getProjectTree}
                    node={"softwarefolder"}
                  />
                </Restricted>
              </div>
            ),
            showCheckbox: false,
            children: [
              ...(project.ProjectSoftwares
                ? project.ProjectSoftwares.map((projectSoftware, j) => ({
                    value: `ps-${projectSoftware.software.id}-${i}-${j}`,
                    label: (
                      <div
                        style={{
                          display: "flex",
                          height: 0,
                          alignItems: "center",
                          margin: "-10px 0",
                        }}
                      >
                        {`${projectSoftware.software.name} (${projectSoftware.software.code})`}
                        <Restricted to={["ADMINLEAD"]}>
                          <DropdownMenuProject
                            projectId={project.id}
                            softwareId={projectSoftware.software.id}
                            getProjectTree={getProjectTree}
                            node={"software"}
                          />
                        </Restricted>
                      </div>
                    ),
                    disabled: user.id !== project.userProjectId,
                    showCheckbox: false,
                    children: [
                      ...(projectSoftware.software.Task
                        ? projectSoftware.software.Task.map((task) => ({
                            value: `t-${task.id}-${i}-${j}`,
                            label: task.name,
                            showCheckbox: false,
                            disabled: user.id !== project.userProjectId,
                            children: task.Subtask
                              ? task.Subtask.map((subtask) => ({
                                  value: `st-${subtask.id}-${i}-${j}`,
                                  label: subtask.name,
                                  showCheckbox: false,
                                  disabled: user.id !== project.userProjectId,
                                }))
                              : [],
                          }))
                        : []),
                      {
                        value: `psoftuser-${i}-${j}`,
                        label: (
                          <div
                            style={{
                              display: "flex",
                              height: 0,
                              alignItems: "center",
                              margin: "-10px 0",
                            }}
                          >
                            <u>
                              <i>Admins</i>
                            </u>
                            <Restricted to={["ADMINLEAD"]}>
                              <DropdownMenuProject
                                id={project.id}
                                getProjectTree={getProjectTree}
                                softwareId={projectSoftware.software.id}
                                node={"adminfolder"}
                              />
                            </Restricted>
                          </div>
                        ),
                        showCheckbox: false,
                        children: [
                          ...(projectSoftware.users
                            ? projectSoftware.users.map((user, k) => ({
                                value: `psuser-${i}-${j}-${k}`,
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      height: 0,
                                      alignItems: "center",
                                      margin: "-10px 0",
                                    }}
                                  >
                                    {`${user.name}`}
                                    <Restricted to={["ADMINLEAD"]}>
                                      <DropdownMenuProject
                                        adminId={user.id}
                                        softwareId={projectSoftware.software.id}
                                        projectId={project.id}
                                        getProjectTree={getProjectTree}
                                        node={"admin"}
                                      />
                                    </Restricted>
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
      <Input
        type="text"
        placeholder="Buscar proyecto"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Restricted to={["ADMINLEAD"]}>
        <ProjectModal getProjectTree={getProjectTree} />
      </Restricted>
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
