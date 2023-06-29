export const userKeys = {
  all: ["users"],
  tableInfo: () => [...userKeys.all, "table"],
  project: (id) => [...userKeys.all, "project", id],
  role: (id) => [...userKeys.all, "role", id],
};
