import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { useNotifications } from "reapop";

import {
  Button,
  Dialog,
  TextField,
  IconButton,
} from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

export default function SoftwareModal({ getSoftwareTree }) {
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
  });

  const createSubmitSoftware = async (event) => {
    event.preventDefault();
    if (!formSoftware.name || !formSoftware.code) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      return notify("Please, fill all fields", "error");
    }
    if (formSoftware.code.length > 10)
      return notify("Code can't have more than 10 characters", "error");

    await client.post("/softwares/", formSoftware);
    notify("Software created successfully!", "success");
    getSoftwareTree();
    setFormSoftware({ name: "", code: "" });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
    setDisableCloseButton(true);
    setIsModalOpen(false); // Cerrar el modal al crear el proyecto
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    }
    // Verificar si todos los campos están completos
    const allFieldsFilled = !!value; // Verificar si el campo no está vacío
    setDisableCloseButton(!allFieldsFilled); // Desactivar el botón si algún campo está vacío
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createSubmitSoftware(event);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger title="Create Software">
        <IconButton size="md" className="mt-1">
          <AiFillFolderAdd />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="">Create Software</Dialog.Title>
          <Dialog.Description className="">
            Make sure the software is correct, you will not be available to
            change name of software
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form onSubmit={createSubmitSoftware} id="createSoftware">
            <fieldset className="flex flex-col">
              <label className="" htmlFor="name">
                Software
              </label>
              <TextField
                className=""
                id="name"
                name="name"
                value={formSoftware.name}
                placeholder="Name"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={nameIsEmpty ? "Required" : null}
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="" htmlFor="code">
                Code
              </label>
              <TextField
                className=""
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
              form="createSoftware"
            >
              Create Software
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
