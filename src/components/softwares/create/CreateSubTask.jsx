import { useState } from "react";
import { Button, Input } from "../../general";
import { useNotifications } from "reapop";
import { client } from "../../../helpers/config";

export default function CreateSubTask({ tasks, getAllSubTasks }) {
  const { notify } = useNotifications();

  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const [formSubTask, setFormSubTask] = useState({
    name: "",
    taskId: 0,
  });

  const createSubmitSubTask = async (event) => {
    event.preventDefault();
    if (!formSubTask.name || !formSubTask.taskId) {
      setNameIsEmpty(!formSubTask.name);
      return notify("Please, fill all fields", "error");
    }

    await client.post("/software/create/task/subtask", formSubTask);
    notify("SubTask created successfully!", "success");
    getAllSubTasks();
    setFormSubTask({ name: "", taskId: 0 });
    setNameIsEmpty(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormSubTask((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameIsEmpty(!value);
    }
  };

  return (
    <form className="create_software" onSubmit={createSubmitSubTask}>
      <div className="inputs_software">
        <Input
          className="margin_added"
          id="name"
          name="name"
          value={formSubTask.name}
          placeholder="SubTask"
          onChange={handleChange}
          error={nameIsEmpty ? "Required" : null}
        />
        <div className="selectContainer">
          <select
            className="margin_added"
            name="taskId"
            value={formSubTask.SubTaskId}
            onChange={handleChange}
          >
            <option value="">-- Select SubTask --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          onClick={createSubmitSubTask}
          className="margin_added"
        >
          Create SubTask
        </Button>
      </div>
    </form>
  );
}
