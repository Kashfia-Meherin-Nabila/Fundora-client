import { getUserToken } from "@/lib/core/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const server = async (endpoint, options = {}) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  // Don't force JSON content type for FormData or requests without a body.
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
};

export default server;