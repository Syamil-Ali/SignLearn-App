import { Category, Word } from './types';
import rawData from './data.json';
import { msTranslations, descriptions } from './translations';
import { getYoutubeThumbnailUrl, sanitizeMediaUrl } from './media';

const parsedCategories: Category[] = [];
const parsedWords: Word[] = [];

Object.entries(rawData).forEach(([categoryId, categoryData]) => {
  const wordIds = Object.keys(categoryData.words).map(k => `${categoryId}_${k}`);
  
  parsedCategories.push({
    id: categoryId,
    name: categoryData.name,
    iconName: categoryData.iconName,
    color: categoryData.color,
    wordIds,
    translations: {
      en: {
        name: categoryData.name,
      },
      ms: {
        name: msTranslations[categoryData.name as keyof typeof msTranslations] || categoryData.name,
      }
    }
  });

  Object.entries(categoryData.words).forEach(([wordKey, wordData]) => {
    const sanitizedImageUrl = sanitizeMediaUrl(wordData.imageUrl);
    const sanitizedVideoUrl = sanitizeMediaUrl(wordData.videoUrl);

    parsedWords.push({
      id: `${categoryId}_${wordKey}`,
      categoryId,
      name: wordData.name,
      description: wordData.description,
      imageUrl: sanitizedImageUrl || getYoutubeThumbnailUrl(sanitizedVideoUrl) || '',
      videoUrl: sanitizedVideoUrl || '',
      translations: {
        en: {
          name: wordData.name,
          description: wordData.description,
        },
        ms: {
          name: msTranslations[wordData.name as keyof typeof msTranslations] || wordData.name,
          description:
            descriptions[wordData.name as keyof typeof descriptions] ||
            'Kandungan akan ditambah tidak lama lagi.',
        }
      }
    });
  });
});

export const categories: Category[] = parsedCategories;
export const words: Word[] = parsedWords;

export const getWordById = (id: string) => words.find((w) => w.id === id);
export const getCategoryById = (id: string) => categories.find((c) => c.id === id);
export const getWordsByCategory = (categoryId: string) => words.filter((w) => w.categoryId === categoryId);
