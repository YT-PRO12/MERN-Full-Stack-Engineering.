import mongoose from 'mongoose';
import { createApp } from './app.js';
import { initializeIndexes } from './models.js';
const uri = process.env.MONGODB_URI;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const production = process.env.NODE_ENV === 'production';
if (!uri) throw new Error('Set MONGODB_URI in the root .env file. See .env.example.');
if (production && !clientOrigin.startsWith('https://'))
  throw new Error('Production requires an HTTPS CLIENT_ORIGIN.');
await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
await initializeIndexes();
const server = createApp({ clientOrigin, production }).listen(
  Number(process.env.PORT || 4000),
  '127.0.0.1',
  () => console.log('CampusHub API ready'),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.once(signal, () => {
    const timeout = setTimeout(() => process.exit(1), 10000).unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timeout);
      process.exit(0);
    });
  });
