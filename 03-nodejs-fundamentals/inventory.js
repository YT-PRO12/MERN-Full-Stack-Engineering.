import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
export function summarize(items) {
  if (!Array.isArray(items)) throw new TypeError('Inventory must be an array');
  return items.reduce((summary, item) => {
    if (typeof item.category !== 'string' || !Number.isInteger(item.price) || item.price < 0)
      throw new TypeError('Invalid inventory item');
    const current = summary.get(item.category) || { count: 0, value: 0 };
    summary.set(item.category, { count: current.count + 1, value: current.value + item.price });
    return summary;
  }, new Map());
}
export async function loadInventory(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const path = process.argv[2] || new URL('./inventory.json', import.meta.url);
    console.table(Object.fromEntries(summarize(await loadInventory(path))));
  } catch (error) {
    console.error(`Inventory could not be read: ${error.message}`);
    process.exitCode = 1;
  }
}
