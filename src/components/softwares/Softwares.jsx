/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import CreateSoftware from "./create/CreateSoftware";
import CreateTask from "./create/CreateTask";
import TableSoftware from "./table/TableSoftware";
import TableTask from "./table/TableTask";
import CreateSubTask from "./create/CreateSubTask";
import TableSubTask from "./table/TableSubTask";
import SoftwareTree from "./table/SoftwareTree";

export default function Softwares() {
  const [users, setUsers] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [softwareTree, setSoftwareTree] = useState([]);
  const [selectedOption, setSelectedOption] = useState("create-software");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const getAllSoftwares = async () => {
    const software = await client.get("/software/get_all");
    setSoftwares(software.data.Softwares);
  };

  const getAllTasks = async () => {
    const tasks = await client.get("/software/get_all/tasks");
    setTasks(tasks.data.Tasks);
  };

  const getAllSubTasks = async () => {
    const subtasks = await client.get("/software/get_all/subtasks");
    setSubtasks(subtasks.data.Subtasks);
  };

  const getSoftwareTree = async () => {
    const softwareTree = await client.get("/software/get_tree");
    setSoftwareTree(softwareTree.data);
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await client.get("/user/get_all");
      setUsers(users.data.Users);
    };
    getAllSoftwares();
    getAllTasks();
    getAllSubTasks();
    getSoftwareTree();
    getAllUsers();
  }, []);

  return (
    <div css={softwareStyle}>
      <div className="options-container">
        <div
          className={`option ${
            selectedOption === "create-software" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("create-software")}
        >
          Create Software
        </div>
        <div
          className={`option ${
            selectedOption === "create-task" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("create-task")}
        >
          Create Task
        </div>
        <div
          className={`option ${
            selectedOption === "create-subtask" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("create-subtask")}
        >
          Create SubTask
        </div>
        <div
          className={`option ${
            selectedOption === "software-tree" ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect("software-tree")}
        >
          Software Tree
        </div>
      </div>
      {selectedOption !== "software-tree" && (
        <div className="container_create">
          <div className="container-form">
            {selectedOption === "create-software" && (
              <CreateSoftware users={users} getAllSoftwares={getAllSoftwares} />
            )}
            {selectedOption === "create-task" && (
              <CreateTask softwares={softwares} getAllTasks={getAllTasks} />
            )}
            {selectedOption === "create-subtask" && (
              <CreateSubTask tasks={tasks} getAllSubTasks={getAllSubTasks} />
            )}
          </div>
        </div>
      )}
      <div className="container-form">
        {selectedOption === "create-software" && (
          <TableSoftware softwares={softwares} users={users} />
        )}
        {selectedOption === "create-task" && (
          <TableTask softwares={softwares} tasks={tasks} />
        )}
        {selectedOption === "create-subtask" && (
          <TableSubTask tasks={tasks} subtasks={subtasks} />
        )}
        {selectedOption === "software-tree" && (
          <SoftwareTree softwareTree={softwareTree} />
        )}
      </div>

      <Outlet />
    </div>
  );
}

const softwareStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  ".options-container": {
    marginTop: "50px",
    width: "20%",
    minWidth: "200px",
    height: "95vh",
    backgroundColor: "rgb(230, 230, 230)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    ".option": {
      cursor: "pointer",
      padding: "10px",
      margin: "5px 0",
      "&:hover": {
        backgroundColor: "rgb(200, 200, 200)",
      },
      "&.selected": {
        fontWeight: "bold",
        backgroundColor: "rgb(200, 200, 200)",
      },
    },
  },
  ".container_create": {
    marginTop: "50px",
    width: "50vw",
    height: "95vh",
    borderRight: "1px solid black",
    display: "flex",
    flexDirection: "row",
    ".container-form": {
      flexGrow: 1,
      padding: "20px",
    },
    ".create_software": {
      display: "flex",
      alignItems: "start",
      justifyContent: "space-around",
      ".inputs_software": {
        display: "flex",
        flexDirection: "column",
        input: {
          margin: "10px 0",
        },
      },
    },
  },
  ".container_show": {
    display: "flex",
    justifyContent: "center",
    width: "50vw",
    margin: "20px",
    table: {
      borderCollapse: "collapse",
      width: "100%",
      "&:hover tbody tr": {
        backgroundColor: "#f5f5f5",
      },
    },
    th: {
      backgroundColor: "#ddd",
      fontWeight: "bold",
      textAlign: "center",
      padding: "12px",
    },
    tr: {
      "&:nth-of-type(even)": {
        backgroundColor: "#f2f2f2",
      },
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
    },
  },
  ".select_table": {
    marginLeft: "20px",
  },
};
