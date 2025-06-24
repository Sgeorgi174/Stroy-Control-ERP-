import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:4000/",
  baseURL: "https://stroy-server.ru.tuna.am",
  withCredentials: true,
});
