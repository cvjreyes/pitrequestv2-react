/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNotifications } from "reapop";
import { MdPlaylistAdd } from "react-icons/md";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/green.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";

import { client } from "../../../helpers/config";
import { Input } from "../../general";

export default function SoftwareModal({ users, getSoftwareTree }) {
  const { notify } = useNotifications();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
    adminId: 0,
  });

  const createSubmitSoftware = async (event) => {
    event.preventDefault();
    if (!formSoftware.name || !formSoftware.code) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      return notify("Please, fill all fields", "error");
    }
    if (formSoftware.code.length > 5)
      return notify("Code can't have more than 5 characters", "error");

    await client.post("/software/create", formSoftware);
    notify("Software created successfully!", "success");
    getSoftwareTree();
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
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <MdPlaylistAdd fontSize="25px" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title className="DialogTitle">Create Software</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Make sure the software is correct, you will not be available to
            change name of software
          </Dialog.Description>
          <form onSubmit={createSubmitSoftware}>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="name">
                Software
              </label>
              <Input
                className="Input"
                id="name"
                name="name"
                value={formSoftware.name}
                placeholder="Name"
                onChange={handleChange}
                error={nameIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="code">
                Code
              </label>
              <Input
                className="Input"
                id="code"
                name="code"
                value={formSoftware.code}
                placeholder="Code"
                onChange={handleChange}
                error={codeIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="admin">
                Admin
              </label>
              <select
                name="adminId"
                value={formSoftware.adminId}
                onChange={handleChange}
              >
                <option value="">-- Select Admin --</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
              onClick={createSubmitSoftware}
            >
              <Dialog.Close asChild>
                <button className="Button green">Create Software</button>
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
  },
  ".DialogDescription": {
    margin: "10px 0 20px",
    color: "var(--mauve11)",
    fontSize: "15px",
    lineHeight: "1.5",
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