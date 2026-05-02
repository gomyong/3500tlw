import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('tlw.db');
  return _db;
}

export async function initSchema(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS words (
      id      INTEGER PRIMARY KEY,
      word    TEXT NOT NULL,
      meaning TEXT NOT NULL,
      example TEXT
    );

    CREATE TABLE IF NOT EXISTS user_words (
      word_id          INTEGER PRIMARY KEY REFERENCES words(id),
      current_level    INTEGER DEFAULT 0,
      is_mastered      INTEGER DEFAULT 0,
      next_review_date TEXT,
      fail_count       INTEGER DEFAULT 0,
      last_failed_at   TEXT,
      mastered_at      TEXT
    );
  `);
}

export type Word = {
  id: number;
  word: string;
  meaning: string;
  example: string;
};

export type UserWord = {
  word_id: number;
  current_level: number;
  is_mastered: number;
  next_review_date: string | null;
  fail_count: number;
  last_failed_at: string | null;
  mastered_at: string | null;
};

export type WordWithStatus = Word & UserWord;

export async function getProgressSummary() {
  const db = await getDb();
  const total = 3500;
  const row = await db.getFirstAsync<{
    in_progress: number;
    mastered: number;
    due_today: number;
  }>(`
    SELECT
      SUM(CASE WHEN current_level BETWEEN 1 AND 5 THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN is_mastered = 1 THEN 1 ELSE 0 END) as mastered,
      SUM(CASE WHEN is_mastered = 0 AND next_review_date <= date('now') THEN 1 ELSE 0 END) as due_today
    FROM user_words
  `);
  const mastered = row?.mastered ?? 0;
  const in_progress = row?.in_progress ?? 0;
  const due_today = row?.due_today ?? 0;
  const unstarted = total - mastered - in_progress;
  return { total, mastered, in_progress, unstarted, due_today };
}

export async function getDueWords(): Promise<WordWithStatus[]> {
  const db = await getDb();
  return db.getAllAsync<WordWithStatus>(`
    SELECT w.*, uw.*
    FROM user_words uw
    JOIN words w ON w.id = uw.word_id
    WHERE uw.is_mastered = 0
      AND uw.next_review_date <= date('now')
    ORDER BY uw.fail_count DESC
    LIMIT 100
  `);
}

export async function getNewWords(limit: number): Promise<Word[]> {
  const db = await getDb();
  return db.getAllAsync<Word>(`
    SELECT * FROM words
    WHERE id NOT IN (SELECT word_id FROM user_words)
    ORDER BY RANDOM()
    LIMIT ?
  `, [limit]);
}

export async function updateWordAfterSession(
  wordId: number,
  wasCorrect: boolean,
  currentLevel: number,
  failCount: number
): Promise<void> {
  const db = await getDb();
  const today = new Date().toISOString().split('T')[0];

  if (wasCorrect) {
    const newLevel = currentLevel + 1;
    if (newLevel > 5) {
      // Mastered
      await db.runAsync(`
        INSERT INTO user_words (word_id, current_level, is_mastered, next_review_date, fail_count, mastered_at)
        VALUES (?, 6, 1, NULL, ?, datetime('now'))
        ON CONFLICT(word_id) DO UPDATE SET
          current_level = 6,
          is_mastered = 1,
          next_review_date = NULL,
          mastered_at = datetime('now')
      `, [wordId, failCount]);
    } else {
      const days = getNextReviewDays(newLevel, failCount);
      const nextDate = addDays(today, days);
      await db.runAsync(`
        INSERT INTO user_words (word_id, current_level, is_mastered, next_review_date, fail_count)
        VALUES (?, ?, 0, ?, ?)
        ON CONFLICT(word_id) DO UPDATE SET
          current_level = ?,
          next_review_date = ?,
          is_mastered = 0
      `, [wordId, newLevel, nextDate, failCount, newLevel, nextDate]);
    }
  } else {
    const newFailCount = failCount + 1;
    await db.runAsync(`
      INSERT INTO user_words (word_id, current_level, is_mastered, next_review_date, fail_count, last_failed_at)
      VALUES (?, 1, 0, ?, ?, datetime('now'))
      ON CONFLICT(word_id) DO UPDATE SET
        current_level = 1,
        next_review_date = ?,
        fail_count = ?,
        last_failed_at = datetime('now'),
        is_mastered = 0
    `, [wordId, today, newFailCount, today, newFailCount]);
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const LEVEL_SCHEDULE_DAYS: Record<number, number> = {
  1: 0,
  2: 1,
  3: 7,
  4: 15,
  5: 30,
};

export function getNextReviewDays(level: number, failCount: number): number {
  const base = LEVEL_SCHEDULE_DAYS[level] ?? 0;
  if (failCount >= 5) return Math.max(1, Math.floor(base * 0.5));
  if (failCount >= 3) return Math.max(1, Math.floor(base * 0.7));
  return base;
}
