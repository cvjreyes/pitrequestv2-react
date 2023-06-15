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
import FileUploader from "../../general/FileUploader";

export default function CreateTicket({ getTickets }) {
  const { notify } = useNotifications();
  const { user } = useAuth();

  const [disableCreateButton, setDisableCreateButton] = useState(true);

  const [formErrors, setFormErrors] = useState({
    subject: false,
    description: false,
  });

  const [disableSoftwareSelect, setDisableSoftwareSelect] = useState(true);
  const [disableAdminSelect, setDisableAdminSelect] = useState(true);

  const [projects, setProjects] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTicket, setFormTicket] = useState({
    raisedBy: user.id,
    projectId: 0,
    softwareId: 0,
    adminId: 0,
    subject: "",
    description: "",
  });

  const handleFileUpload = (files) => {
    // console.log("Files:", files);
    setSelectedFiles(files);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [projectsNamesResponse, selectedSoftwaresResponse, adminsResponse] =
        await Promise.all([
          client.get("/projects/name"),
          client.get(`/projects/${formTicket.projectId}/softwares/selected`),
          client.get(
            `/projects/${formTicket.projectId}/softwares/${formTicket.softwareId}/admins/assigned`
          ),
        ]);

      setProjects(projectsNamesResponse.data.Projects);
      setSoftwares(selectedSoftwaresResponse.data);
      setAdmins(adminsResponse.data.admins);

      setDisableSoftwareSelect(formTicket.projectId === 0);
      setDisableAdminSelect(formTicket.softwareId === 0);
    };

    fetchData();
  }, [formTicket.projectId, formTicket.softwareId]);

  const createSubmitTicket = async (event) => {
    event.preventDefault();
    if (
      !formTicket.subject ||
      !formTicket.description ||
      selectedFiles.length === 0
    ) {
      setFormErrors({
        subject: !formTicket.subject,
        description: !formTicket.description,
      });
      return notify("Please, fill all fields", "error");
    }

    if (
      !formTicket.projectId ||
      !formTicket.softwareId ||
      !formTicket.adminId
    ) {
      return notify(
        "To create a ticket select a Project, Software and Admin",
        "error"
      );
    }

    const formData = new FormData();

    // Agregar los archivos seleccionados al objeto FormData
    selectedFiles.forEach((file) => {
      // console.log("file:", file);
      formData.append("tickets", file);
    });

    // Agregar otros datos al objeto FormData
    formData.append("raisedBy", formTicket.raisedBy);
    formData.append("projectId", formTicket.projectId);
    formData.append("softwareId", formTicket.softwareId);
    formData.append("adminId", formTicket.adminId);
    formData.append("subject", formTicket.subject);
    formData.append("description", formTicket.description);

    try {
      await client.post("/tickets/", formData);
      notify("Ticket created successfully", "success");
      getTickets();
      setSelectedFiles([]);
      setIsModalOpen(false);
      setFormTicket({
        raisedBy: user.id,
        projectId: 0,
        softwareId: 0,
        adminId: 0,
        subject: "",
        description: "",
      }); // Reset the form
    } catch (error) {
      notify("Failed to create ticket", "error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormTicket((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificar si los campos requeridos están vacíos
    const isSubjectEmpty = name === "subject" && value === "";
    const isDescriptionEmpty = name === "description" && value === "";

    setFormErrors((prevState) => ({
      ...prevState,
      subject: isSubjectEmpty,
      description: isDescriptionEmpty,
    }));

    // Verificar los campos y actualizar el estado del botón
    const isSubjectError = isSubjectEmpty || formErrors.subject;
    const isDescriptionError = isDescriptionEmpty || formErrors.description;

    setDisableCreateButton(isSubjectError || isDescriptionError);
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
              <input
                className="Input"
                id="subject"
                name="subject"
                value={formTicket.subject}
                placeholder="Subject"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={formErrors.subject ? "Required" : null}
              />
            </fieldset>
            {formErrors.subject && (
              <span className="ErrorMessage">Required</span>
            )}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="description">
                Description
              </label>
              <textarea
                className="TextArea"
                name="description"
                placeholder="Description"
                value={formTicket.description}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={formErrors.description ? "Required" : null}
              />
            </fieldset>
            {formErrors.description && (
              <span className="ErrorMessage">Required</span>
            )}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="project">
                Project
              </label>
              <select
                name="projectId"
                value={formTicket.projectId}
                onChange={handleChange}
              >
                <option value={0}>Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="software">
                Software
              </label>
              <select
                name="softwareId"
                value={formTicket.softwareId}
                onChange={handleChange}
                disabled={disableSoftwareSelect} // Desactivar el campo si no hay proyecto seleccionado
              >
                <option value={0}>Select a software...</option>
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
                value={formTicket.adminId}
                onChange={handleChange}
                disabled={disableAdminSelect} // Desactivar el campo si no hay software seleccionado
              >
                <option value={0}>Select an admin...</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="admin">
                Attach
              </label>
              <FileUploader onFileUpload={handleFileUpload} name="tickets" />
            </fieldset>
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                className={disableCreateButton ? "Button" : "Button green"}
                aria-label="Close"
                disabled={disableCreateButton}
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
  marginRight: "10%",
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
  maxWidth: "650px",
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
    marginTop: "15px",
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
    ":invalid": {
      boxShadow: "0 0 0 2px red", // Estilo para los campos con errores
    },
  },
  ".TextArea": {
    border: "none",
    width: "100%",
    flex: "1",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    padding: "10px",
    fontSize: "15px",
    lineHeight: "1",
    color: "var(--violet11)",
    boxShadow: "0 0 0 1px var(--violet7)",
    height: "100px",
    marginBottom: "5px",
    ":focus": {
      boxShadow: "0 0 0 2px var(--violet8)",
    },
    ":invalid": {
      boxShadow: "0 0 0 2px red", // Estilo para los campos con errores
    },
  },
  ".ErrorMessage": {
    display: "flex",
    color: "red",
    fontSize: "13px",
    marginLeft: "20%",
  },
};
