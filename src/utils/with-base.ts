export function withBase(path: string, base: string) {
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const trimmedPath = path.replace(/^\/+/, "");

  if (trimmedPath === "." || trimmedPath === "./") {
    return normalizedBase;
  }

  return `${normalizedBase}${trimmedPath}`;
}
