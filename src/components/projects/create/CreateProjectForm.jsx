import { Button, TextField } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { useNotifications } from "reapop";

import { useCreateProject } from "../../projects/hooks/project";
import { useAuth } from "../../../context/AuthContext";

function CreateProjectForm() {
  const createMutation = useCreateProject();
  const { notify } = useNotifications();
  const { user } = useAuth();

  const [disableCloseButton, setDisableCloseButton] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  const [formProject, setFormProject] = useState({
    name: "",
    code: "",
    estimatedHours: 500,
    userProjectId: user.id,
  });

  const CODE_MAX_LENGTH = 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formProject.name.trim() === "" ||
      formProject.code.trim() === "" ||
      !formProject.estimatedHours
    ) {
      // Mostrar un mensaje de error y no enviar el formulario si algún campo está vacío
      notify("All fields are required", "error");
      return;
    }
    createMutation.mutate({ formCreateProject: formProject });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    if (newCode.length > CODE_MAX_LENGTH) {
      setErrorCode(`Max length: ${CODE_MAX_LENGTH}`);
      setDisableCloseButton(true);
    } else {
      setErrorCode(null);
      setDisableCloseButton(false);
      setFormProject((prev) => ({ ...prev, code: newCode }));
    }
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Create a Project</h1>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          name="name"
          value={formProject.name}
          onChange={handleInputChange}
        />
        <TextField
          value={formProject.code}
          onChange={handleCodeChange}
          id="code"
          label="Code"
          error={errorCode}
        />
        <TextField
          value={formProject.estimatedHours}
          onChange={handleInputChange}
          type="number"
          id="estimatedHours"
          label="Estimated Hours"
        />
        <Button
          variant="contained"
          disabled={disableCloseButton}
          className="ml-auto"
        >
          Create Project
        </Button>
      </form>
    </div>
  );
}

export { CreateProjectForm };
