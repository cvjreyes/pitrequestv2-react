import { forwardRef, useEffect, useState } from "react";
import { useNotifications } from "reapop";

import { Button, Dialog, Select } from "@nachogonzalezv99/ui-library";

import { client } from "../../../helpers/config";

const AdminChangeModal = forwardRef(
  ({ projectId, softwareId, adminId, getProjectTree, open, setOpen }, ref) => {
    const { notify } = useNotifications();

    const [disableCloseButton, setDisableCloseButton] = useState(true);

    const [admins, setAdmins] = useState([]);
    const [formChangeAdmin, setformChangeAdmin] = useState({
      projectId: projectId,
      newAdminId: adminId,
      softwareId: softwareId,
    });

    const getAdmins = async () => {
      const admins = await client.get(
        `/projects/${projectId}/softwares/${softwareId}/admins/unassigned`
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
        if (!formChangeAdmin.newAdminId) {
          return notify("Please, fill all fields", "error");
        }
        await client.put(
          `/projects/${projectId}/softwares/${softwareId}/admins/${adminId}`,
          formChangeAdmin
        );
        notify("Software added successfully!", "success");
        getProjectTree();
        setDisableCloseButton(true);
        setOpen(false);
      } catch (error) {
        const errorMessage = error.response.data.error;
        notify(errorMessage, "error");
        getProjectTree();
      }
    };

    const handleChange = (value) => {
      setformChangeAdmin((prev) => ({
        ...prev,
        newAdminId: value,
      }));
      setDisableCloseButton(value === adminId);
    };

    console.log(admins, adminId)

    return (
      <div ref={ref}>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Change Admin</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={submitAddSoftwareAdmin} id="changeAdmin">
                <fieldset>
                  <label htmlFor="admin">Admin</label>
                  <Select
                    name="newAdminId"
                    value={formChangeAdmin.newAdminId}
                    onValueChange={handleChange}
                    placeholder="Select an admin..."
                    defaultValue={adminId}
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
                  form="changeAdmin"
                >
                  Change Admin
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  }
);

export default AdminChangeModal;
