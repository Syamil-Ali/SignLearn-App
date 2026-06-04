import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useAppStore } from './store';

const resources = {
  en: {
    translation: {
      nav: {
        learn: 'Learn',
        search: 'Search',
        favorites: 'Favorites',
        quiz: 'Quiz',
        progress: 'Progress',
      },
      common: {
        keepSigning: 'Keep Signing!',
        howToSign: 'How to sign',
        categoryNotFound: 'Category not found',
        signs_one: '{{count}} sign',
        signs_other: '{{count}} signs',
        searchPlaceholder: 'Search signs...',
        noFavorites: 'No favorite signs yet. Start learning and save your favorites!',
        noSearchResults: 'No signs found. Try another word.',
        startQuiz: 'Start Quiz!',
        quizScore: 'Your score: {{score}} out of {{total}}',
        playAgain: 'Play Again',
        keepLearning: 'Keep learning to earn your first badge!',
        achievements: 'Achievements',
        mediaUnavailable: 'Media coming soon',
        quizNeedsVideo: 'Add at least 4 real sign videos before using the quiz in production.',
        resetProgress: 'Reset this device',
        resetProgressHelp: 'Useful on shared school devices.',
        resetProgressConfirm: 'Clear saved progress and favorites on this device?',
        resetProgressDone: 'Saved progress cleared for this device.',
        categoriesCompleted: 'Categories completed',
      }
    }
  },
  ms: {
    translation: {
      nav: {
        learn: 'Belajar',
        search: 'Cari',
        favorites: 'Kegemaran',
        quiz: 'Kuiz',
        progress: 'Pencapaian',
      },
      common: {
        keepSigning: 'Teruskan Belajar!',
        howToSign: 'Cara Isyarat',
        categoryNotFound: 'Kategori tidak dijumpai',
        signs_one: '{{count}} isyarat',
        signs_other: '{{count}} isyarat',
        searchPlaceholder: 'Cari isyarat...',
        noFavorites: 'Tiada isyarat kegemaran lagi. Mula belajar dan simpan kegemaran anda!',
        noSearchResults: 'Tiada isyarat dijumpai. Cuba perkataan lain.',
        startQuiz: 'Mula Kuiz!',
        quizScore: 'Markah anda: {{score}} daripada {{total}}',
        playAgain: 'Main Semula',
        keepLearning: 'Terus belajar untuk mendapatkan lencana pertama anda!',
        achievements: 'Pencapaian',
        mediaUnavailable: 'Media akan ditambah',
        quizNeedsVideo: 'Tambah sekurang-kurangnya 4 video isyarat sebenar sebelum menggunakan kuiz untuk pelajar.',
        resetProgress: 'Tetapkan semula peranti ini',
        resetProgressHelp: 'Sesuai untuk peranti sekolah yang dikongsi.',
        resetProgressConfirm: 'Padam kemajuan dan kegemaran yang disimpan pada peranti ini?',
        resetProgressDone: 'Kemajuan yang disimpan pada peranti ini telah dipadam.',
        categoriesCompleted: 'Kategori selesai',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default, will be overridden by store
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
