export const projectKeys = {
  all: ["projects"],
  tree: (filters) => [...projectKeys.all, "tree", filters && {filters}],
  detail: (id) => [...projectKeys.all, "detail", id],
  charter: (id) => [...projectKeys.all, "charter", id],
  software: (id) => [...projectKeys.all, "software", id],
  admins: () => [...projectKeys.all, "admins"],
  admin: (id) => [...projectKeys.admins, id],
};


