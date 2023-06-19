import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { useNotifications } from "reapop";

import {
  Button,
  Dialog,
  IconButton,
  TextField,
} from "@nachogonzalezv99/ui-library";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../helpers/config";

export default function ProjectModal({ getProjectTree }) {
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const { user } = useAuth();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [hoursIsEmpty, setHoursIsEmpty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formProject, setFormProject] = useState({
    name: "",
    code: "",
    estimatedHours: 500,
    userProjectId: user.id,
  });

  const createSubmitProject = async (event) => {
    event.preventDefault();
    if (!formProject.name || !formProject.code || !formProject.estimatedHours) {
      setNameIsEmpty(!formProject.name);
      setCodeIsEmpty(!formProject.code);
      setHoursIsEmpty(!formProject.estimatedHours);
      return notify("Please, fill all fields", "error");
    }
    if (formProject.code.length > 10)
      return notify("Code can't have more than 10 characters", "error");

    if (!Number(formProject.estimatedHours)) {
      return notify("The estimated hours only accept numbers", "error");
    }

    await client.post("/projects/", formProject);
    notify("Project created successfully!", "success");
    getProjectTree();
    setFormProject({
      name: "",
      code: "",
      estimatedHours: 500,
      userProjectId: user.id,
    });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
    setHoursIsEmpty(false);
    setDisableCloseButton(true);
    setIsModalOpen(false); // Cerrar el modal al crear el proyecto
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProject((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    } else if (name === "estimatedHours") {
      setHoursIsEmpty(!value);
    }
    // Verificar si todos los campos están completos
    const allFieldsFilled = !!value; // Verificar si el campo no está vacío
    setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createSubmitProject(event);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger title="Create Project">
        <IconButton size="md" className="mt-1">
          <AiFillFolderAdd />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="DialogTitle">Create Project</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Make sure the Project is correct, you will not be available to
            change name of Project
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form onSubmit={createSubmitProject} id="createProject">
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="name">
                Project
              </label>
              <TextField
                id="name"
                name="name"
                value={formProject.name}
                placeholder="Name"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={nameIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="code">
                Code
              </label>
              <TextField
                id="code"
                name="code"
                value={formProject.code}
                placeholder="Code"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={codeIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="estimatedHours">
                Estimated Hours
              </label>
              <TextField
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formProject.estimatedHours}
                placeholder="Hours"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={hoursIsEmpty ? "Required" : null}
              />
            </fieldset>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <div className="flex">
            <Button
              variant="contained"
              disabled={disableCloseButton}
              className="ml-auto"
              form="createProject"
            >
              Create Project
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
