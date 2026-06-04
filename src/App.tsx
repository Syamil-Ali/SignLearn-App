/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Star, Search as SearchIcon, HelpCircle, Trophy, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from './store';
import { useTranslation } from 'react-i18next';
import { lazy, Suspense, useEffect } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const WordPage = lazy(() => import('./pages/WordPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function LanguageToggle() {
  const { language, setLanguage } = useAppStore();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
      className="flex items-center gap-2 p-2 bg-white rounded-xl border-2 border-foreground shadow-[2px_2px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1E293B] active:translate-y-0 active:shadow-none transition-all group"
    >
      <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      <span className="font-bold font-heading uppercase text-sm">{language}</span>
    </button>
  );
}

function SidebarNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.learn'), icon: BookOpen, color: 'bg-accent' },
    { path: '/search', label: t('nav.search'), icon: SearchIcon, color: 'bg-secondary' },
    { path: '/favorites', label: t('nav.favorites'), icon: Star, color: 'bg-tertiary' },
    { path: '/quiz', label: t('nav.quiz'), icon: HelpCircle, color: 'bg-quaternary' },
    { path: '/progress', label: t('nav.progress'), icon: Trophy, color: 'bg-accent' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t-2 border-foreground pb-safe z-50">
        <div className="flex justify-around items-center h-16 w-full px-2">
          {navItems.map((item) => {
            const isActive = (item.path === '/' && (location.pathname === '/' || location.pathname.startsWith('/category/') || location.pathname.startsWith('/word/'))) || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-1 transition-all",
                  isActive ? "text-accent -translate-y-1" : "text-muted-foreground hover:text-foreground hover:-translate-y-1"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-accent")} strokeWidth={2.5} />
                <span className={cn("text-[10px]", isActive ? "font-extrabold font-heading text-foreground" : "font-bold font-heading")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-72 h-full bg-white border-r-2 border-foreground sticky top-0 z-50 shadow-[4px_0_0_#1E293B]">
        <div className="p-6 border-b-2 border-foreground flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-tertiary rounded-tr-2xl rounded-bl-2xl rounded-tl-[4px] rounded-br-[4px] flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_#1E293B] group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#1E293B] transition-all">
              <span className="text-foreground text-2xl font-black font-heading tracking-tighter">SL</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight font-heading text-foreground">Sign<span className="text-accent">Learn</span></h1>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {navItems.map((item) => {
            const isActive = (item.path === '/' && (location.pathname === '/' || location.pathname.startsWith('/category/') || location.pathname.startsWith('/word/'))) || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 border-foreground transition-all group",
                  isActive
                    ? `${item.color} text-white shadow-[4px_4px_0px_#1E293B] translate-x-1 -translate-y-1`
                    : "bg-white text-muted-foreground hover:text-foreground hover:shadow-[4px_4px_0px_#1E293B] hover:-translate-y-1 hover:translate-x-1"
                )}
              >
                <div className={cn("p-2 bg-white rounded-full border-2 border-foreground shadow-[2px_2px_0px_#1E293B] text-foreground transition-transform group-hover:rotate-12", isActive && "rotate-12")}>
                  <item.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className={cn("text-lg", isActive ? "font-extrabold font-heading" : "font-bold font-heading")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Decorative elements at bottom of sidebar */}
        <div className="p-6 border-t-2 border-foreground bg-muted overflow-hidden relative">
           <div className="w-16 h-16 bg-quaternary rounded-full absolute -right-8 -bottom-8 opacity-50"></div>
           <div className="w-8 h-8 bg-secondary rotate-45 transform absolute left-4 bottom-4 border-2 border-foreground"></div>
           <div className="flex flex-col items-center gap-4 relative z-10">
             <LanguageToggle />
             <div className="text-center font-bold font-heading text-foreground">{t('common.keepSigning')}</div>
           </div>
        </div>
      </nav>
    </>
  );
}

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-6">
      <div className="rounded-full border-2 border-foreground bg-white px-5 py-3 font-black font-heading uppercase tracking-wide text-foreground shadow-[4px_4px_0px_#1E293B]">
        Loading...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen font-sans text-foreground bg-background overflow-hidden relative">
         <SidebarNav />
        <main className="flex-1 overflow-y-auto h-full w-full">
           {/* Mobile Header (Hidden on Desktop) */}
           <nav className="md:hidden h-20 bg-white border-b-2 border-foreground px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_0_#1E293B]">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-tertiary rounded-tr-2xl rounded-bl-2xl rounded-tl-[4px] rounded-br-[4px] flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_#1E293B]">
                  <span className="text-foreground text-2xl font-black font-heading tracking-tighter">SL</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-foreground">Sign<span className="text-accent">Learn</span></h1>
              </Link>
              <LanguageToggle />
            </nav>

          <div className="w-full max-w-6xl mx-auto min-h-full pb-20 md:pb-8 flex flex-col pt-0 md:pt-8 px-4 md:px-8">
            <div className="flex-1 h-full w-full">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/word/:id" element={<WordPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
