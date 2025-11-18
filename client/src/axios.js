import axios from "axios";

const RAW_API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "https://linkupbackend.vercel.app/api";

// Normalize to ensure exactly one trailing slash
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

export const makeRequest = axios.create({
  baseURL: `${API_BASE}/`,
  withCredentials: true,
  timeout: 600000,
});

export const BASE_URL = API_BASE;
