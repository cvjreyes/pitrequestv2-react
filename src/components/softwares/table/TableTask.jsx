export default function TableTask({ softwares, tasks }) {
    return (
      <div className="container_show">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Software</th>
            </tr>
          </thead>
          <tbody>
            {tasks ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>
                    {softwares.find((software) => software.id === task.softwareId)?.name ||
                      "Unknown"}
                  </td>
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
    );
  }
  