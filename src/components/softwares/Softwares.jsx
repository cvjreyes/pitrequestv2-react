/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import { useNotifications } from "reapop";
import CreateSoftware from "./create/CreateSoftware";
import TableSoftware from "./table/TableSoftware";

export default function Softwares() {
  const { notify } = useNotifications();
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("create-software");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const [softwares, setSoftwares] = useState([]);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
    adminId: 0,
  });

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);

  const getAllSoftwares = async () => {
    const software = await client.get("/software/get_all");
    setSoftwares(software.data.Softwares);
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await client.get("/user/get_all");
      setUsers(users.data.Users);
    };
    getAllSoftwares();
    getAllUsers();
  }, []);

  const createSubmit = async (event) => {
    event.preventDefault();
    if (!formSoftware.name || !formSoftware.code || !formSoftware.adminId) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      return notify("Please, fill all fields", "error");
    }
    if (formSoftware.code.length > 5)
      return notify("Code can't have more than 5 characters", "error");

    await client.post("/software/create", formSoftware);
    notify("Software created successfully!", "success");
    getAllSoftwares();
    setFormSoftware({ name: "", code: "", adminId: 0 });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    }
    console.log(formSoftware);
  };

  return (
    <div css={softwareStyle}>
      <div className="container_create">
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
        </div>
        <div className="container-form">
          {selectedOption === "create-software" && (
            <CreateSoftware
              createSubmit={createSubmit}
              formSoftware={formSoftware}
              handleChange={handleChange}
              nameIsEmpty={nameIsEmpty}
              codeIsEmpty={codeIsEmpty}
              users={users}
            />
          )}
          {/* {selectedOption === "create-task" && <CreateTask />}
          {selectedOption === "create-subtask" && <CreateSubTask />} */}
        </div>
      </div>
      <div className="container-form">
        {selectedOption === "create-software" && (
          <TableSoftware softwares={softwares} users={users} />
        )}
        {/* {selectedOption === "create-task" && <CreateTask />}
          {selectedOption === "create-subtask" && <CreateSubTask />} */}
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
  ".container_create": {
    marginTop: "50px",
    width: "50vw",
    height: "95vh",
    borderRight: "1px solid black",
    display: "flex",
    flexDirection: "row",
    ".options-container": {
      width: "20%",
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
};
