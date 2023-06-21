import { Button, TextField } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";

import { useParams } from "react-router-dom";
import { useCreateTask } from "../../../hooks/task";

function CreateTaskForm() {
  const createMutation = useCreateTask();
  const { softwareId } = useParams();

  const [name, setName] = useState("");
  const [disableCloseButton, setDisableCloseButton] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ name, softwareId: softwareId });
    setName("");
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setName(value);
    setDisableCloseButton(value.trim() === "");
  };

  return (
    <div className="h-full relative ">
      <h1 className="text-xl font-medium mb-2">Create a Task</h1>
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
          Create Task
        </Button>
      </form>
    </div>
  );
}

export { CreateTaskForm };
