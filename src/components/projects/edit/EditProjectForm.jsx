import { Button, TextField } from "@nachogonzalezv99/ui-library";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProject, useUpdateProject } from "../hooks/project";

function EditProjectForm() {
  const { projectId } = useParams();

  const { project } = useProject(projectId);
  const updateMutation = useUpdateProject();

  const [error, setError] = useState(null);

  const [formProject, setFormProject] = useState({
    name: project?.name,
    code: project?.code,
    estimatedHours: project?.estimatedHours,
  });

  const CODE_MAX_LENGTH = 10;

  useEffect(() => {
    if (project) {
      setFormProject({
        name: project.name || "",
        code: project.code || "",
        estimatedHours: project.estimatedHours,
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProject = {};
    if (formProject.name !== project.name) {
      updatedProject.name = formProject.name;
    }
    if (formProject.code !== project.code) {
      updatedProject.code = formProject.code;
    }
    updateMutation.mutate({ projectId, formUpdateProject: updatedProject });
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Edit a Project</h1>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          name="name"
          value={formProject.name || ""}
          onChange={(e) =>
            setFormProject((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          value={formProject.code || ""}
          onChange={(e) => {
            const newCode = e.target.value;
            if (newCode.length > CODE_MAX_LENGTH) {
              setError(`Max length: ${CODE_MAX_LENGTH}`);
            } else {
              setError(null);
              setFormProject((prev) => ({ ...prev, code: newCode }));
            }
          }}
          id="code"
          label="Code"
          error={error}
        />
        <TextField
          value={formProject.estimatedHours || ""}
          onChange={(e) =>
            setFormProject((prev) => ({
              ...prev,
              estimatedHours: e.target.value,
            }))
          }
          type="number"
          id="estimatedHours"
          label="Estimated Hours"
          error={error}
        />

        <Button
          variant="contained"
          disabled={!formProject.name || !formProject.code}
          className="ml-auto"
        >
          Edit Project
        </Button>
      </form>
    </div>
  );
}

export { EditProjectForm };

