import { randomBytes } from "crypto";

export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
    sessions: {
      maxRefreshTokenLifespan: "30d", // 30 days
      maxSessionLifespan: "30d", // 30 days
    },
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", randomBytes(16).toString("base64")),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", randomBytes(16).toString("base64")),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY"),
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
