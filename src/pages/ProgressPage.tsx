import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { words, categories } from '../data';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProgressPage() {
  const { progress, language, resetDeviceData } = useAppStore();
  const { t } = useTranslation();

  const totalWords = words.length;
  const learnedWords = progress.wordsViewed.length;
  const wordProgressPercent = Math.round((learnedWords / totalWords) * 100) || 0;

  const totalCategories = categories.length;
  const completedCategories = progress.categoriesCompleted.length;
  const categoryProgressPercent = Math.round((completedCategories / totalCategories) * 100) || 0;

  const handleReset = () => {
    if (window.confirm(t('common.resetProgressConfirm'))) {
      resetDeviceData();
      window.alert(t('common.resetProgressDone'));
    }
  };

  return (
    <div className="p-6 bg-background min-h-full">
      <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-foreground mb-6 md:mb-10 mt-2 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">{t('nav.progress')}</h1>

      <div className="flex flex-col gap-4">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-xl border-2 border-foreground flex items-center justify-between shadow-[4px_4px_0px_#1E293B]"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-quaternary rounded-full flex items-center justify-center shadow-[2px_2px_0px_#1E293B] text-foreground border-2 border-foreground">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <p className="text-xl md:text-2xl font-black font-heading text-foreground">
                    {language === 'ms' ? 'Jumlah Isyarat Dipelajari' : 'Total Words Learned'}
                </p>
            </div>
            <p className="text-3xl md:text-4xl font-extrabold font-heading text-foreground">
                {learnedWords} <span className="text-xl md:text-2xl text-muted-foreground">/ {totalWords}</span>
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 bg-white rounded-xl border-2 border-foreground flex items-center justify-between shadow-[4px_4px_0px_#1E293B]"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary rounded-full flex items-center justify-center shadow-[2px_2px_0px_#1E293B] text-foreground border-2 border-foreground">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <p className="text-xl md:text-2xl font-black font-heading text-foreground">
                    {t('common.categoriesCompleted')}
                </p>
            </div>
            <p className="text-3xl md:text-4xl font-extrabold font-heading text-foreground">
                {completedCategories} <span className="text-xl md:text-2xl text-muted-foreground">/ {totalCategories}</span>
            </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-xl border-2 border-foreground shadow-[4px_4px_0px_#1E293B]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl md:text-2xl font-black font-heading text-foreground">
                {t('common.resetProgress')}
              </p>
              <p className="text-sm font-bold text-muted-foreground">
                {t('common.resetProgressHelp')}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground bg-secondary px-5 py-3 font-black font-heading text-foreground shadow-[4px_4px_0px_#1E293B] transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B]"
            >
              <RotateCcw className="w-5 h-5" strokeWidth={2.75} />
              {language === 'ms' ? 'PADAM DATA PERANTI' : 'CLEAR DEVICE DATA'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
