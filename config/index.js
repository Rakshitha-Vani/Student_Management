/**
 * Central configuration file
 *
 * WHY dotenv here?
 * We load dotenv at the very top of this config so that
 * process.env variables are available everywhere this module is imported.
 * This file acts as the single source of truth for all config values.
 */
require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};