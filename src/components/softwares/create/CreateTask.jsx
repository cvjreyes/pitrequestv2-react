import { useState } from "react";
import { Button, Input } from "../../general";
import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";

export default function CreateTask({ softwares }) {
  const { notify } = useNotifications();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [formTask, setFormTask] = useState({
    name: "",
    softwareId: 0,
  });

  const createSubmitTask = async (event) => {
    event.preventDefault();
    if (!formTask.name || !formTask.softwareId) {
      setNameIsEmpty(!formTask.name);
      return notify("Please, fill all fields", "error");
    }

    await client.post("/software/create/task", formTask);
    notify("Task created successfully!", "success");
    setFormTask({ name: "", softwareId: 0 });
    setNameIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormTask((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    }
  };

  return (
    <form className="create_software" onSubmit={createSubmitTask}>
      <div className="inputs_software">
        <Input
          id="name"
          name="name"
          value={formTask.name}
          placeholder="Task"
          onChange={handleChange}
          error={nameIsEmpty ? "Required" : null}
        />
        <div className="selectContainer">
          <select
            name="softwareId"
            value={formTask.softwareId}
            onChange={handleChange}
          >
            <option value="">-- Select Software --</option>
            {softwares.map((software) => (
              <option key={software.id} value={software.id}>
                {software.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Button type="submit" onClick={createSubmitTask}>
          Create Task
        </Button>
      </div>
    </form>
  );
}
