import { Button, TextField } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";

import { useNotifications } from "reapop";
import { useCreateSoftware } from "../../softwares/hooks/software";

function CreateProjectForm() {
  const createMutation = useCreateSoftware();
  const { notify } = useNotifications();

  const [disableCloseButton, setDisableCloseButton] = useState(true);
  const [errorName, setErrorName] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
  });

  const CODE_MAX_LENGTH = 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formSoftware.name.trim() === "") {
      setErrorName("Required");
      setDisableCloseButton(true);
      return notify("Name is required", "error");
    } else if (formSoftware.code.trim() === "") {
      setErrorCode("Required");
      setDisableCloseButton(true);
      return notify("Code is required", "error");
    }
    createMutation.mutate({ formCreateSoftware: formSoftware });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    if (newCode.length > CODE_MAX_LENGTH) {
      setErrorCode(`Max length: ${CODE_MAX_LENGTH}`);
      setDisableCloseButton(true);
    } else {
      setErrorCode(null);
      setDisableCloseButton(false);
      setFormSoftware((prev) => ({ ...prev, code: newCode }));
    }
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Create a software</h1>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          name="name"
          value={formSoftware.name}
          onChange={handleInputChange}
          error={errorName}
        />
        <TextField
          value={formSoftware.code}
          onChange={handleCodeChange}
          id="code"
          label="Code"
          error={errorCode}
        />
        <Button
          variant="contained"
          disabled={disableCloseButton}
          className="ml-auto"
        >
          Create Software
        </Button>
      </form>
    </div>
  );
}

export { CreateProjectForm };

