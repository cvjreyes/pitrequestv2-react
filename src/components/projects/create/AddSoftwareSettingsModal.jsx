/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, Select } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const AddSoftwareSettingsModal = forwardRef(
  ({ id, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [softwares, setSoftwares] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [formAddSoftware, setFormAddSoftware] = useState({
      projectId: id,
      adminId: 0,
      softwareId: 0,
    });

    const updateUnselectedSoftwares = async () => {
      const unselectedSoftwares = await client.get(
        `/projects/${id}/softwares/unselected`
      );
      setSoftwares(unselectedSoftwares.data);
    };

    useEffect(() => {
      const getAdmins = async () => {
        const admins = await client.get("/users/admins");
        setAdmins(admins.data.Admins);
      };
      updateUnselectedSoftwares();
      getAdmins();
    }, [open]);

    useEffect(() => {
      const allFieldsFilled =
        !!formAddSoftware.adminId && !!formAddSoftware.softwareId;
      setDisableCloseButton(!allFieldsFilled);
    }, [formAddSoftware.adminId, formAddSoftware.softwareId]);

    const submitAddSoftware = async (event) => {
      event.preventDefault();
      try {
        if (!formAddSoftware.adminId || !formAddSoftware.softwareId) {
          return notify("Please, fill all fields", "error");
        }
        await client.post("/projects/softwares", formAddSoftware);
        notify("Software added successfully!", "success");
        getProjectTree();
        setFormAddSoftware({ projectId: id, adminId: 0, softwareId: 0 });
        setDisableCloseButton(true);
        setOpen(false);
        updateUnselectedSoftwares(); // Actualizar la lista de softwares no seleccionados
      } catch (error) {
        const errorMessage = error.response.data.error;
        notify(errorMessage, "error");
        getProjectTree();
      }
    };

    return (
      <div ref={ref}>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Software and Admin</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={submitAddSoftware} id="addSoftAdmin">
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
                    {softwares.map((software) => (
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
                    {admins.map((admin) => (
                      <Select.Item key={admin.id} value={admin.id}>
                        {admin.name}
                      </Select.Item>
                    ))}
                  </Select>
                </fieldset>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <div className="flex">
                <Button
                  variant="contained"
                  disabled={disableCloseButton}
                  className="ml-auto"
                  form="addSoftAdmin"
                >
                  Add Software and Admin
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default AddSoftwareSettingsModal;
