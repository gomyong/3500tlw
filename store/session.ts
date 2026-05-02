import { create } from 'zustand';
import type { Word } from '../lib/db';

export type SessionWord = Word & {
  currentLevel: number;
  failCount: number;
  wasCorrectInSession: boolean | null;
  failedInStage1: boolean;
  failedInStage3: boolean;
};

type SessionStore = {
  words: SessionWord[];
  currentIndex: number;
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  isReviewSession: boolean;

  initSession: (words: SessionWord[], isReview?: boolean) => void;
  markCorrect: () => void;
  markWrong: () => void;
  advanceIndex: () => void;
  setStage: (stage: 0 | 1 | 2 | 3 | 4 | 5) => void;
  resetSession: () => void;

  getStage2Words: () => SessionWord[];
  getStage3Words: () => SessionWord[];
  getStage5Words: () => SessionWord[];
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  words: [],
  currentIndex: 0,
  stage: 0,
  isReviewSession: false,

  initSession: (words, isReview = false) =>
    set({ words, currentIndex: 0, stage: 0, isReviewSession: isReview }),

  markCorrect: () =>
    set((s) => {
      const words = [...s.words];
      const w = { ...words[s.currentIndex] };
      if (s.stage === 1) w.failedInStage1 = false;
      if (s.stage === 3) w.failedInStage3 = false;
      w.wasCorrectInSession = true;
      words[s.currentIndex] = w;
      return { words };
    }),

  markWrong: () =>
    set((s) => {
      const words = [...s.words];
      const w = { ...words[s.currentIndex] };
      if (s.stage === 1) w.failedInStage1 = true;
      if (s.stage === 3) w.failedInStage3 = true;
      w.wasCorrectInSession = false;
      words[s.currentIndex] = w;
      return { words };
    }),

  advanceIndex: () =>
    set((s) => ({ currentIndex: s.currentIndex + 1 })),

  setStage: (stage) => set({ stage, currentIndex: 0 }),

  resetSession: () =>
    set({ words: [], currentIndex: 0, stage: 0, isReviewSession: false }),

  getStage2Words: () => get().words.filter((w) => w.failedInStage1),
  getStage3Words: () => get().words.filter((w) => w.failedInStage1),
  getStage5Words: () => get().words.filter((w) => w.failedInStage1 || w.failedInStage3),
}));
