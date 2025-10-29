import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { env, isProd } from './config/env';

async function start() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URI);

    const server = http.createServer(app);
    const port = parseInt(env.PORT, 10);
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port} (${isProd ? 'prod' : 'dev'})`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ message: 'Failed to start server', code: 'STARTUP_ERROR', details: error });
    process.exit(1);
  }
}

void start();
