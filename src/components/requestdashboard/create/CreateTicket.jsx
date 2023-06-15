/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/green.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNotifications } from "reapop";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../helpers/config";
import { Input } from "../../general";

export default function CreateTicket({ getTickets }) {
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const { user } = useAuth();

  const [subjectIsEmpty, setSubjectIsEmpty] = useState(false);
  const [descriptionIsEmpty, setDescriptionIsEmpty] = useState(false);

  const [projects, setProjects] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTicket, setFormTicket] = useState({
    code: "",
    raisedBy: user.id,
    projectId: 0,
    softwareId: 0,
    adminId: 0,
    subject: "",
    description: "",
  });

  const getProjectsNames = async () => {
    const projectsNames = await client.get("/projects/name");
    setProjects(projectsNames.data.Projects);
  };

  const updateSelectedSoftwares = async () => {
    const selectedSoftwares = await client.get(
      `/projects/${formTicket.projectId}/softwares/selected`
    );
    setSoftwares(selectedSoftwares.data);
  };

  const getAdminsFromSoftware = async () => {
    const admins = await client.get(
      `/projects/${formTicket.projectId}/softwares/${formTicket.softwareId}/admins/assigned`
    );
    setAdmins(admins.data.admins);
  };

  useEffect(() => {
    getProjectsNames();
  }, []);

  useEffect(() => {
    updateSelectedSoftwares();
  }, [formTicket.projectId]);

  useEffect(() => {
    getAdminsFromSoftware();
  }, [formTicket.softwareId]);

  const createSubmitTicket = async (event) => {
    event.preventDefault();
    if (!formTicket.subject || !formTicket.description) {
      setSubjectIsEmpty(!formTicket.subject);
      setDescriptionIsEmpty(!formTicket.description);
      return notify("Please, fill all fields", "error");
    }

    if (!formTicket.projectId || !formTicket.softwareId || !formTicket.adminId) {
      return notify("To create a ticket select a Project, Software and Admin", "error");
    }

    // Generar el número de identificación con el prefijo
    const response = await client.get("/tickets/");
    const tickets = response.data;
    const ticketCount = tickets.length;
    const ticketId = String(ticketCount + 1).padStart(6, "0");
    const ticketCode = `TIC${ticketId}`;

    // Actualizar la propiedad "code" del ticket
    const ticketWithCode = {
      ...formTicket,
      code: ticketCode,
    };

    await client.post("/tickets/", ticketWithCode);
    notify("Ticket created successfully!", "success");
    getTickets();
    setFormTicket({
      code: "",
      raisedBy: user.id,
      projectId: 0,
      softwareId: 0,
      adminId: 0,
      subject: "",
      description: "",
    });
    setSubjectIsEmpty(false);
    setDescriptionIsEmpty(false);
    setDisableCloseButton(true);
    setIsModalOpen(false); // Cerrar el modal al crear el proyecto
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormTicket((prev) => ({ ...prev, [name]: value }));
    if (name === "subject") {
      setSubjectIsEmpty(!value);
    } else if (name === "description") {
      setDescriptionIsEmpty(!value);
    }
    // Verificar si todos los campos están completos
    const allFieldsFilled = !!value; // Verificar si el campo no está vacío
    setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createSubmitTicket(event);
    }
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger title="Create Ticket" css={dialogTriggerStyle}>
        Create ticket
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title className="DialogTitle">Create Ticket</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Make sure the Ticket is correct, you will not be available to delete
            the Ticket
          </Dialog.Description>
          <form onSubmit={createSubmitTicket}>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="subject">
                Subject
              </label>
              <Input
                className="Input"
                id="subject"
                name="subject"
                value={formTicket.subject}
                placeholder="Subject"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={subjectIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="description">
                Description
              </label>
              <Input
                className="Input"
                id="description"
                name="description"
                value={formTicket.description}
                placeholder="Description"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={descriptionIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="project">
                Project
              </label>
              <select
                name="projectId"
                value={formTicket.projectId}
                onChange={handleChange}
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </fieldset>
            {softwares.length > 0 && (
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="software">
                  Software
                </label>
                <select
                  name="softwareId"
                  value={formTicket.softwareId}
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
            )}
            {admins.length > 0 && (
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="admin">
                  Admin
                </label>
                <select
                  name="adminId"
                  value={formTicket.adminId}
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
            )}
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                className={disableCloseButton ? "Button" : "Button green"}
                aria-label="Close"
                disabled={disableCloseButton}
              >
                Create Ticket
              </button>
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

const dialogTriggerStyle = {
  background: "#155AAA",
  color: "white",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  marginLeft: "auto",
  marginRight: "10%"
};


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
