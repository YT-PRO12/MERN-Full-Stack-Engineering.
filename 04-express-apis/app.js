import express from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const product = z
  .object({ name: z.string().trim().min(1).max(80), price: z.number().int().min(0).max(100000) })
  .strict();
export function createProductApp() {
  const app = express();
  const products = new Map();
  app.use(express.json({ limit: '8kb' }));
  app.get('/api/products', (_req, res) => res.json({ items: [...products.values()] }));
  app.get('/api/products/:id', (req, res) => {
    const item = products.get(req.params.id);
    return item ? res.json({ item }) : res.status(404).json({ error: 'Product not found' });
  });
  app.post('/api/products', (req, res) => {
    const input = product.parse(req.body);
    const item = { id: randomUUID(), ...input };
    products.set(item.id, item);
    res.status(201).json({ item });
  });
  app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));
  app.use((error, _req, res, _next) => {
    if (error instanceof z.ZodError || error.type === 'entity.parse.failed')
      return res.status(400).json({ error: 'Supply a name and a nonnegative integer price' });
    if (error.type === 'charset.unsupported' || error.type === 'encoding.unsupported')
      return res.status(415).json({ error: 'Request encoding is not supported' });
    if (error.type === 'entity.too.large')
      return res.status(413).json({ error: 'Request body is too large' });
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  createProductApp().listen(4100, '127.0.0.1', () =>
    console.log('Products lab: http://127.0.0.1:4100/api/products'),
  );
