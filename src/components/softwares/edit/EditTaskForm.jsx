import { Button, Spinner, TextField } from "@nachogonzalezv99/ui-library";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useTask, useUpdateTask } from "../../../hooks/task";

function EditTaskForm() {
  const { softwareId, taskId } = useParams();

  const { task } = useTask(taskId);
  const updateMutation = useUpdateTask();

  const [formTask, setFormTask] = useState({
    name: "",
    softwareId: softwareId,
  });

  useEffect(() => {
    if (task) setFormTask({ name: task.name, softwareId: task.softwareId });
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ taskId, name: formTask.name, softwareId: formTask.softwareId });
  };

  return (
    <div className="h-full relative ">
      <h1 className="text-xl font-medium mb-2">Edit a task</h1>
      {!task ? (
        <Spinner size="md" />
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            name="name"
            value={formTask.name}
            onChange={(e) =>
              setFormTask((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Button
            variant="contained"
            disabled={!formTask.name}
            className="ml-auto"
          >
            Edit Task
          </Button>
        </form>
      )}
    </div>
  );
}

export { EditTaskForm };
