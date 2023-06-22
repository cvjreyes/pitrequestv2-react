import { Button, TextField } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateCharter } from "../hooks/charter";

function CreateCharterForm() {
  const createMutation = useCreateCharter();
  const { projectId } = useParams();

  const [name, setName] = useState("");
  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ name, projectId });
    setName("");
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setName(value);
    setDisableCloseButton(value.trim() === "");
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Create Charter</h1>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          disabled={disableCloseButton}
          className="ml-auto"
        >
          Create Charter
        </Button>
      </form>
    </div>
  );
}

export { CreateCharterForm };

