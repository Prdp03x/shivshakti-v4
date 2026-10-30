import "dotenv/config";

// APP_ORIGIN may hold several comma-separated origins, e.g.
// "https://myapp.vercel.app,http://localhost:5173" (no trailing slashes).
const origins = (process.env.APP_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const sameSite = (process.env.COOKIE_SAMESITE || "strict").toLowerCase();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  origins,
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  // SameSite=None is required when frontend and API are on different sites
  // and it only works together with Secure cookies.
  cookieSameSite: ["strict", "lax", "none"].includes(sameSite) ? sameSite : "strict",
  cookieSecure: process.env.COOKIE_SECURE === "true" || sameSite === "none",
};

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
};

if (!env.mongoUri || !env.sessionSecret) {
  throw new Error("MONGODB_URI and SESSION_SECRET must be configured.");
}
