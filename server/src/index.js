import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env, sessionCookieOptions } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { noStore, requireAuth } from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import billRoutes from "./routes/bill.routes.js";
import exportRoutes from "./routes/export.routes.js";
import backupRoutes from "./routes/backup.routes.js";

const app = express();
app.disable("x-powered-by");
// Render (and most hosts) sit behind a proxy; needed for secure cookies and req.ip.
app.set("trust proxy", env.nodeEnv === "production" ? 1 : false);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors({
  origin(origin, callback) {
    // No Origin header = same-origin, curl, health checks.
    if (!origin || env.origins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked origin: ${origin} (allowed: ${env.origins.join(", ")})`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Disposition"],
}));

// Backup restore can be larger than the default 1 MB limit.
app.use("/api/backup/restore", express.json({ limit: "10mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(noStore);
app.use(morgan("tiny", { skip: (req) => req.url.includes("/api/auth") }));

app.use(session({
  name: "cashmemo.sid",
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({ mongoUrl: env.mongoUri, collectionName: "sessions", ttl: 60 * 60 * 8, autoRemove: "native" }),
  cookie: { ...sessionCookieOptions, maxAge: 1000 * 60 * 60 * 8 },
}));

app.get("/", (req, res) => res.json({ ok: true, service: "cash-memo-api" }));
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", requireAuth);
app.use("/api/business", businessRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api", (req, res) => res.status(404).json({ error: "API route not found." }));
app.use(errorHandler);

await connectDatabase(env.mongoUri);
const PORT = process.env.PORT || env.port;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Cash Memo API listening on port ${PORT}`);
  // console.log(`Allowed origins: ${env.origins.join(", ")} | cookie sameSite=${env.cookieSameSite} secure=${env.cookieSecure}`);
});
