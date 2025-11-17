import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "https://link-up-api.vercel.app/api";

export const makeRequest = axios.create({
  baseURL: API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`,
  withCredentials: true,
  timeout: 600000,
});

export const BASE_URL = API_BASE;
