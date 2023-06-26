export const softwareKeys = {
  all: ["softwares"],
  tree: (filters) => [...softwareKeys.all, "tree", filters && { filters }],
  detail: (id) => [...softwareKeys.all, "detail", id],
  task: (id) => [...softwareKeys.all, "task", id],
  subtask: (id) => [...softwareKeys.all, "subtask", id],
};
