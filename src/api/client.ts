const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }

  // Handle cases where response might be empty (like 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
