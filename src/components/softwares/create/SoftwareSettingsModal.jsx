import { forwardRef, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const SoftwareSettingsModal = forwardRef(
  ({ id, getSoftwareTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [formTask, setFormTask] = useState({
      name: "",
      softwareId: id,
    });

    const createSubmitTask = async (event) => {
      event.preventDefault();

      try {
        if (!formTask.name) {
          setNameIsEmpty(!formTask.name);
          return notify("Please, fill all fields", "error");
        }
        await client.post("/tasks/", formTask);
        notify("Task created successfully!", "success");
        getSoftwareTree();
        setFormTask({ name: "", softwareId: id });
        setNameIsEmpty(false);
        setDisableCloseButton(true);
        setOpen(false); // Cerrar el modal al crear el proyecto
      } catch (error) {
        const errorMessage = error.response.data.error;
        getSoftwareTree();
        notify(errorMessage, "error");
      }
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormTask((prev) => ({ ...prev, [name]: value }));
      if (name === "name") {
        setNameIsEmpty(!value);
      }

      // Verificar si todos los campos están completos
      const allFieldsFilled = !!value; // Verificar si el campo no está vacío
      setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
    };

    return (
      <div ref={ref}>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Task</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={createSubmitTask} id="createTask">
                <fieldset>
                  <label htmlFor="name">Task</label>
                  <TextField
                    id="name"
                    name="name"
                    value={formTask.name}
                    placeholder="Name"
                    onChange={handleChange}
                    error={nameIsEmpty ? "Required" : null}
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
                  form="createTask"
                >
                  Create Subtask
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default SoftwareSettingsModal;
