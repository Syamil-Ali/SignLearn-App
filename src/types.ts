export type Language = 'en' | 'ms';

export interface Translation {
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string; // Default en name
  iconName: string;
  color: string;
  wordIds: string[];
  translations: Record<Language, Translation>;
}

export interface Word {
  id: string;
  categoryId: string;
  name: string; // Default en name
  description: string; // Default en description
  imageUrl: string;
  videoUrl: string; // Placeholder URL
  translations: Record<Language, Translation>;
}

export interface UserProgress {
  wordsViewed: string[];
  categoriesCompleted: string[];
  learningStreak: number;
  lastActiveDate: string;
  badges: string[];
  totalQuizScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'video_to_word' | 'word_to_video';
  options: string[]; // word IDs or video URLs
  correctAnswer: string;
}
