const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

export function resolveUploadUrl(path: string): string {
  if (!path || path.startsWith('data:') || path.startsWith('http')) return path;
  return backendBase + path;
}

export function resolveCanvasJsonUrls(json: object): object {
  if (!backendBase) return json;
  // Only rewrite bare /uploads/ paths (not already-absolute URLs)
  const str = JSON.stringify(json).replace(/"(\/uploads\/[^"]+)"/g, `"${backendBase}$1"`);
  return JSON.parse(str);
}
