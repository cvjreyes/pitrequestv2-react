/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import { useNotifications } from "reapop";
import { Input } from "../general";
import { Button } from "../general/Button";

export default function Softwares() {
  const [softwares, setSoftwares] = useState([]);
  const [users, setUsers] = useState([]);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
    adminId: 0,
  });

  const { notify } = useNotifications();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [adminIsEmpty, setAdminIsEmpty] = useState(false);

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
    console.log(formSoftware);
    if (!formSoftware.name || !formSoftware.code || !formSoftware.adminId) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      setAdminIsEmpty(!formSoftware.adminId);
      return notify("Please, fill all fields", "error");
    }
    await client.post("/software/create", formSoftware);
    notify("Software created successfully!", "success");
    getAllSoftwares();
    setFormSoftware({ name: "", code: "", adminId: 0 });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
    setAdminIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    console.log("name: ", name);
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    } else if (name === "adminId") {
      console.log("entra");
      setAdminIsEmpty(!value);
    }
    console.log(formSoftware);
  };

  return (
    <div css={softwareStyle}>
      <form className="container_create" onSubmit={createSubmit}>
        <div className="inputs_software">
          <Input
            id="name"
            name="name"
            value={formSoftware.name}
            placeholder="Software"
            onChange={handleChange}
            error={nameIsEmpty ? "Required" : null}
          />
          <Input
            id="code"
            name="code"
            value={formSoftware.code}
            placeholder="Code"
            onChange={handleChange}
            error={codeIsEmpty ? "Required" : null}
          />
          <div className="selectContainer">
            <select
              name="adminId"
              value={formSoftware.adminId}
              onChange={handleChange}
              error={adminIsEmpty ? "Required" : null}
            >
              <option value="">-- Select Admin --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Button type="submit" onClick={createSubmit}>
            Create Software
          </Button>
        </div>
      </form>
      <div className="container_show">
        {softwares ? (
          softwares.map((software) => (
            <div key={software.id} className="single_software">
              <div>{software.name}</div>
              <div>{software.code}</div>
              <div>{software.adminId}</div>
            </div>
          ))
        ) : (
          <div>No hay resultados</div>
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
  ".container_create": {
    marginTop: "50px",
    display: "flex",
    alignItems: "start",
    justifyContent: "space-around",
    width: "50vw",
    height: "90vh",
    borderRight: "1px solid black",
    ".inputs_software": {
      display: "flex",
      flexDirection: "column",
      input: {
        margin: "10px 0",
      },
      ".selectContainer": {
        display: "flex",
        flexDirection: "column",
      },
      ".SelectTrigger": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        padding: "0 15px",
        fontSize: "13px",
        lineHeight: "1",
        height: "35px",
        gap: "5px",
        backgroundColor: "white",
        marginTop: "10px",
        ":hover": {
          backgroundColor: "lightblue",
        },
        ":focus": {
          boxShadow: "0 0 0 2px solid black",
        },
      },
      ".SelectContent": {
        overflow: "hidden",
        position: "fixed",
        backgroundColor: "white",
        borderRadius: "6px",
        boxShadow:
          "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
      },
      ".SelectViewport": {
        padding: "5px",
      },
      ".SelectItem": {
        fontSize: "13px",
        lineHeight: "1",
        color: "violet",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        height: "25px",
        padding: "0 35px 0 25px",
        position: "relative",
        userSelect: "none",
        "[data-disabled]": {
          pointerEvents: "none",
        },
        "[data-highlighted]": {
          outline: "none",
        },
      },
      ".SelectLabel": {
        padding: "0 25px",
        fontSize: "12px",
        lineHeight: "25px",
      },
      ".SelectItemIndicator": {
        position: "absolute",
        left: "0",
        width: "25px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
      ".SelectScrollButton": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "25px",
        backgroundColor: "white",
        cursor: "default",
      },
    },
  },
  ".container_show": {
    display: "flex",
    justifyContent: "center",
    width: "50vw",
  },
};
