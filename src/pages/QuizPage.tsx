import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { words } from '../data';
import { Word } from '../types';
import { useAppStore } from '../store';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Play,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getYoutubeEmbedUrl, hasPlayableVideo } from '../media';

interface Question {
  correctWord: Word;
  options: Word[];
}

const quizWords = words.filter((word) => hasPlayableVideo(word.videoUrl));
const minQuizOptions = 4;

export default function QuizPage() {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(Math.min(5, quizWords.length));
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const { language, addQuizScore } = useAppStore();
  const { t } = useTranslation();
  const quizIsReady = quizWords.length >= minQuizOptions;

  const startQuiz = () => {
    if (!quizIsReady) {
      return;
    }

    setIsQuizStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    generateQuestion();
  };

  const generateQuestion = () => {
    setIsAnswered(false);
    setSelectedWord(null);

    const randomWords = [...quizWords].sort(() => 0.5 - Math.random());
    const correctWord = randomWords[0];
    const options = randomWords.slice(0, 4).sort(() => 0.5 - Math.random());

    setQuestion({ correctWord, options });
  };

  const handleSelectOption = (option: Word) => {
    if (isAnswered) {
      return;
    }

    setSelectedWord(option);
    setIsAnswered(true);

    if (option.id === question?.correctWord.id) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      addQuizScore(score);
      setIsQuizFinished(true);
    } else {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      generateQuestion();
    }
  };

  const handleRestartQuiz = () => {
    setIsQuizFinished(false);
    setIsQuizStarted(false);
  };

  if (!isQuizStarted) {
    return (
      <div className="flex flex-col h-full bg-background relative min-h-screen">
        <div className="p-6 md:px-12 flex justify-between items-center bg-background border-b-2 border-foreground shadow-[0px_4px_0px_#1E293B] sticky top-0 z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            {language === 'ms' ? 'Persediaan Kuiz' : 'Quiz Setup'}
          </h1>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-4 border-foreground rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_#1E293B] w-full flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-tertiary rounded-full border-4 border-foreground shadow-[4px_4px_0px_#1E293B] flex items-center justify-center mb-6">
              <Target className="w-12 h-12 text-foreground" strokeWidth={2.5} />
            </div>

            <h2 className="text-3xl md:text-4xl font-black font-heading text-foreground mb-4">
              {language === 'ms' ? 'Berapa soalan?' : 'How many questions?'}
            </h2>
            <p className="text-muted-foreground font-bold mb-8">
              {language === 'ms'
                ? 'Uji pengetahuan isyarat anda.'
                : "Test your knowledge of the signs you've learned."}
            </p>

            {!quizIsReady && (
              <div className="mb-8 rounded-2xl border-2 border-foreground bg-muted px-5 py-4 text-left shadow-[4px_4px_0px_#1E293B]">
                <p className="font-black font-heading text-foreground">
                  {t('common.quizNeedsVideo')}
                </p>
                <p className="mt-2 text-sm font-bold text-muted-foreground">
                  {language === 'ms'
                    ? `${quizWords.length} video sebenar dikesan sekarang.`
                    : `${quizWords.length} real videos detected right now.`}
                </p>
              </div>
            )}

            <div className="w-full flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setTotalQuestions(Math.max(1, totalQuestions - 1))}
                disabled={!quizIsReady}
                className="w-12 h-12 rounded-full border-2 border-foreground bg-muted flex items-center justify-center font-black text-xl transition-colors shadow-[2px_2px_0px_#1E293B] disabled:opacity-50"
              >
                -
              </button>
              <div className="text-5xl font-black font-heading w-24 text-center text-foreground">
                {totalQuestions}
              </div>
              <button
                onClick={() =>
                  setTotalQuestions(Math.min(quizWords.length, totalQuestions + 1))
                }
                disabled={!quizIsReady}
                className="w-12 h-12 rounded-full border-2 border-foreground bg-muted flex items-center justify-center font-black text-xl transition-colors shadow-[2px_2px_0px_#1E293B] disabled:opacity-50"
              >
                +
              </button>
            </div>

            <div className="flex gap-2 flex-wrap justify-center mb-8">
              {[5, 10, 15, quizWords.length].map((num) => {
                if (num > quizWords.length && num !== quizWords.length) {
                  return null;
                }

                return (
                  <button
                    key={num}
                    onClick={() => setTotalQuestions(num)}
                    disabled={!quizIsReady}
                    className={clsx(
                      'px-4 py-2 rounded-full border-2 border-foreground font-bold text-sm transition-all shadow-[2px_2px_0px_#1E293B] disabled:opacity-50',
                      totalQuestions === num
                        ? 'bg-secondary text-white scale-105'
                        : 'bg-white text-foreground hover:bg-muted',
                    )}
                  >
                    {num === quizWords.length ? (language === 'ms' ? 'Semua' : 'All') : num}
                  </button>
                );
              })}
            </div>

            <button
              onClick={startQuiz}
              disabled={!quizIsReady}
              className="w-full flex items-center justify-center gap-2 py-4 md:py-5 rounded-full font-black font-heading md:text-xl text-white bg-accent border-2 border-foreground transition-all shadow-[4px_4px_0px_#1E293B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="w-6 h-6 fill-white" strokeWidth={3} /> {t('common.startQuiz')}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div className="flex flex-col h-full bg-background relative min-h-screen">
        <div className="p-6 md:px-12 flex justify-between items-center bg-background border-b-2 border-foreground shadow-[0px_4px_0px_#1E293B] sticky top-0 z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            {language === 'ms' ? 'Rumusan Kuiz!' : 'Quiz Wrapped!'}
          </h1>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-4 border-foreground rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_#1E293B] w-full flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-tertiary rounded-full border-4 border-foreground shadow-[4px_4px_0px_#1E293B] flex items-center justify-center mb-6">
              <Trophy className="w-12 h-12 text-foreground" strokeWidth={2.5} />
            </div>

            <h2 className="text-4xl md:text-5xl font-black font-heading text-foreground mb-2">
              {language === 'ms' ? 'Kerja Bagus!' : 'Great Job!'}
            </h2>
            <p className="text-muted-foreground font-bold text-lg mb-8 uppercase tracking-widest">
              {language === 'ms'
                ? `Anda menjawab ${totalQuestions} soalan`
                : `You completed ${totalQuestions} questions`}
            </p>

            <div className="bg-muted border-2 border-dashed border-foreground rounded-2xl p-6 w-full mb-8 flex flex-col md:flex-row gap-6 justify-around">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold font-heading text-muted-foreground uppercase tracking-wider mb-1">
                  {language === 'ms' ? 'Markah' : 'Score'}
                </span>
                <span className="text-4xl font-extrabold font-heading text-accent">
                  {score}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold font-heading text-muted-foreground uppercase tracking-wider mb-1">
                  {language === 'ms' ? 'Ketepatan' : 'Accuracy'}
                </span>
                <span className="text-4xl font-extrabold font-heading text-quaternary">
                  {Math.round((score / totalQuestions) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={handleRestartQuiz}
              className="w-full flex items-center justify-center gap-2 py-4 md:py-5 rounded-full font-black font-heading md:text-xl text-foreground bg-secondary border-2 border-foreground hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#1E293B] active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B]"
            >
              <RotateCcw className="w-6 h-6" strokeWidth={3} />{' '}
              {language === 'ms' ? 'MAIN SEMULA' : 'PLAY AGAIN'}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6 text-center text-muted-foreground font-heading">
        {language === 'ms' ? 'Memuatkan kuiz...' : 'Loading quiz...'}
      </div>
    );
  }

  const questionEmbedUrl = getYoutubeEmbedUrl(question.correctWord.videoUrl);

  return (
    <div className="flex flex-col h-full bg-background relative min-h-screen">
      <div className="p-6 md:px-12 flex justify-between items-center bg-background border-b-2 border-foreground shadow-[0px_4px_0px_#1E293B] sticky top-0 z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
          {language === 'ms' ? 'Masa Kuiz!' : 'Quiz Time!'}
        </h1>
        <div className="hidden md:flex gap-4">
          <div className="bg-white border-2 border-foreground text-foreground px-4 py-2 rounded-full text-base font-black font-heading shadow-[2px_2px_0px_#1E293B] flex items-center gap-2">
            <Target className="w-5 h-5 text-quaternary" /> {currentQuestionIndex + 1} /{' '}
            {totalQuestions}
          </div>
          <div className="bg-tertiary border-2 border-foreground text-foreground px-4 py-2 rounded-full text-base font-black font-heading shadow-[2px_2px_0px_#1E293B]">
            Score: <span className="text-xl ml-1">{score}</span>
          </div>
        </div>
        <div className="flex md:hidden flex-col items-end gap-2">
          <div className="text-sm font-black font-heading bg-white px-3 py-1 border-2 border-foreground rounded-full shadow-[2px_2px_0px_#1E293B]">
            Q: {currentQuestionIndex + 1}/{totalQuestions}
          </div>
          <div className="text-sm font-black font-heading bg-tertiary px-3 py-1 border-2 border-foreground rounded-full shadow-[2px_2px_0px_#1E293B]">
            Score: {score}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12 flex-1 flex flex-col pt-8 md:pt-12 items-center w-full max-w-4xl mx-auto">
        <h2 className="text-center font-black font-heading text-foreground uppercase tracking-widest text-sm md:text-base mb-8 bg-white border-2 border-foreground rounded-full py-2 md:py-3 px-6 shadow-[4px_4px_0px_#1E293B] w-max">
          {language === 'ms' ? 'Apakah maksud isyarat ini?' : 'What does this sign mean?'}
        </h2>

        <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] md:aspect-[16/9] bg-white border-2 border-foreground rounded-xl overflow-hidden shadow-[8px_8px_0px_#E2E8F0] mb-10 flex items-center justify-center p-2">
          <div className="w-full h-full rounded-lg overflow-hidden border-2 border-foreground shadow-sm bg-black">
            {questionEmbedUrl ? (
              <iframe
                className="w-full h-full pointer-events-none scale-[1.25]"
                src={`${questionEmbedUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${questionEmbedUrl.split('/').pop()}`}
                title={question.correctWord.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={question.correctWord.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          <AnimatePresence>
            {question.options.map((option, index) => {
              const isCorrect = isAnswered && option.id === question.correctWord.id;
              const isSelected = selectedWord?.id === option.id;
              const isWrong = isAnswered && isSelected && !isCorrect;

              let buttonClass =
                'bg-white border-2 border-foreground text-foreground shadow-[4px_4px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1E293B] active:translate-y-1 active:shadow-none';
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass =
                    'bg-quaternary border-2 border-foreground text-foreground shadow-[2px_2px_0px_#1E293B] scale-105 z-10';
                } else if (isWrong) {
                  buttonClass =
                    'bg-secondary border-2 border-foreground text-white shadow-[2px_2px_0px_#1E293B]';
                } else {
                  buttonClass =
                    'bg-muted border-2 border-border text-muted-foreground opacity-50 shadow-none';
                }
              }

              return (
                <motion.button
                  key={option.id + question.correctWord.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={clsx(
                    'p-4 md:p-6 rounded-xl font-black font-heading text-lg md:text-2xl transition-all flex flex-col items-center justify-center gap-2 text-center',
                    buttonClass,
                  )}
                >
                  {option.translations[language]?.name || option.name}
                  {isCorrect && <CheckCircle2 className="w-8 h-8 text-foreground" strokeWidth={3} />}
                  {isWrong && <XCircle className="w-8 h-8 text-white" strokeWidth={3} />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex justify-center max-w-sm mx-auto w-full"
            >
              <button
                onClick={handleNextQuestion}
                className="w-full flex items-center justify-center gap-2 py-4 md:py-5 rounded-full font-black font-heading md:text-xl text-white bg-accent border-2 border-foreground hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#1E293B] active:translate-y-1 active:shadow-[2px_2px_0px_#1E293B]"
              >
                {currentQuestionIndex + 1 >= totalQuestions ? (
                  <>
                    {language === 'ms' ? 'TAMAT KUIZ' : 'FINISH QUIZ'}{' '}
                    <Target className="w-6 h-6" strokeWidth={3} />
                  </>
                ) : (
                  <>
                    {language === 'ms' ? 'SOALAN SETERUSNYA' : 'NEXT QUESTION'}{' '}
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
