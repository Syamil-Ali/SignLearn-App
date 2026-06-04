const PLACEHOLDER_HOSTS = new Set([
  'example.com',
  'www.example.com',
  'loremflickr.com',
  'www.loremflickr.com',
]);

const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|ogg)$/i;

function parseHttpsUrl(rawUrl?: string) {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function sanitizeMediaUrl(rawUrl?: string) {
  const url = parseHttpsUrl(rawUrl);
  if (!url || PLACEHOLDER_HOSTS.has(url.hostname)) {
    return null;
  }
  return url.toString();
}

export function getYoutubeEmbedUrl(rawUrl?: string) {
  const url = parseHttpsUrl(rawUrl);
  if (!url) {
    return null;
  }

  let videoId: string | null = null;

  if (url.hostname === 'youtu.be') {
    videoId = url.pathname.slice(1);
  } else if (url.hostname.endsWith('youtube.com')) {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v');
    } else {
      const match = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
      videoId = match?.[2] ?? null;
    }
  }

  return videoId && videoId.length === 11
    ? `https://www.youtube.com/embed/${videoId}`
    : null;
}

export function hasPlayableVideo(rawUrl?: string) {
  const sanitizedUrl = sanitizeMediaUrl(rawUrl);
  if (!sanitizedUrl) {
    return false;
  }

  return Boolean(
    getYoutubeEmbedUrl(sanitizedUrl) ||
      DIRECT_VIDEO_EXTENSIONS.test(new URL(sanitizedUrl).pathname),
  );
}
