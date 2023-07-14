const env = require("dotenv");

env.config();

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  PASSWORD_SECRET: "password-character-ultra-secure-and-ultra-long-secret",
  JWT_SECRET: "jwt-symbol-mega-prune-or-specially-obvious-secret",
  JWT_REFRESH_SECRET: "refresh-jwt-symbol-mega-prune-or-specially-obvious-secret",
  JWT_REFRESH_EXPIRATION_TIME: "2d",
  JWT_BLACKLIST_MAINTAIN_PAUSE: 60 * 1000,
  JWT_EXPIRATION_TIME: "10m"
};
