/**
 * Creates a proxied URL that bypasses CORS restrictions
 * Uses a simple CORS proxy service
 */
export const createProxyUrl = (targetUrl: string): string => {
  // Use a public CORS proxy service
  const proxyBase = 'https://api.allorigins.win/raw?url=';
  return `${proxyBase}${encodeURIComponent(targetUrl)}`;
};

/**
 * Alternative proxy using cors-anywhere (if available)
 */
export const createCorsAnywhereUrl = (targetUrl: string): string => {
  const proxyBase = 'https://cors-anywhere.herokuapp.com/';
  return `${proxyBase}${targetUrl}`;
};

/**
 * Fallback to fetch with no-cors mode (limited functionality)
 */
export const fetchWithProxy = async (url: string): Promise<Response> => {
  try {
    // First try direct fetch
    return await fetch(url);
  } catch (error) {
    // If CORS error, try with proxy
    const proxyUrl = createProxyUrl(url);
    return await fetch(proxyUrl);
  }
};