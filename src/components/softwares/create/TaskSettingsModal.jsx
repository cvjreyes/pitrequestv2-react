import { forwardRef, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const TaskSettingsModal = forwardRef(
  ({ id, getSoftwareTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [formSubtask, setFormSubtask] = useState({
      name: "",
      taskId: id,
    });

    const createSubmitSubTask = async (event) => {
      event.preventDefault();
      try {
        if (!formSubtask.name) {
          setNameIsEmpty(!formSubtask.name);
          return notify("Please, fill all fields", "error");
        }
        await client.post("/subtasks", formSubtask);
        notify("Task created successfully!", "success");
        getSoftwareTree();
        setFormSubtask({ name: "", taskId: id });
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
      setFormSubtask((prev) => ({ ...prev, [name]: value }));
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
              <Dialog.Title>Create SubTask</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={createSubmitSubTask} id="createSubtask">
                <fieldset>
                  <label htmlFor="name">SubTask</label>
                  <TextField
                    id="name"
                    name="name"
                    value={formSubtask.name}
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
                  form="createSubtask"
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

export default TaskSettingsModal;
