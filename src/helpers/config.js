import axios from "axios";

export const URL =
  "http://" +
  import.meta.env.VITE_SERVER +
  ":" +
  import.meta.env.VITE_NODE_PORT;

export const client = axios.create({
  baseURL: URL,
});

