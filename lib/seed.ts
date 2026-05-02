import { getDb } from './db';

export async function seedDatabase(): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM words');
  if ((row?.c ?? 0) > 0) return;

  const words: Array<{ id: number; word: string; meaning: string; example: string }> =
    require('../assets/words.json');

  await db.runAsync('BEGIN TRANSACTION');
  try {
    for (const w of words) {
      await db.runAsync(
        'INSERT INTO words (id, word, meaning, example) VALUES (?, ?, ?, ?)',
        [w.id, w.word, w.meaning, w.example ?? '']
      );
    }
    await db.runAsync('COMMIT');
  } catch (e) {
    await db.runAsync('ROLLBACK');
    throw e;
  }
}
