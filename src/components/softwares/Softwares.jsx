/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import CreateSubTask from "./create/CreateSubTask";
import CreateTask from "./create/CreateTask";
import SoftwareTree from "./table/SoftwareTree";

export default function Softwares() {
  const [users, setUsers] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [softwareTree, setSoftwareTree] = useState([]);

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
      <div className="container-form">
        <CreateTask softwares={softwares} getAllTasks={getAllTasks} />
        <CreateSubTask tasks={tasks} getAllSubTasks={getAllSubTasks} />
      </div>
      <div className="container-tree">
        <SoftwareTree softwareTree={softwareTree} users={users} getSoftwareTree={getSoftwareTree} />
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
  ".container-form": {
    flexGrow: 1,
    display: "flex",
    height: "94vh",
    padding: "20px",
    alignSelf: "flex-start",
    marginTop: "50px",
    width: "-webkit-fill-available",
    borderRight: "1px solid #ccc", // línea divisoria vertical
    ".margin_added": {
      margin: "10px",
    },
  },
  ".container-tree": {
    flexGrow: 1,
    padding: "20px",
    alignSelf: "flex-start",
    marginTop: "50px",
    width: "-webkit-fill-available",
  },
  ".container_create": {
    marginTop: "50px",
    width: "50vw",
    height: "95vh",
    borderRight: "1px solid black",
    display: "flex",
    flexDirection: "row",
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
};
