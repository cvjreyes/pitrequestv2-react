import { Button, Spinner, TextField } from "@nachogonzalezv99/ui-library";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useSoftware, useUpdateSoftware } from "../hooks/software";

function EditSoftwareForm() {
  const { softwareId } = useParams();

  const { software } = useSoftware(softwareId);
  const updateMutation = useUpdateSoftware();

  const [error, setError] = useState(null);

  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
  });

  const CODE_MAX_LENGTH = 10;

  useEffect(() => {
    if (software) setFormSoftware({ name: software.name, code: software.code });
  }, [software]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ softwareId, formUpdateSoftware: formSoftware });
  };

  return (
    <div className="h-full relative ">
      <h1 className="text-xl font-medium mb-2">Edit a software</h1>
      {!software ? (
        <Spinner size="md" />
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            name="name"
            value={formSoftware.name}
            onChange={(e) =>
              setFormSoftware((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            value={formSoftware.code}
            onChange={(e) => {
              const newCode = e.target.value;
              if (newCode.length > CODE_MAX_LENGTH) {
                setError(`Max length: ${CODE_MAX_LENGTH}`);
              } else {
                setError(null);
                setFormSoftware((prev) => ({ ...prev, code: newCode }));
              }
            }}
            id="code"
            label="Code"
            error={error}
          />
          <Button
            variant="contained"
            disabled={!formSoftware.name || !formSoftware.code}
            className="ml-auto"
          >
            Edit Software
          </Button>
        </form>
      )}
    </div>
  );
}

export { EditSoftwareForm };

