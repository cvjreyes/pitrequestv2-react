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

import SoftwareModal from "../../softwares/create/SoftwareModal";

import { client } from "../../../helpers/config";

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


  // Preparar los datos de entrada en el formato aceptado por react-checkbox-tree
  const prepareData = (data) =>
    data.map((project) => ({
      value: `p-${project.id}`,
      label: `${project.name} (${project.code})`,
      children: [
        {
          value: `pc-${project.id}`,
          label: "Charter",
          children: [
            ...(project.Charter
              ? project.Charter.map((charter) => ({
                  value: `ch-${charter.id}`,
                  label: charter.name,
                }))
              : []),
          ],
        },
        {
          value: `pu-${project.id}`,
          label: "Users From Project",
          children: [
            ...(project.ProjectUsers
              ? project.ProjectUsers.map((projectUsers) => ({
                  value: `pus-${projectUsers.user.id}`,
                  label: projectUsers.user.name,
                }))
              : []),
          ],
        },
        {
          value: `psoft-${project.id}`,
          label: "Softwares",
          children: [
            ...(project.ProjectSoftwares
              ? project.ProjectSoftwares.map((projectSoftware) => ({
                  value: `ps-${projectSoftware.software.id}`,
                  label: `${projectSoftware.software.name} (${projectSoftware.software.code})`,
                  children: projectSoftware.software.Task
                    ? projectSoftware.software.Task.map((task) => ({
                        value: `t-${task.id}`,
                        label: task.name,
                        children: task.Subtask
                          ? task.Subtask.map((subtask) => ({
                              value: `st-${subtask.id}`,
                              label: subtask.name,
                            }))
                          : [],
                      }))
                    : [],
                }))
              : []),
          ],
        },
      ],
    }));

  return (
    <div className="container-tree">
      {/* <SoftwareModal getSoftwareTree={getSoftwareTree} /> */}
      <CheckboxTree
        nodes={prepareData(projectTree)}
        checked={checked}
        expanded={expanded}
        onCheck={(checked) => setChecked(checked)}
        onExpand={(expanded) => setExpanded(expanded)}
        icons={{
          check: <MdCheckBox className="rct-icon rct-icon-check" />,
          uncheck: (
            <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />
          ),
          halfCheck: (
            <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
          ),
          expandClose: (
            <MdKeyboardArrowRight className="rct-icon rct-icon-expand-close" />
          ),
          expandOpen: (
            <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
          ),
          expandAll: <MdAddCircle className="rct-icon rct-icon-expand-all" />,
          collapseAll: (
            <MdRemoveCircle className="rct-icon rct-icon-collapse-all" />
          ),
          parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
          parentOpen: (
            <MdFolderOpen className="rct-icon rct-icon-parent-open" />
          ),
          leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf" />,
        }}
        showExpandAll
        onlyLeafCheckboxes
      />
    </div>
  );
}
