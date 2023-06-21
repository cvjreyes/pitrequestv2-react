import { Button, Spinner, TextField } from "@nachogonzalezv99/ui-library";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useSubtask, useUpdateSubtask } from "../../../hooks/subtask";

function EditSubtaskForm() {
  const { taskId, subtaskId } = useParams();

  const { subtask } = useSubtask(subtaskId);
  const updateMutation = useUpdateSubtask();

  // const [disableCloseButton, setDisableCloseButton] = useState(true);
  // const [error, setError] = useState(null);

  const [formSubtask, setFormSubtask] = useState({
    name: "",
    taskId: taskId,
  });

  useEffect(() => {
    if (subtask) setFormSubtask({ name: subtask.name, taskId: subtask.taskId });
  }, [subtask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      subtaskId,
      name: formSubtask.name,
      taskId: formSubtask.taskId,
    });
  };

  return (
    <div className="h-full relative ">
      <h1 className="text-xl font-medium mb-2">Edit a subtask</h1>
      {!subtask ? (
        <Spinner size="md" />
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            name="name"
            value={formSubtask.name}
            onChange={(e) =>
              setFormSubtask((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Button
            variant="contained"
            // disabled={disableCloseButton}
            className="ml-auto"
          >
            Edit Task
          </Button>
        </form>
      )}
    </div>
  );
}

export { EditSubtaskForm };

