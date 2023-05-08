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
    },
  },
  ".container_show": {
    display: "flex",
    justifyContent: "center",
    width: "50vw",
  },
};
