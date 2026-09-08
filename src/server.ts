import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

async function startServer() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Societal Innovation API Server listening on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
    console.log(`📡 Frontend URL configured: ${ENV.FRONTEND_URL}`);
  });
}

startServer();
