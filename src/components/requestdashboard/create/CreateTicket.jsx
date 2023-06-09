import { useEffect, useState } from "react";
import { useNotifications } from "reapop";

import {
  Button,
  Dialog,
  Select,
  TextField,
  UploadFiles,
} from "@nachogonzalezv99/ui-library";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../helpers/config";

export default function CreateTicket({ getTickets }) {
  const { notify } = useNotifications();
  const { user } = useAuth();

  const [disableCreateButton, setDisableCreateButton] = useState(true);

  const [formErrors, setFormErrors] = useState({
    subject: false,
    description: false,
  });

  const [projects, setProjects] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTicket, setFormTicket] = useState({
    raisedBy: user.id,
    projectId: undefined,
    softwareId: undefined,
    adminId: undefined,
    subject: "",
    description: "",
  });

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
    };

    fetchData();
  }, [formTicket.projectId, formTicket.softwareId]);

  useEffect(() => {
    if (formTicket.projectId) {
      setFormTicket((prevState) => ({
        ...prevState,
        softwareId: undefined,
        adminId: undefined,
      }));
    }
  }, [formTicket.projectId]);

  useEffect(() => {
    if (formTicket.softwareId && formTicket.adminId) {
      setFormTicket((prevState) => ({
        ...prevState,
        adminId: undefined,
      }));
    }
  }, [formTicket.softwareId]);

  const createSubmitTicket = async (event) => {
    event.preventDefault();
    if (!formTicket.subject || !formTicket.description) {
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
        projectId: undefined,
        softwareId: undefined,
        adminId: undefined,
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

    // Convertir en undefined el softwareId y adminId al cambiar el projectId
    if (name === "projectId") {
      setFormTicket((prevState) => ({
        ...prevState,
        softwareId: undefined,
        adminId: undefined,
      }));
    }

    // Convertir en undefined el adminId al cambiar el softwareId si el adminId está relleno
    if (name === "softwareId" && formTicket.adminId) {
      setFormTicket((prevState) => ({
        ...prevState,
        adminId: undefined,
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createSubmitTicket(event);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger>
        {/* <Button className="md:bg-blue-500 text-white hover:text-black"> */}
        <Button variant="contained">Create ticket</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="">Create Ticket</Dialog.Title>
          <Dialog.Description className="">
            Make sure the Ticket is correct, you will not be available to delete
            the Ticket
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form
            onSubmit={createSubmitTicket}
            className="flex flex-col gap-4"
            id="createTicket"
          >
            <fieldset className="flex flex-col">
              <label className="" htmlFor="subject">
                Subject
              </label>
              <TextField
                id="subject"
                name="subject"
                value={formTicket.subject}
                placeholder="Subject"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={formErrors.subject ? "Required" : null}
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="description">
                Description
              </label>
              <TextField
                name="description"
                placeholder="Description"
                value={formTicket.description}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={formErrors.description ? "Required" : null}
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="project">
                Project
              </label>
              <Select
                placeholder="Select a project ..."
                value={formTicket.projectId}
                onValueChange={(value) =>
                  setFormTicket((prev) => ({ ...prev, projectId: value }))
                }
              >
                {projects.map((project) => (
                  <Select.Item key={project.id} value={project.id}>
                    {project.name}
                  </Select.Item>
                ))}
              </Select>
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="software">
                Software
              </label>
              <Select
                value={formTicket.softwareId}
                onValueChange={(value) =>
                  setFormTicket((prev) => ({ ...prev, softwareId: value }))
                }
                placeholder="Select a software ..."
                disabled={!formTicket.projectId} // Desactivar el campo si no hay proyecto seleccionado
              >
                {softwares.map((software) => (
                  <Select.Item key={software.id} value={software.id}>
                    {software.name}
                  </Select.Item>
                ))}
              </Select>
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="admin">
                Admin
              </label>
              <Select
                value={formTicket.adminId}
                onValueChange={(value) =>
                  setFormTicket((prev) => ({ ...prev, adminId: value }))
                }
                placeholder="Select an admin ..."
                disabled={!formTicket.softwareId} // Desactivar el campo si no hay software seleccionado
              >
                {admins.map((admin) => (
                  <Select.Item key={admin.id} value={admin.id}>
                    {admin.name}
                  </Select.Item>
                ))}
              </Select>
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="attach">
                Attach
              </label>

              {/* <FileUploader onFileUpload={handleFileUpload} name="tickets" /> */}
              <UploadFiles
                maxFiles={3}
                files={selectedFiles}
                setFiles={setSelectedFiles}
                accept={{
                  "image/png": [".png"],
                  "image/jpg": [".jpg", ".jpeg"],
                }}
                maxSize={10000000}
              />
            </fieldset>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <div className="flex">
            <Button
              variant="contained"
              disabled={disableCreateButton}
              className="ml-auto"
              form="createTicket"
            >
              Create Ticket
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
