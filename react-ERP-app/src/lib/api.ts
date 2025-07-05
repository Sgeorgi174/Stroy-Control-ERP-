import { baseUrl } from "@/constants/baseUrl";
import axios from "axios";

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
