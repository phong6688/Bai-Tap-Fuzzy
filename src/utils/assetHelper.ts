/**
 * Helper to dynamically resolve asset paths relative to the current index.html location.
 * This guarantees assets load correctly across different host subdirectories, Live Server ports, and build environments.
 */
export function getAssetPath(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, base64 data, or external asset, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Strip any leading slash for relative joining
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Get current page URL without hash parameters
  const href = window.location.href;
  const hashIndex = href.indexOf('#');
  const urlWithoutHash = hashIndex !== -1 ? href.substring(0, hashIndex) : href;
  
  // Extract the parent directory base path (ends with a slash)
  const baseDir = urlWithoutHash.substring(0, urlWithoutHash.lastIndexOf('/') + 1);
  
  return baseDir + cleanPath;
}
