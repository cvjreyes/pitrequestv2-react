import { forwardRef, useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, Select } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const AddAdminSoftwareSettingsModal = forwardRef(
  ({ id, softwareId, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [admins, setAdmins] = useState([]);
    const [formAddAdmin, setformAddAdmin] = useState({
      projectId: id,
      adminId: 0,
      softwareId: softwareId,
    });

    const getAdmins = async () => {
      const admins = await client.get(
        `/projects/${id}/softwares/${softwareId}/admins/unassigned`
      );
      setAdmins(admins.data.admins);
    };

    useEffect(() => {
      getAdmins();
    }, []);

    useEffect(() => {
      getAdmins();
    }, [open]);

    const submitAddSoftwareAdmin = async (event) => {
      event.preventDefault();
      try {
        if (!formAddAdmin.adminId) {
          return notify("Please, fill all fields", "error");
        }
        await client.post("/projects/softwares", formAddAdmin);
        notify("Software added successfully!", "success");
        getProjectTree();
        setformAddAdmin({ projectId: id, adminId: 0, softwareId: softwareId });
        setDisableCloseButton(true);
        setOpen(false);
      } catch (error) {
        const errorMessage = error.response.data.error;
        notify(errorMessage, "error");
        getProjectTree();
      }
    };

    const handleAdminChange = (value) => {
      setformAddAdmin((prev) => ({
        ...prev,
        adminId: value,
      }));
      setDisableCloseButton(value === 0);
    };

    return (
      <div ref={ref}>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Admin</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={submitAddSoftwareAdmin} id="addAdmin">
                <fieldset>
                  <label htmlFor="admin">Admin</label>
                  <Select
                    name="adminId"
                    value={formAddAdmin.adminId}
                    onValueChange={handleAdminChange}
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
                  form="addAdmin"
                >
                  Add Admin
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default AddAdminSoftwareSettingsModal;
