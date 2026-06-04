import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { words } from '../data';
import { Search as SearchIcon, PlayCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { useTranslation } from 'react-i18next';
import WordThumbnail from '../components/WordThumbnail';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { progress, language } = useAppStore();
  const { t } = useTranslation();

  const filteredWords = words.filter((w) => {
    const wordDisplayName = w.translations[language]?.name || w.name;
    return wordDisplayName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6 bg-background min-h-full">
      <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-foreground mb-6 md:mb-10 mt-2 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">{t('nav.search')}</h1>
      
      <div className="relative mb-8 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          className="w-full bg-white border-2 border-foreground focus:border-accent rounded-full py-4 pl-16 pr-6 outline-none hover:-translate-y-1 transition-all font-bold text-foreground placeholder-muted-foreground shadow-[4px_4px_0px_#1E293B] focus:shadow-[6px_6px_0px_#8B5CF6] active:translate-y-0 active:shadow-[2px_2px_0px_#8B5CF6]"
          placeholder={t('common.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query.length > 0 && (
        <div>
          <p className="text-xs text-foreground bg-tertiary px-3 py-1 rounded-full w-max border-2 border-foreground shadow-[2px_2px_0px_#1E293B] mb-6 font-black font-heading uppercase tracking-wider">
            {language === 'ms' ? `${filteredWords.length} keputusan dijumpai` : `${filteredWords.length} results found`}
          </p>
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-bold font-heading bg-white rounded-xl border-2 border-dashed border-foreground">
              {t('common.noSearchResults')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((word) => {
                const wordDisplayName = word.translations[language]?.name || word.name;
                const wordDisplayDescription = word.translations[language]?.description || word.description;
                return (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <Link
                    to={`/word/${word.id}`}
                    className="flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-start p-4 bg-white border-2 border-foreground rounded-xl shadow-[4px_4px_0px_#E2E8F0] hover:-translate-y-2 hover:shadow-[8px_8px_0px_#1E293B] hover:border-foreground active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] transition-all gap-4 relative group h-full"
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
      )}

      {query.length === 0 && (
        <div className="text-center py-20 px-4 bg-muted border-2 border-foreground border-dashed rounded-xl mt-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-quaternary rounded-full border-4 border-foreground shadow-[8px_8px_0px_#1E293B] flex items-center justify-center mx-auto mb-6">
             <SearchIcon className="w-10 h-10 text-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-foreground font-extrabold font-heading text-2xl mb-2">
            {language === 'ms' ? 'Mula menaip untuk mencari!' : 'Start typing to search!'}
          </p>
          <p className="text-muted-foreground font-bold text-base">
             {t('common.signs_other', { count: words.length })}
          </p>
        </div>
      )}
    </div>
  );
}
