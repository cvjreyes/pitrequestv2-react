export const ticketKeys = {
  all: ["tickets"],
  ticket: () => [...ticketKeys.all, "ticket"],
  project: (id) => [...ticketKeys.all, "project", id],
  charter: (id) => [...ticketKeys.all, "charter", id],
  software: (id) => [...ticketKeys.all, "software", id],
  admin: (id) => [...ticketKeys.all, "admin", id],
};
