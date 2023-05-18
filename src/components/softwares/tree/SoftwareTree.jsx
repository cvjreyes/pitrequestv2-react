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

import SoftwareModal from "../create/SoftwareModal";
import DropdownMenuSoftware from "./DropdownMenuSoftware";

import { client } from "../../../helpers/config";

export default function SoftwareTree() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [softwareTree, setSoftwareTree] = useState([]);

  const getSoftwareTree = async () => {
    const softwareTree = await client.get("/software/get_tree");
    setSoftwareTree(softwareTree.data);
  };

  useEffect(() => {
    getSoftwareTree();
  }, []);

  // Preparar los datos de entrada en el formato aceptado por react-checkbox-tree
  const prepareData = (data) =>
    data.map((software) => ({
      value: software.id,
      label: (
        <div
          style={{
            display: "flex",
            height: 0,
            alignItems: "center",
            margin: "-10px 0",
          }}
        >
          <b>{`${software.name} (${software.code})`}</b>
          <DropdownMenuSoftware
            id={software.id}
            getSoftwareTree={getSoftwareTree}
            node={"software"}
          />
        </div>
      ),
      showCheckbox: false,
      children: software.Task
        ? software.Task.map((task) => ({
            value: task.id + 1000,
            label: (
              <div
                style={{
                  display: "flex",
                  height: 0,
                  alignItems: "center",
                  margin: "-10px 0",
                }}
              >
                {task.name}
                <DropdownMenuSoftware
                  id={task.id}
                  getSoftwareTree={getSoftwareTree}
                  node={"task"}
                />
              </div>
            ),
            showCheckbox: false,
            children: task.Subtask
              ? task.Subtask.map((subtask) => ({
                  value: subtask.id + 10000,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        height: 0,
                        alignItems: "center",
                        margin: "-10px 0",
                      }}
                    >
                      <i>{subtask.name}</i>
                      <DropdownMenuSoftware
                        id={subtask.id}
                        getSoftwareTree={getSoftwareTree}
                        node={"subtask"}
                      />
                    </div>
                  ),
                  showCheckbox: false,
                }))
              : [],
          }))
        : [],
    }));

  return (
    <div className="container-tree">
      <SoftwareModal getSoftwareTree={getSoftwareTree} />
      <CheckboxTree
        nodes={prepareData(softwareTree)}
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
