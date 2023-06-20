import { forwardRef, useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, TextField } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const CharterEditModal = forwardRef(
  ({ id, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [formCharter, setFormCharter] = useState({
      name: "",
    });

    useEffect(() => {
      const getOneCharter = async () => {
        const charter = await client.get(`/charters/${id}`);
        if (charter.data) {
          setFormCharter({
            name: charter.data.name,
          });
        }
      };
      getOneCharter();
    }, []);

    const editSubmitCharter = async (event) => {
      event.preventDefault();
      try {
        if (!formCharter.name) {
          setNameIsEmpty(!formCharter.name);
          return notify("Please, fill all fields", "error");
        }
        await client.put(`/charters/${id}`, formCharter);
        notify("Task created successfully!", "success");
        getProjectTree();
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
              <Dialog.Title>Edit Charter</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={editSubmitCharter} id="editCharter">
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
                  form="editCharter"
                >
                  Update Charter
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default CharterEditModal;
