export const projectKeys = {
  all: ["projects"],
  tree: (filters) => [...projectKeys.all, "tree", filters && { filters }],
  detail: (id) => [...projectKeys.all, "detail", id],
  charter: (id) => [...projectKeys.all, "charter", id],
  software: (id) => [...projectKeys.all, "software", id],
  removeSoftware: (id, projectId) => [
    ...projectKeys.all,
    "software",
    { id, projectId },
  ],
  admins: () => [...projectKeys.all, "admins"],
  admin: (id) => [...projectKeys.admins, id],
  unassignedAdmins: (projectId, softwareId) => [
    ...projectKeys.all,
    "unassignedAdmins",
    { projectId, softwareId },
  ],
};
