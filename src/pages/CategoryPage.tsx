import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCategoryById, getWordsByCategory } from '../data';
import { useAppStore } from '../store';
import { ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import WordThumbnail from '../components/WordThumbnail';

const categoryColors: Record<string, string> = {
  family: 'bg-tertiary text-foreground border-b-2 border-foreground',
  school: 'bg-accent text-white border-b-2 border-foreground',
  animals: 'bg-quaternary text-foreground border-b-2 border-foreground',
  buildings: 'bg-secondary text-white border-b-2 border-foreground',
  food: 'bg-tertiary text-foreground border-b-2 border-foreground',
  transport: 'bg-accent text-white border-b-2 border-foreground',
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = getCategoryById(id || '');
  const words = getWordsByCategory(id || '');
  const { progress, markCategoryCompleted, language } = useAppStore();

  useEffect(() => {
    if (category) {
      const allWordsLearned = category.wordIds.every(wordId => progress.wordsViewed.includes(wordId));
      if (allWordsLearned && category.wordIds.length > 0) {
        markCategoryCompleted(category.id);
      }
    }
  }, [category, progress.wordsViewed, markCategoryCompleted]);

  if (!category) return <div className="p-6 text-center text-muted-foreground font-heading">{language === 'ms' ? 'Kategori tidak dijumpai' : 'Category not found'}</div>;

  const headerColor = categoryColors[category.id] || 'bg-accent text-white border-b-2 border-foreground';
  const categoryDisplayName = category.translations[language]?.name || category.name;

  return (
    <div className="flex flex-col h-full bg-background relative min-h-screen">
      <div className={`p-6 md:p-12 ${headerColor} z-10 relative shadow-[0px_4px_0px_#1E293B]`}>
        <button onClick={() => navigate(-1)} className="mb-6 w-12 h-12 flex items-center justify-center rounded-full bg-white text-foreground border-2 border-foreground shadow-[4px_4px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1E293B] active:translate-y-1 active:shadow-none transition-all">
          <ArrowLeft className="w-6 h-6" strokeWidth={3} />
        </button>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">{categoryDisplayName}</h1>
        <p className="mt-4 font-bold font-heading uppercase tracking-widest text-sm opacity-90 inline-block bg-white text-foreground border-2 border-foreground px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#1E293B]">
          {language === 'ms' ? `${words.length} isyarat` : `${words.length} signs`}
        </p>
      </div>

      <div className="flex-1 bg-background pt-8 px-6 md:px-12 relative flex flex-col z-0 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word, index) => {
            const isLearned = progress.wordsViewed.includes(word.id);
            const wordDisplayName = word.translations[language]?.name || word.name;
            
            return (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <Link
                  to={`/word/${word.id}`}
                  className="flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-start p-4 bg-white border-2 border-foreground rounded-xl shadow-[4px_4px_0px_#E2E8F0] hover:-translate-y-2 hover:shadow-[8px_8px_0px_#1E293B] hover:border-foreground active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] transition-all gap-4 relative group h-full"
                >
                  <div className="w-full sm:w-24 h-40 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-muted border-2 border-foreground">
                    <WordThumbnail
                      src={word.imageUrl}
                      alt={word.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center items-center sm:items-start text-center sm:text-left py-2 w-full">
                    <h3 className={`font-bold font-heading text-2xl mb-2 sm:mb-0 break-words w-full ${isLearned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {wordDisplayName}
                    </h3>
                     {isLearned ? (
                       <div className="mt-auto flex items-center justify-center text-foreground gap-1 bg-quaternary px-3 py-1.5 rounded-full text-xs font-bold border-2 border-foreground shadow-[2px_2px_0px_#1E293B]">
                          <CheckCircle2 className="w-4 h-4 text-foreground" strokeWidth={2.5} />
                          <span className="font-heading uppercase tracking-wide">
                            {language === 'ms' ? 'Selesai' : 'Learned'}
                         </span>
                       </div>
                    ) : (
                      <div className="mt-auto w-12 h-12 rounded-full flex items-center justify-center bg-white text-foreground border-2 border-foreground shadow-[2px_2px_0px_#1E293B] group-hover:bg-tertiary group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
