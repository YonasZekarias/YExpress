/**
 * Fail fast in production when critical env vars are missing.
 */
function validateEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((k) => !process.env[k]?.trim());

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      `[config] Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

module.exports = { validateEnv };
