/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/green.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import * as Dialog from "@radix-ui/react-dialog";
import { forwardRef, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNotifications } from "reapop";

import { client } from "../../../helpers/config";

const AddSoftwareSettingsModal = forwardRef(
  ({ id, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [softwares, setSoftwares] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [formAddSoftware, setFormAddSoftware] = useState({
      projectId: id,
      adminId: 0,
      softwareId: 0,
    });

    const updateUnselectedSoftwares = async () => {
      const unselectedSoftwares = await client.get(
        `/projects/${id}/softwares/unselected`
      );
      setSoftwares(unselectedSoftwares.data);
    };

    useEffect(() => {
      const getAdmins = async () => {
        const admins = await client.get("/users/admins");
        setAdmins(admins.data.Admins);
      };
      updateUnselectedSoftwares();
      getAdmins();
    }, [open]);

    useEffect(() => {
      const allFieldsFilled =
        !!formAddSoftware.adminId && !!formAddSoftware.softwareId;
      setDisableCloseButton(!allFieldsFilled);
    }, [formAddSoftware.adminId, formAddSoftware.softwareId]);

    const submitAddSoftware = async (event) => {
      event.preventDefault();
      if (!formAddSoftware.adminId || !formAddSoftware.softwareId) {
        return notify("Please, fill all fields", "error");
      }
      await client.post("/projects/softwares", formAddSoftware);
      notify("Software added successfully!", "success");
      getProjectTree();
      setFormAddSoftware({ projectId: id, adminId: 0, softwareId: 0 });
      setDisableCloseButton(true);
      setOpen(false);
      updateUnselectedSoftwares(); // Actualizar la lista de softwares no seleccionados
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormAddSoftware((prev) => ({ ...prev, [name]: value }));
      // Verificar si todos los campos están completos
      const allFieldsFilled = !!value; // Verificar si el campo no está vacío
      setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
    };

    return (
      <div ref={ref}>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay css={overlayStyle} />
            <Dialog.Content css={contentStyle}>
              <Dialog.Title className="DialogTitle">
                Add Software and Admin
              </Dialog.Title>
              <form onSubmit={submitAddSoftware}>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="software">
                    Software
                  </label>
                  <select
                    name="softwareId"
                    value={formAddSoftware.softwareId}
                    onChange={handleChange}
                  >
                    <option value="">Select a software...</option>
                    {softwares.map((software) => (
                      <option key={software.id} value={software.id}>
                        {software.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="admin">
                    Admin
                  </label>
                  <select
                    name="adminId"
                    value={formAddSoftware.adminId}
                    onChange={handleChange}
                  >
                    <option value="">Select an admin...</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name}
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
                  onClick={submitAddSoftware}
                >
                  <Dialog.Close asChild>
                    <button
                      className={disableCloseButton ? "Button" : "Button green"}
                      aria-label="Close"
                      disabled={disableCloseButton}
                    >
                      Add Software
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
      </div>
    );
  }
);

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
    marginBottom: "5px",
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

export default AddSoftwareSettingsModal;
