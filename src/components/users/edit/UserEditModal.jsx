/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/green.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { useNotifications } from "reapop";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../helpers/config";
import Restricted from "../../authentication/Restricted";

export default function UserEditModal({
  users,
  email,
  getUsers,
  id,
  userProjects,
  userRoles,
}) {
  const { notify } = useNotifications();
  const animatedComponents = makeAnimated();

  const { updateUserInfo } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUser, setFormUser] = useState({
    userId: id,
    email: email,
    projectIds: [],
    roleIds: [],
  });

  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const response = await client.get("/projects/");
      const options = response.data.Projects.map((project) => ({
        value: project.id,
        label: project.code,
      }));
      setProjectOptions(options);

      const selectedProjects = options.filter((option) =>
        userProjects.includes(option.label)
      );
      setSelectedProjects(selectedProjects);

      // Obtener los IDs de los proyectos seleccionados
      const selectedProjectIds = selectedProjects.map((option) => option.value);
      setFormUser((prevFormUser) => ({
        ...prevFormUser,
        projectIds: selectedProjectIds,
      }));
    };
    const getRoles = async () => {
      const response = await client.get("/roles/noUser");
      const options = response.data.roles.map((role) => ({
        value: role.id,
        label: role.name,
      }));
      setRoleOptions(options);
      const selectedRoles = options.filter((option) =>
        userRoles.includes(option.label)
      );
      setSelectedRoles(selectedRoles);
      // Obtener los IDs de los roles seleccionados
      const selectedRoleIds = selectedRoles.map((option) => option.value);
      setFormUser((prevFormUser) => ({
        ...prevFormUser,
        roleIds: selectedRoleIds,
      }));
    };
    getProjects();
    getRoles();
  }, [users]);

  const handleProjectChange = (selectedOptions) => {
    const selectedProjectIds = selectedOptions.map((option) => option.value);
    setFormUser((prevFormUser) => ({
      ...prevFormUser,
      projectIds: selectedProjectIds,
    }));
  };

  const handleRoleChange = (selectedOptions) => {
    const selectedRoleIds = selectedOptions.map((option) => option.value);
    const mappedRoleIds = [...selectedRoleIds];

    const getAdditionalRoleLabels = (roleLabel) => {
      switch (roleLabel) {
        case "ADMINLEAD":
          return ["ADMINTOOL", "USERLEAD"];
        case "ADMINTOOL":
          return ["USERLEAD"];
        default:
          return [];
      }
    };

    selectedOptions.forEach((option) => {
      const additionalRoleLabels = getAdditionalRoleLabels(option.label);
      console.log(additionalRoleLabels);

      const additionalRoleIds = roleOptions
        .filter((option) => additionalRoleLabels.includes(option.label))
        .map((option) => option.value);
      console.log(additionalRoleIds);
      mappedRoleIds.push(...additionalRoleIds);
    });

    setSelectedRoles(selectedOptions);

    setFormUser((prevFormUser) => ({
      ...prevFormUser,
      roleIds: mappedRoleIds,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Actualizar proyectos y roles del usuario
      await client.put("/users/projects/roles", formUser);

      // Actualizar la lista de usuarios
      getUsers();
      updateUserInfo();

      notify({
        title: "Success",
        message: "User data updated successfully",
        status: "success",
        dismissible: true,
      });

      setIsModalOpen(false);
    } catch (error) {
      notify({
        title: "Error",
        message: "An error occurred while updating user data",
        status: "error",
        dismissible: true,
      });
    }
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger title="Edit">
        <AiOutlineEdit fontSize={24} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title className="DialogTitle">User Data</Dialog.Title>
          <form>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="projects">
                Projects
              </label>
              <Select
                className="SelectContainer"
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={selectedProjects}
                isMulti
                options={projectOptions}
                onChange={handleProjectChange}
              />
            </fieldset>
            <Restricted to={["ADMINLEAD"]}>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="roles">
                  Roles
                </label>
                <Select
                  className="SelectContainer"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={selectedRoles}
                  isMulti
                  options={roleOptions}
                  onChange={handleRoleChange}
                />
              </fieldset>
            </Restricted>
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            >
              <Dialog.Close asChild>
                <button
                  onClick={handleSubmit}
                  className="Button green"
                  aria-label="Close"
                >
                  Save Changes
                </button>
              </Dialog.Close>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <RxCross2 />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const overlayShow = keyframes`
from {
    opacity: 0;
}
to {
    opacity: 1;
}`;

const contentShow = keyframes`
from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
}
to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
`;

const overlayStyle = {
  backgroundColor: "var(--blackA9)",
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
};

const contentStyle = {
  backgroundColor: "white",
  borderRadius: "6px",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "900px",
  maxHeight: "85vh",
  padding: "25px",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  ":focus": {
    outline: "none",
  },
  ".SelectContainer": {
    width: "100%", // Establece el ancho en 100%
  },
  ".DialogTitle": {
    margin: 0,
    fontWeight: "500",
    color: "var(--mauve12)",
    fontSize: "17px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  },
  ".Button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    padding: "0 15px",
    fontSize: "15px",
    lineHeight: 1,
    fontWeight: "500",
    height: "35px",
  },
  ".Button.violet": {
    backgroundColor: "white",
    color: "var(--violet11)",
    boxShadow: "0 2px 10px var(--blackA7)",
    ":hover": {
      backgroundColor: "var(--mauve3)",
    },
    ":focus": {
      boxShadow: "0 0 0 2px black",
    },
  },
  ".Button.green": {
    backgroundColor: "var(--green4)",
    color: "var(--green11)",
    ":hover": {
      backgroundColor: "var(--green5)",
    },
    ":focus": {
      boxShadow: "0 0 0 2px var(--green7)",
    },
  },
  ".IconButton": {
    fontFamily: "inherit",
    borderRadius: "100%",
    height: "25px",
    width: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--violet11)",
    position: "absolute",
    top: "10px",
    right: "10px",
    ":hover": {
      backgroundColor: "var(--violet4)",
    },
    ":focus": {
      boxShadow: "box-shadow: 0 0 0 2px var(--violet7)",
    },
  },
  ".Fieldset": {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "15px",
    border: "none",
  },
  ".Label": {
    fontSize: "15px",
    color: "var(--violet11)",
    width: "90px",
    textAlign: "right",
  },
  ".Input": {
    border: "none",
    width: "100%",
    flex: "1",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    padding: "0 10px",
    fontSize: "15px",
    lineHeight: "1",
    color: "var(--violet11)",
    boxShadow: "0 0 0 1px var(--violet7)",
    height: "35px",
    marginBottom: "5px",
    ":focus": {
      boxShadow: "0 0 0 2px var(--violet8)",
    },
  },
};
