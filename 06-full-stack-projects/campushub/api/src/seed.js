import { User, Listing, initializeIndexes } from './models.js';
import { hashPassword } from './auth.js';
export async function seedDemo(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128)
    throw new Error('DEMO_PASSWORD must contain 12–128 characters.');
  await initializeIndexes();
  const user = await User.findOneAndUpdate(
    { email: 'demo@campushub.example' },
    {
      $setOnInsert: {
        name: 'Campus Demo',
        email: 'demo@campushub.example',
        passwordHash: await hashPassword(password),
      },
    },
    { upsert: true, returnDocument: 'after' },
  );
  const items = [
    [
      'calculus',
      'Calculus, without the full price',
      'A clean second-hand calculus textbook with worked examples. Synthetic demo listing.',
      350,
      'books',
      'good',
      'Library entrance',
    ],
    [
      'headphones',
      'A little quiet for your study hours',
      'Over-ear wired headphones, tested and ready for the next study session. Synthetic demo listing.',
      850,
      'electronics',
      'like-new',
      'Student centre',
    ],
    [
      'lamp',
      'Make room for brighter ideas',
      'Adjustable desk lamp for a small study table. Synthetic demo listing.',
      450,
      'essentials',
      'good',
      'North campus',
    ],
    [
      'algorithms',
      'Your next algorithms companion',
      'Algorithms textbook with clear diagrams and practice problems. Synthetic demo listing.',
      500,
      'books',
      'good',
      'Library entrance',
    ],
    [
      'keyboard',
      'A fresh start for your desk',
      'Compact USB keyboard with all keys working. Synthetic demo listing.',
      600,
      'electronics',
      'fair',
      'Student centre',
    ],
    [
      'bottle',
      'One less disposable bottle',
      'Unused steel water bottle for lectures and long library days. Synthetic demo listing.',
      200,
      'essentials',
      'like-new',
      'North campus',
    ],
  ];
  for (const [seedKey, title, description, price, category, condition, location] of items) {
    await Listing.updateOne(
      { seedKey },
      {
        $setOnInsert: {
          seedKey,
          title,
          description,
          price,
          category,
          condition,
          location,
          owner: user._id,
          status: 'active',
        },
      },
      { upsert: true, runValidators: true },
    );
  }
}
