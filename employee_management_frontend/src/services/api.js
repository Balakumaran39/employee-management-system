import { API_BASE_URL } from "../config.js";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(data ? JSON.stringify(data) : `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const employeeApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/employees/${query ? `?${query}` : ""}`);
  },
  get: (id) => request(`/employees/${id}/`),
  create: (payload) => request("/employees/", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/employees/${id}/`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/employees/${id}/`, { method: "DELETE" }),
  stats: () => request("/dashboard/stats/"),
};
