import { Button, Select, Spinner } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useAddSoftwareToProject } from "../hooks/project";
import { useUnselectedAdmins } from "../hooks/user";

function AddAdminToSoftwareForm() {
  const { projectId, softwareId } = useParams();

  const { unassignedAdmins } = useUnselectedAdmins({projectId, softwareId});

  const addMutation = useAddSoftwareToProject();

  // const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [formAddSoftware, setFormAddSoftware] = useState({
    projectId: projectId,
    adminId: 0,
    softwareId: softwareId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({ formAddSoftware: formAddSoftware });
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Add Admin</h1>
      {!unassignedAdmins ? (
        <Spinner size="md" />
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="admin">Admin</label>
          <Select
            name="adminId"
            value={formAddSoftware.adminId}
            onValueChange={(value) =>
              setFormAddSoftware((prev) => ({
                ...prev,
                adminId: value,
              }))
            }
            placeholder="Select an admin ..."
          >
            {unassignedAdmins?.map((admin) => (
              <Select.Item key={admin.id} value={admin.id}>
                {admin.name}
              </Select.Item>
            ))}
          </Select>
          <Button
            variant="contained"
            // disabled={disableCloseButton}
            className="ml-auto"
          >
            Add Admin
          </Button>
        </form>
      )}
    </div>
  );
}

export { AddAdminToSoftwareForm };

