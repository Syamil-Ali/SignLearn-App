import { ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WordThumbnailProps {
  alt: string;
  className?: string;
  src?: string;
}

export default function WordThumbnail({
  alt,
  className = '',
  src,
}: WordThumbnailProps) {
  const { t } = useTranslation();

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        aria-label={t('common.mediaUnavailable')}
      >
        <div className="flex flex-col items-center gap-2 p-3 text-center">
          <ImageOff className="w-8 h-8" strokeWidth={2.25} />
          <span className="text-xs font-bold font-heading uppercase tracking-wide">
            {t('common.mediaUnavailable')}
          </span>
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
