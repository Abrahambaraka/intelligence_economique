export function getImagePlaceholder(width: number, height: number): string {
  // Generate a simple SVG placeholder with better aesthetics
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="loading-aria" preserveAspectRatio="none">
      <title id="loading-aria">Loading...</title>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <rect x="20%" y="20%" width="60%" height="60%" fill="#d1d5db" rx="8" />
      <circle cx="40%" cy="40%" r="8%" fill="#9ca3af" />
      <rect x="30%" y="60%" width="40%" height="8%" fill="#9ca3af" rx="4" />
      <rect x="30%" y="72%" width="25%" height="6%" fill="#b5b8bc" rx="3" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function getBlurDataURL(width: number = 400, height: number = 300): string {
  // Generate a low-quality placeholder for blur effect
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="50%" stop-color="#e2e8f0" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
