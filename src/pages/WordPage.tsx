import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { getWordById, getWordsByCategory } from '../data';
import { useAppStore } from '../store';
import {
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
  Languages,
  VideoOff,
} from 'lucide-react';
import { clsx } from 'clsx';
import WordThumbnail from '../components/WordThumbnail';
import { getYoutubeEmbedUrl } from '../media';

export default function WordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const word = getWordById(id || '');
  const { toggleFavorite, favorites, markWordViewed, language } = useAppStore();

  useEffect(() => {
    if (word) {
      markWordViewed(word.id);
    }
  }, [word, markWordViewed]);

  if (!word) {
    return (
      <div className="p-6 text-center text-gray-500">
        {language === 'ms' ? 'Isyarat tidak dijumpai' : 'Word not found'}
      </div>
    );
  }

  const isFavorite = favorites.includes(word.id);
  const categoryWords = getWordsByCategory(word.categoryId);
  const currentIndex = categoryWords.findIndex((currentWord) => currentWord.id === word.id);
  const prevWord = currentIndex > 0 ? categoryWords[currentIndex - 1] : null;
  const nextWord =
    currentIndex < categoryWords.length - 1 ? categoryWords[currentIndex + 1] : null;
  const youtubeEmbedUrl = getYoutubeEmbedUrl(word.videoUrl);
  const hasMedia = Boolean(word.videoUrl || word.imageUrl);

  const wordDisplayName = word.translations[language]?.name || word.name;
  const wordDisplayDescription = word.translations[language]?.description || word.description;

  return (
    <div className="flex flex-col h-full bg-background relative min-h-screen">
      <div className="flex items-center justify-between p-6 bg-background border-b-2 border-foreground sticky top-0 z-10 shadow-[0px_4px_0px_#1E293B]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-foreground border-2 border-foreground shadow-[2px_2px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1E293B] active:translate-y-1 active:shadow-none transition-all"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
        </button>
        <div className="text-sm font-extrabold font-heading text-foreground uppercase tracking-wider bg-white border-2 border-foreground px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#1E293B]">
          {currentIndex + 1} / {categoryWords.length}
        </div>
        <button
          onClick={() => toggleFavorite(word.id)}
          className="w-10 h-10 flex items-center justify-center border-2 border-foreground bg-white rounded-full text-foreground shadow-[2px_2px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1E293B] transition-all"
        >
          <Star
            className={clsx('w-5 h-5', isFavorite ? 'fill-secondary text-secondary' : '')}
            strokeWidth={isFavorite ? 2 : 2.5}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-6 md:px-12 pt-8 flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
          <div className="flex-1 flex flex-col w-full min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-quaternary rounded-full border-2 border-foreground shadow-[2px_2px_0px_#1E293B] flex items-center justify-center text-xl shrink-0">
                <Languages className="w-6 h-6 text-foreground" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] break-words">
                {wordDisplayName}
              </h1>
            </div>

            <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto bg-foreground border-2 border-foreground rounded-xl shadow-[8px_8px_0px_#E2E8F0] overflow-hidden flex flex-col items-center justify-center p-2 bg-white">
              {word.videoUrl ? (
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-foreground shadow-sm bg-black">
                  {youtubeEmbedUrl ? (
                    <iframe
                      className="w-full h-full"
                      src={youtubeEmbedUrl}
                      title={word.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={word.videoUrl}
                      className="w-full h-full object-contain bg-black"
                      controls
                    />
                  )}
                </div>
              ) : (
                <WordThumbnail
                  src={word.imageUrl}
                  alt={word.name}
                  className="w-full h-full object-cover rounded-lg border-2 border-foreground shadow-sm transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={word.id}
            className="flex-1 flex flex-col w-full min-w-0 md:pt-20"
          >
            <div className="flex flex-col gap-6 h-full">
              <div className="flex-1 flex flex-col justify-center items-center gap-2 p-6 md:p-10 bg-white rounded-xl border-2 border-foreground shadow-[4px_4px_0px_#E2E8F0] relative mt-4 md:mt-0">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs md:text-sm font-black font-heading text-accent uppercase tracking-widest bg-muted px-6 py-2 rounded-full border-2 border-foreground shadow-[2px_2px_0px_#1E293B]">
                  {language === 'ms' ? 'Cara Isyarat' : 'How to sign'}
                </div>
                {!hasMedia && (
                  <div className="mb-2 flex items-center gap-2 rounded-full border-2 border-foreground bg-muted px-4 py-2 text-xs font-black font-heading uppercase tracking-wide text-muted-foreground">
                    <VideoOff className="w-4 h-4" strokeWidth={2.5} />
                    {language === 'ms' ? 'Media belum tersedia' : 'Media not available yet'}
                  </div>
                )}
                <p className="text-center text-lg md:text-xl font-medium leading-relaxed text-foreground mt-4">
                  {wordDisplayDescription}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto left-0 right-0 p-6 bg-background flex justify-between items-center gap-4 z-20 pb-safe md:pb-6 border-t-2 border-foreground shadow-[0px_-4px_0px_#1E293B]">
        <div className="w-full flex justify-between items-center gap-4 max-w-6xl mx-auto">
          {prevWord ? (
            <button
              onClick={() => {
                navigate(`/word/${prevWord.id}`);
              }}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 md:py-5 bg-white rounded-full font-black font-heading text-foreground border-2 border-foreground hover:bg-tertiary hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#1E293B] active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] text-lg"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={3} />{' '}
              {language === 'ms' ? 'SEBELUMNYA' : 'PREVIOUS'}
            </button>
          ) : (
            <div className="flex-1 max-w-[200px]"></div>
          )}

          {nextWord ? (
            <button
              onClick={() => {
                navigate(`/word/${nextWord.id}`);
              }}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 md:py-5 bg-accent rounded-full font-black font-heading text-white border-2 border-foreground hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#1E293B] active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B] text-lg"
            >
              {language === 'ms' ? 'SETERUSNYA' : 'NEXT'}{' '}
              <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </button>
          ) : (
            <div className="flex-1 max-w-[200px]"></div>
          )}
        </div>
      </div>
    </div>
  );
}
