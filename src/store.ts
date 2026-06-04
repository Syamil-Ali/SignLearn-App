import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, Language } from './types';

interface AppState {
  favorites: string[];
  progress: UserProgress;
  language: Language;
  toggleFavorite: (wordId: string) => void;
  setLanguage: (lang: Language) => void;
  markWordViewed: (wordId: string) => void;
  markCategoryCompleted: (categoryId: string) => void;
  addBadge: (badge: string) => void;
  addQuizScore: (score: number) => void;
  resetDeviceData: () => void;
}

const initialProgress: UserProgress = {
  wordsViewed: [],
  categoriesCompleted: [],
  learningStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: [],
  totalQuizScore: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      favorites: [],
      progress: initialProgress,
      language: 'en' as Language,
      setLanguage: (lang) => set({ language: lang }),
      toggleFavorite: (wordId) =>
        set((state) => ({
          favorites: state.favorites.includes(wordId)
            ? state.favorites.filter((id) => id !== wordId)
            : [...state.favorites, wordId],
        })),
      markWordViewed: (wordId) =>
        set((state) => {
          if (state.progress.wordsViewed.includes(wordId)) return state;
          
          const newWordsViewed = [...state.progress.wordsViewed, wordId];
          let badges = [...state.progress.badges];
          
          if (newWordsViewed.length === 1 && !badges.includes('First Word Learned!')) {
            badges.push('First Word Learned!');
          }
          if (newWordsViewed.length === 10 && !badges.includes('10 Words Mastered!')) {
            badges.push('10 Words Mastered!');
          }

          return {
            progress: {
              ...state.progress,
              wordsViewed: newWordsViewed,
              badges
            },
          };
        }),
      markCategoryCompleted: (categoryId) =>
        set((state) => {
          if (state.progress.categoriesCompleted.includes(categoryId)) return state;
          const newCategories = [...state.progress.categoriesCompleted, categoryId];
          const badges = [...state.progress.badges];
          if (newCategories.length === 1 && !badges.includes('First Category Completed!')) {
             badges.push('First Category Completed!');
          }
          return {
            progress: {
              ...state.progress,
              categoriesCompleted: newCategories,
              badges
            },
          };
        }),
      addBadge: (badge) =>
        set((state) => ({
          progress: {
            ...state.progress,
            badges: state.progress.badges.includes(badge)
              ? state.progress.badges
              : [...state.progress.badges, badge],
          },
        })),
      addQuizScore: (score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            totalQuizScore: (state.progress.totalQuizScore || 0) + score,
          },
        })),
      resetDeviceData: () =>
        set({
          favorites: [],
          progress: {
            ...initialProgress,
            lastActiveDate: new Date().toISOString().split('T')[0],
          },
        }),
    }),
    {
      name: 'signlearn-storage',
    }
  )
);
