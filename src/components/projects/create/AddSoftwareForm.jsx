import { Button, Select, Spinner } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  useAddSoftwareToProject,
  useUnselectedSoftwares,
} from "../hooks/project";
import { useAdmins } from "../hooks/user";

function AddSoftwareForm() {
  const { projectId } = useParams();

  const { unselectedSoftware } = useUnselectedSoftwares(projectId);
  const { admins } = useAdmins();

  const addMutation = useAddSoftwareToProject();

  // const [disableCloseButton, setDisableCloseButton] = useState(true);

  const [formAddSoftware, setFormAddSoftware] = useState({
    projectId: projectId,
    adminId: 0,
    softwareId: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({ formAddSoftware: formAddSoftware });
  };

  return (
    <div className="h-full relative">
      <h1 className="text-xl font-medium mb-2">Add Software</h1>
      {!admins || !unselectedSoftware ? (
        <Spinner size="md"/>
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="software">Software</label>
            <Select
              name="softwareId"
              value={formAddSoftware.softwareId}
              onValueChange={(value) =>
                setFormAddSoftware((prev) => ({
                  ...prev,
                  softwareId: value,
                }))
              }
              placeholder="Select a software ..."
            >
              {unselectedSoftware?.map((software) => (
                <Select.Item key={software.id} value={software.id}>
                  {software.name}
                </Select.Item>
              ))}
            </Select>
          </fieldset>
          <fieldset>
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
              {admins?.map((admin) => (
                <Select.Item key={admin.id} value={admin.id}>
                  {admin.name}
                </Select.Item>
              ))}
            </Select>
          </fieldset>
          <Button
            variant="contained"
            // disabled={disableCloseButton}
            className="ml-auto"
          >
            Add Software
          </Button>
        </form>
      )}
    </div>
  );
}

export { AddSoftwareForm };
