import { useState } from "react";
import { Button, Input } from "../../general";
import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";

export default function CreateSoftware({ users }) {
  const { notify } = useNotifications();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [codeIsEmpty, setCodeIsEmpty] = useState(false);
  const [formSoftware, setFormSoftware] = useState({
    name: "",
    code: "",
    adminId: 0,
  });

  const createSubmitSoftware = async (event) => {
    event.preventDefault();
    if (!formSoftware.name || !formSoftware.code || !formSoftware.adminId) {
      setNameIsEmpty(!formSoftware.name);
      setCodeIsEmpty(!formSoftware.code);
      return notify("Please, fill all fields", "error");
    }
    if (formSoftware.code.length > 5)
      return notify("Code can't have more than 5 characters", "error");

    await client.post("/software/create", formSoftware);
    notify("Software created successfully!", "success");
    setFormSoftware({ name: "", code: "", adminId: 0 });
    setNameIsEmpty(false);
    setCodeIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSoftware((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    } else if (name === "code") {
      setCodeIsEmpty(!value);
    }
  };

  return (
    <form className="create_software" onSubmit={createSubmitSoftware}>
      <div className="inputs_software">
        <Input
          id="name"
          name="name"
          value={formSoftware.name}
          placeholder="Software"
          onChange={handleChange}
          error={nameIsEmpty ? "Required" : null}
        />
        <Input
          id="code"
          name="code"
          value={formSoftware.code}
          placeholder="Code"
          onChange={handleChange}
          error={codeIsEmpty ? "Required" : null}
        />
        <div className="selectContainer">
          <select
            name="adminId"
            value={formSoftware.adminId}
            onChange={handleChange}
          >
            <option value="">-- Select Admin --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Button type="submit" onClick={createSubmitSoftware}>
          Create Software
        </Button>
      </div>
    </form>
  );
}
