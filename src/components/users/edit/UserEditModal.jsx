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

import { client } from "../../../helpers/config";

export default function UserEditModal({
  getUsers,
  id,
  userProjects,
  userRoles,
}) {
  const { notify } = useNotifications();
  const animatedComponents = makeAnimated();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUser, setFormUser] = useState({
    userId: id,
    projectId: 0,
    roleId: 0,
  });

  const [allProjects, setAllProjects] = useState([]);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const response = await client.get("/projects/");
      console.log(response.data.Projects[0].name);
      setAllProjects(response.data.Projects);
    };
    getProjects();
  }, []);

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
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[userProjects[0]]}
                isMulti
                options={allProjects}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="roles">
                Roles
              </label>
              <p>{userRoles}</p>
            </fieldset>
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            >
              <Dialog.Close asChild>
                <button
                  //   onClick={createSubmitSoftware}
                  className={disableCloseButton ? "Button" : "Button green"}
                  aria-label="Close"
                  disabled={disableCloseButton}
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
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: "25px",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  ":focus": {
    outline: "none",
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
