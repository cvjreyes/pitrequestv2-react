import { Button, Spinner, TextField } from "@nachogonzalezv99/ui-library";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useCharter, useUpdateCharter } from "../hooks/charter";

function EditCharterForm() {
  const { projectId, charterId } = useParams();

  const { charter } = useCharter(charterId);
  const updateMutation = useUpdateCharter();

  const [formCharter, setFormCharter] = useState({
    name: "",
    projectId: projectId,
  });

  useEffect(() => {
    if (charter) setFormCharter({ name: charter.name, projectId: charter.projectId });
  }, [charter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ charterId, name: formCharter.name, projectId: formCharter.projectId });
  };

  return (
    <div className="h-full relative ">
      <h1 className="text-xl font-medium mb-2">Edit a charter</h1>
      {!charter ? (
        <Spinner size="md" />
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            name="name"
            value={formCharter.name}
            onChange={(e) =>
              setFormCharter((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Button
            variant="contained"
            disabled={!formCharter.name}
            className="ml-auto"
          >
            Edit charter
          </Button>
        </form>
      )}
    </div>
  );
}

export { EditCharterForm };
