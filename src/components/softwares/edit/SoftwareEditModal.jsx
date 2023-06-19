import { useEffect, useState } from "react";
import { useNotifications } from "reapop";

import {
  Button,
  Dialog,
  TextField
} from "@nachogonzalezv99/ui-library";
import { client } from "../../../helpers/config";

export default function SoftwareEditModal({
  id,
  getSoftwareTree,
  open,
  setOpen,
}) {
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);

  const [nameModified, setNameModified] = useState(false);
  const [codeModified, setCodeModified] = useState(false);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
  });

  const getOneSoftware = async () => {
    const software = await client.get(`/softwares/${id}`);
    if (software.data) {
      setFormSoftware({ name: software.data.name, code: software.data.code });
    }
  };

  useEffect(() => {
    getOneSoftware();
  }, []);

  const updateSubmitSoftware = async (event) => {
    event.preventDefault();
    try {
      if (!nameModified && !codeModified) {
        // No hay campos modificados
        return;
      }
      const updatedFields = {};
      if (nameModified) {
        updatedFields.name = formSoftware.name;
      }
      if (codeModified) {
        updatedFields.code = formSoftware.code;
      }

      if (!formSoftware.name || !formSoftware.code) {
        setNameIsEmpty(!formSoftware.name);
        setCodeIsEmpty(!formSoftware.code);
        return notify("Please, fill all fields", "error");
      }
      if (formSoftware.code.length > 10)
        return notify("Code can't have more than 10 characters", "error");

      await client.put(`/softwares/${id}`, updatedFields);
      notify("Software updated successfully!", "success");
      getSoftwareTree();
      setNameIsEmpty(false);
      setCodeIsEmpty(false);
      setDisableCloseButton(true);
      getOneSoftware();
      setOpen(false); // Cerrar el modal al crear el proyecto
    } catch (error) {
      const errorMessage = error.response.data.error;
      getSoftwareTree();
      notify(errorMessage, "error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
      setNameModified(true);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
      setCodeModified(true);
    }
    // Verificar si todos los campos están completos
    const allFieldsFilled = !!value; // Verificar si el campo no está vacío
    setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      updateSubmitSoftware(event);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Update Software</Dialog.Title>
          <Dialog.Description>
            Make sure the software is correct, you will not be available to
            change name of software
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form onSubmit={updateSubmitSoftware} id="editSoftware">
            <fieldset>
              <label htmlFor="name">
                Software
              </label>
              <TextField
                id="name"
                name="name"
                value={formSoftware.name}
                placeholder="Name"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={nameIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="code">
                Code
              </label>
              <TextField
                id="code"
                name="code"
                value={formSoftware.code}
                placeholder="Code"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={codeIsEmpty ? "Required" : null}
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
              form="editSoftware"
            >
              Edit Software
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
