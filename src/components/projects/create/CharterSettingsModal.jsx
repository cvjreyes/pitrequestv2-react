import { forwardRef, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const CharterSettingsModal = forwardRef(
  ({ id, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [formCharter, setFormCharter] = useState({
      name: "",
      projectId: id,
    });

    const createSubmitCharter = async (event) => {
      event.preventDefault();
      try {
        if (!formCharter.name) {
          setNameIsEmpty(!formCharter.name);
          return notify("Please, fill all fields", "error");
        }
        await client.post("/charters/", formCharter);
        notify("Task created successfully!", "success");
        getProjectTree();
        setFormCharter({ name: "", projectId: id });
        setNameIsEmpty(false);
        setDisableCloseButton(true);
        setOpen(false); // Cerrar el modal al crear el proyecto
      } catch (error) {
        const errorMessage = error.response.data.error;
        notify(errorMessage, "error");
        getProjectTree();
      }
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormCharter((prev) => ({ ...prev, [name]: value }));
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
              <Dialog.Title>Create Charter</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={createSubmitCharter} id="createCharter">
                <fieldset>
                  <label htmlFor="name">Charter</label>
                  <TextField
                    id="name"
                    name="name"
                    value={formCharter.name}
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
                  form="createCharter"
                >
                  Create Charter
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default CharterSettingsModal;
