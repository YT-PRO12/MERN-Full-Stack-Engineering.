import mongoose from 'mongoose';
import { seedDemo } from './seed.js';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Set MONGODB_URI first.');
await mongoose.connect(uri);
try {
  if (mongoose.connection.name !== 'campushub_demo')
    throw new Error('Seed is restricted to the campushub_demo database.');
  await seedDemo(process.env.DEMO_PASSWORD);
  console.log('Synthetic demo data is ready. Existing demo accounts and listings were preserved.');
} finally {
  await mongoose.disconnect();
}
