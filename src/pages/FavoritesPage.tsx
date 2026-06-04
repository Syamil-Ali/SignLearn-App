import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { words } from '../data';
import { useAppStore } from '../store';
import { PlayCircle, StarOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WordThumbnail from '../components/WordThumbnail';

export default function FavoritesPage() {
  const { favorites, language } = useAppStore();
  const favoriteWords = words.filter((w) => favorites.includes(w.id));
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-background min-h-full">
      <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-foreground mb-6 md:mb-10 mt-2 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">{t('nav.favorites')}</h1>

      {favoriteWords.length === 0 ? (
        <div className="text-center py-20 px-4 bg-muted border-2 border-foreground border-dashed rounded-xl mt-8 flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-tertiary rounded-full border-4 border-foreground shadow-[8px_8px_0px_#1E293B] flex items-center justify-center mb-6">
                <StarOff className="w-10 h-10 text-foreground" strokeWidth={2.5} />
            </div>
            <p className="text-foreground font-extrabold font-heading text-2xl mb-2">{t('common.noFavorites')}</p>
            <p className="text-muted-foreground font-bold text-base mt-1">{language === 'ms' ? 'Tekan ikon bintang pada mana-mana isyarat untuk menyimpannya di sini.' : 'Tap the star icon on any word to save it here for quick access.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteWords.map((word, index) => {
            const wordDisplayName = word.translations[language]?.name || word.name;
            const wordDisplayDescription = word.translations[language]?.description || word.description;
            return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <Link
                to={`/word/${word.id}`}
                className="flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-start p-4 bg-white border-2 border-foreground rounded-xl shadow-[4px_4px_0px_#E2E8F0] hover:-translate-y-2 hover:shadow-[8px_8px_0px_#1E293B] hover:border-foreground active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] transition-all gap-4 group h-full"
              >
                <div className="w-full sm:w-24 h-40 sm:h-auto rounded-xl bg-muted flex flex-shrink-0 items-center justify-center overflow-hidden border-2 border-foreground">
                  <WordThumbnail
                    src={word.imageUrl}
                    alt={word.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center items-center sm:items-start text-center sm:text-left py-2 w-full">
                  <h3 className="font-bold font-heading text-foreground text-2xl mb-1 break-words w-full">{wordDisplayName}</h3>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-2 w-full">{wordDisplayDescription}</p>
                  
                  <div className="mt-auto w-12 h-12 rounded-full flex items-center justify-center bg-white text-foreground border-2 border-foreground shadow-[2px_2px_0px_#1E293B] group-hover:bg-tertiary group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      )}
    </div>
  );
}
