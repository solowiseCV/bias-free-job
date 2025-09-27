import { httpServer } from "./app";
import { PrismaClient } from "@prisma/client";
import logger from "./middlewares/logger.middleware";

export const PORT = process.env.PORT || 9871;
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    logger.info("Connected to MongoDB");

    httpServer.listen(PORT, () => {
      logger.info(`Listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
  }
})();

// import app from "./app";
// import logger from "./middlewares/logger.middleware";

// export const PORT = process.env.PORT || 9871;

// (async () => {
//   logger.info(`Attempting to run server on port ${PORT}`);

//   app.listen(PORT, () => {
//     logger.info(`Listening on port ${PORT}`);
//   });
// })();
