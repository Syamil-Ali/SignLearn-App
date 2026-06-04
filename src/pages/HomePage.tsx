import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { categories } from '../data';
import { useAppStore } from '../store';

const iconMap: Record<string, string> = {
  users: '🏠',
  school: '🏫',
  cat: '🦒',
  building: '🚑',
  apple: '🍎',
  bus: '🚌',
};

const colorMap: Record<string, { bg: string, text: string }> = {
  family: { bg: 'bg-tertiary', text: 'text-foreground' },
  school: { bg: 'bg-accent', text: 'text-white' },
  animals: { bg: 'bg-quaternary', text: 'text-foreground' },
  buildings: { bg: 'bg-secondary', text: 'text-white' },
  food: { bg: 'bg-tertiary', text: 'text-foreground' },
  transport: { bg: 'bg-accent', text: 'text-white' },
};

export default function HomePage() {
  const { progress, language } = useAppStore();

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between px-2 mb-6">
        <h3 className="text-base md:text-lg font-black font-heading text-foreground uppercase tracking-widest bg-quaternary px-4 py-1.5 rounded-full border-2 border-foreground shadow-[2px_2px_0px_#1E293B] transform -rotate-2 inline-block">
          {language === 'ms' ? 'Kategori' : 'Categories'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const theme = colorMap[category.id] || colorMap.school;
          const progressPercent = category.wordIds.length > 0 
            ? Math.round((category.wordIds.filter(id => progress.wordsViewed.includes(id)).length / category.wordIds.length) * 100)
            : 0;
            
          const displayName = category.translations[language]?.name || category.name;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <Link
                to={`/category/${category.id}`}
                className={`w-full h-full flex flex-col justify-between p-6 ${theme.bg} rounded-xl border-2 border-foreground shadow-[4px_4px_0px_#1E293B] hover:-translate-y-2 hover:shadow-[8px_8px_0px_#1E293B] active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] transition-all group`}
              >
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="w-16 h-16 bg-white rounded-full border-2 border-foreground shadow-[4px_4px_0px_#1E293B] flex items-center justify-center text-3xl group-hover:rotate-12 group-hover:scale-110 transition-transform">
                    {iconMap[category.iconName] || '✨'}
                  </div>
                  {progressPercent > 0 && (
                    <div className="w-12 h-12 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm border-2 border-foreground p-1 flex items-center justify-center bg-white shadow-[2px_2px_0px_#1E293B]">
                      <span className="text-xs font-black font-heading text-foreground">{progressPercent}%</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className={`font-black font-heading text-2xl mb-1 ${theme.text}`}>{displayName}</h4>
                  <p className={`text-sm font-bold uppercase tracking-wider ${theme.text} opacity-90`}>
                    {language === 'ms' ? `${category.wordIds.length} isyarat` : `${category.wordIds.length} signs`}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
