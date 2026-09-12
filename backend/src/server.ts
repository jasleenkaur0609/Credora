import "dotenv/config";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Credora API running on http://localhost:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down Credora API...`);

  server.close(() => {
    console.log("Credora API stopped.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));