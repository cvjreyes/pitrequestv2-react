export const projectKeys = {
  all: ["projects"],
  tree: (filters) => [...projectKeys.all, "tree", filters && { filters }],
  detail: (id) => [...projectKeys.all, "detail", id],
};
