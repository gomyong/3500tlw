import { getDb } from './db';

const CHUNK_SIZE = 200;

export async function seedDatabase(): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM words');
  if ((row?.c ?? 0) > 0) return;

  const words: Array<{ id: number; word: string; meaning: string; example: string }> =
    require('../assets/words.json');

  await db.runAsync('BEGIN TRANSACTION');
  try {
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      const chunk = words.slice(i, i + CHUNK_SIZE);
      const placeholders = chunk.map(() => '(?, ?, ?, ?)').join(',');
      const params = chunk.flatMap((w) => [w.id, w.word, w.meaning, w.example ?? '']);
      await db.runAsync(
        `INSERT INTO words (id, word, meaning, example) VALUES ${placeholders}`,
        params
      );
    }
    await db.runAsync('COMMIT');
  } catch (e) {
    await db.runAsync('ROLLBACK');
    throw e;
  }
}
