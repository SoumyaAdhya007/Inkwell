import { rateLimit } from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  ipv6Subnet: 56,
});

const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500,
  standardHeaders: "draft-8",
  keyGenerator: (req, res) => {
    return req.apiKey;
  },
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 5,
  standardHeaders: "draft-8",
  ipv6Subnet: 56,
});

export { globalLimiter, apiKeyLimiter, loginLimiter };
