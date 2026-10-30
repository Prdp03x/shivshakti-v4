export function noStore(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
}

export function requireAuth(req, res, next) {
  if (!req.session?.userId) return res.status(401).json({ error: "Please log in." });
  next();
}

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

// Small in-memory limiter (per IP). Fine for a single Render instance.
export function rateLimit({ windowMs = 15 * 60 * 1000, max = 10, message = "Too many attempts. Try again later." } = {}) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.reset <= now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.reset - now) / 1000));
      return res.status(429).json({ error: message });
    }
    next();
  };
}
