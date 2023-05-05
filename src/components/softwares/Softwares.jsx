/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { client } from "../../helpers/config";

import { notify } from "reapop";
import { Input } from "../general";
import { Button } from "../general/Button";
import * as Select from "@radix-ui/react-select";
import { AiOutlineArrowDown } from "react-icons/ai";

export default function Softwares() {
  const [softwares, setSoftwares] = useState([]);
  const [users, setUsers] = useState([]);
  // const [dataSoftware, setDataSoftware] = useState({});
  // const [tasks, setTasks] = useState([]);
  // const [subtask, setSubtask] = useState([]);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
    adminId: 0,
  });

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [adminIsEmpty, setAdminIsEmpty] = useState(false);

  // const getInfoSoftware = async (id) => {
  //   const software = await client.get(`/software/get_all/${id}`);
  //   setDataSoftware(software.data);
  // };

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

  useEffect(() => {
    console.log("Softwares", softwares);
    console.log("Users: ", users);
  }, [softwares, users]);

  const createSubmit = async (event) => {
    event.preventDefault();
    if (!formSoftware.name || !formSoftware.code || !formSoftware.adminId) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      setAdminIsEmpty(!formSoftware.adminId);
      return notify("Please, fill all fields", "error");
    }
    await client.post("/software/create", formSoftware);
    getAllSoftwares();
    notify("Software created successfully!", "success");
    setFormSoftware({ name: "", code: "", adminId: 0 });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
    setAdminIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    } else if (name === "adminId") {
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
            error={nameIsEmpty && "Required"}
          />
          <Input
            id="code"
            name="code"
            value={formSoftware.code}
            placeholder="Code"
            onChange={handleChange}
            error={codeIsEmpty && "Required"}
          />
          <Select.Root>
            <Select.Trigger className="SelectTrigger" aria-label="Food">
              <Select.Value placeholder="Select an Admin…" />
              <Select.Icon>
                <AiOutlineArrowDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal className="SelectPortal">
              <Select.Content sideOffset={10} side="bottom">
                <Select.ScrollUpButton className="SelectScrollButton">
                  <AiOutlineArrowDown />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                  <Select.Group>
                    {users.map((user) => (
                      <SelectItem
                        id="adminId"
                        name="adminId"
                        key={user.id}
                        value={formSoftware.adminId}
                        onChange={handleChange}
                      >
                        <div>{user.name}</div>
                      </SelectItem>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                  <AiOutlineArrowDown />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
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

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        // className={classnames("SelectItem", className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <AiOutlineArrowDown />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

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
