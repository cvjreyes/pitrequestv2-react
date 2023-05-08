export default function SoftwareTree({ softwareTree }) {
    console.log(softwareTree);
  return (
    <ul>
      {softwareTree.map((software) => (
        <li key={software.id}>
          {software.name}
          {software.Task && (
            <ul>
              {software.Task.map((task) => (
                <li key={task.id}>
                  {task.name}
                  {task.Subtask && (
                    <ul>
                      {task.Subtask.map((subtask) => (
                        <li key={subtask.id}>{subtask.name}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
