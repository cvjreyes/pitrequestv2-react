import { useState } from "react";

export default function TableTask({ softwares, tasks }) {
  const [selectedSoftwareId, setSelectedSoftwareId] = useState("");

  const filteredTasks = selectedSoftwareId
    ? tasks.filter((task) => task.softwareId === selectedSoftwareId)
    : tasks;

  return (
    <div>
      <select
        className="select_table"
        value={selectedSoftwareId}
        onChange={(e) => setSelectedSoftwareId(parseInt(e.target.value))}
      >
        <option value="">All</option>
        {softwares.map((software) => (
          <option key={software.id} value={software.id}>
            {software.name}
          </option>
        ))}
      </select>
      <div className="container_show">
        <table>
          <thead>
            <tr>
              <th>Software</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    {softwares.find(
                      (software) => software.id === task.softwareId
                    )?.name || "Unknown"}
                  </td>
                  <td>{task.name}</td>
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
