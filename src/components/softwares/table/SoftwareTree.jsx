import { useState } from "react";
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
import DropdownMenu from "../create/DropdownMenuSoftware";

export default function SoftwareTree({ softwareTree, users, getSoftwareTree }) {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  // Preparar los datos de entrada en el formato aceptado por react-checkbox-tree
  const prepareData = (data) =>
    data.map((software) => ({
      value: software.id,
      label: (
        <>
          {`${software.name} (${software.code}) => Admin: ${users.map(
            (user) => {
              if (user.id == software.adminId) {
                return user.name;
              } else return "No admin";
            }
          )}`}
          <DropdownMenu />
        </>
      ),
      children: software.Task
        ? software.Task.map((task) => ({
            value: task.id + 1000,
            label: task.name,
            children: task.Subtask
              ? task.Subtask.map((subtask) => ({
                  value: subtask.id + 10000,
                  label: subtask.name,
                }))
              : [],
          }))
        : [],
    }));

  return (
    <div>
      <SoftwareModal users={users} getSoftwareTree={getSoftwareTree} />
      <CheckboxTree
        nodes={prepareData(softwareTree)}
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
        showNodeIcon={false}
        showExpandAll
        onlyLeafCheckboxes
      />
    </div>
  );
}
