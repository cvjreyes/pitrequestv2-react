import { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdIndeterminateCheckBox,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdAddCircle,
  MdRemoveCircle,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile,
} from "react-icons/md";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

export default function SoftwareTree({ softwareTree }) {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  // Preparar los datos de entrada en el formato aceptado por react-checkbox-tree
  const prepareData = (data) =>
    data.map((software) => ({
      value: software.id,
      label: software.name,
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
        parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
        leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf" />,
      }}
      showNodeIcon={false}
      showExpandAll
    />
  );
}
