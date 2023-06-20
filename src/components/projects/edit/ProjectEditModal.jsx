import { useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

export default function ProjectEditModal({
  id,
  getProjectTree,
  open,
  setOpen,
}) {
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [hoursIsEmpty, setHoursIsEmpty] = useState(false);

  const [modifiedFields, setModifiedFields] = useState({
    name: false,
    code: false,
    estimatedHours: false,
  });

  const [formProject, setFormProject] = useState({
    name: "",
    code: "",
    estimatedHours: 500,
  });

  const getOneProject = async () => {
    const project = await client.get(`/projects/${id}`);
    if (project.data) {
      setFormProject({
        name: project.data.name,
        code: project.data.code,
        estimatedHours: project.data.estimatedHours,
      });
    }
  };

  useEffect(() => {
    getOneProject();
  }, []);

  const updateSubmitProject = async (event) => {
    event.preventDefault();
    try {
      if (
        !formProject.name ||
        !formProject.code ||
        !formProject.estimatedHours
      ) {
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

      const modifiedFieldsToSend = Object.entries(modifiedFields)
        .filter(([_, modified]) => modified)
        .reduce((obj, [fieldName, _]) => {
          obj[fieldName] = formProject[fieldName];
          return obj;
        }, {});

      await client.put(`/projects/${id}`, modifiedFieldsToSend);
      notify("Project updated successfully!", "success");
      getProjectTree();
      setNameIsEmpty(false);
      setCodeIsEmpty(false);
      setHoursIsEmpty(false);
      setDisableCloseButton(true);
      getOneProject();
      setOpen(false);
    } catch (error) {
      const errorMessage = error.response.data.error;
      notify(errorMessage, "error");
      getProjectTree();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProject((prev) => ({ ...prev, [name]: value }));
    setModifiedFields((prev) => ({ ...prev, [name]: true }));
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
      updateSubmitProject(event);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Update Project</Dialog.Title>
          <Dialog.Description>
            Make sure the Project is correct, you will not be available to
            change name of Project
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form onSubmit={updateSubmitProject} id="editProject">
            <fieldset>
              <label htmlFor="name">Project</label>
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
            <fieldset>
              <label htmlFor="code">Code</label>
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
            <fieldset>
              <label htmlFor="estimatedHours">Estimated Hours</label>
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
              form="editProject"
            >
              Update Project
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
