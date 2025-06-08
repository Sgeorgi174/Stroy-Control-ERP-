export const api = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`http://localhost:4000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Для кук сессии
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const login = (data: { login: string; password: string }) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logout = () => api("/auth/logout", { method: "POST" });

export const checkAuth = () => api("/auth/me");
