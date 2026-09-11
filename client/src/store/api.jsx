const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = async (
  endpoint,
  { method = "GET", body = null, token = null } = {}
) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;

  ///// Only use JSON Content-Type for normal objects
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  console.log(`${baseURL}${endpoint}`, method, body, token);

  const response = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export default api;