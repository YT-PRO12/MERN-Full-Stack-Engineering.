import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createServer } from 'vite';
import { createApp } from '../06-full-stack-projects/campushub/api/src/app.js';
import { seedDemo } from '../06-full-stack-projects/campushub/api/src/seed.js';
// Local-only disposable demo. A real mongod process runs against a temporary directory.
const mongo = await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });
await mongoose.connect(mongo.getUri(), { dbName: 'campushub_demo' });
await seedDemo('CampusDemo2026!');
const server = createApp().listen(4000, '127.0.0.1');
const vite = await createServer({
  root: '06-full-stack-projects/campushub/web',
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});
await vite.listen();
console.log('CampusHub: http://localhost:5173 | demo@campushub.example / CampusDemo2026!');
console.log('Temporary synthetic data. Changes are removed when this demo stops.');
async function close() {
  await vite.close();
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await mongo.stop();
  process.exit(0);
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, close);
