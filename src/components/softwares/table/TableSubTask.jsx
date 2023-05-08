import { useState } from "react";

export default function TableSubTask({ tasks, subtasks }) {
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const filteredSubTasks = selectedTaskId
    ? subtasks.filter((subtask) => subtask.taskId === selectedTaskId)
    : subtasks;

  return (
    <div>
      <select
        className="select_table"
        value={selectedTaskId}
        onChange={(e) => setSelectedTaskId(parseInt(e.target.value))}
      >
        <option value="">All</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.name}
          </option>
        ))}
      </select>
      <div className="container_show">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>SubTask</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubTasks.length > 0 ? (
              filteredSubTasks.map((subtask) => (
                <tr key={subtask.id}>
                  <td>
                    {tasks.find(
                      (task) => task.id === subtask.taskId
                    )?.name || "Unknown"}
                  </td>
                  <td>{subtask.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
