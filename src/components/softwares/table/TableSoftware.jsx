export default function TableSoftware({ softwares, users }) {
  return (
    <div className="container_show">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {softwares ? (
            softwares.map((software) => (
              <tr key={software.id}>
                <td>{software.name}</td>
                <td>{software.code}</td>
                <td>
                  {users.find((user) => user.id === software.adminId)?.name ||
                    "Unknown"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
