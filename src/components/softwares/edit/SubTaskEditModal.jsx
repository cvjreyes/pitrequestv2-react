import { forwardRef, useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const SubTaskEditModal = forwardRef(
  ({ id, getSoftwareTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [formSubtask, setFormSubtask] = useState({
      name: "",
    });

    useEffect(() => {
      const getOneSubTask = async () => {
        const Subtask = await client.get(`/subtasks/${id}`);
        if (Subtask.data) {
          setFormSubtask({ name: Subtask.data.name });
        }
      };
      getOneSubTask();
    }, []);

    const updateSubmitSubTask = async (event) => {
      event.preventDefault();
      try {
        if (!formSubtask.name) {
          setNameIsEmpty(!formSubtask.name);
          return notify("Please, fill all fields", "error");
        }
        await client.put(`/subtasks/${id}`, formSubtask);
        notify("Task updated successfully!", "success");
        getSoftwareTree();
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
              <Dialog.Title>Update SubTask</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={updateSubmitSubTask} id="editSubTask">
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
                  form="editSubTask"
                >
                  Edit SubTask
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default SubTaskEditModal;
