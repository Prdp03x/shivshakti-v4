// Vite only exposes variables prefixed with VITE_ (baked in at build time).
// Leave unset to use same-origin "/api" (dev proxy or host rewrite).
const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection (the server may be waking up, try again in a minute).", 0);
  }

  const type = response.headers.get("content-type") || "";
  if (!response.ok) {
    const body = type.includes("application/json") ? await response.json().catch(() => ({})) : {};
    throw new ApiError(body.error || `Request failed (${response.status})`, response.status);
  }

  if (options.raw) return response;
  if (!type.includes("application/json")) {
    throw new ApiError("Unexpected response from server. Check that VITE_API_URL points to the API.", response.status);
  }
  return response.json();
}
