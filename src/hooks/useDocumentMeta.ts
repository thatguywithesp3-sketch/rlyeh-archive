import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description: string;
}

/** Upsert a <meta> tag by name or property, creating it if absent. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Per-route document title + meta. All routes previously shared the home meta
 * from index.html; this gives each page its own title/description and keeps the
 * Open Graph / Twitter cards in sync so shared links preview correctly.
 */
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }, [title, description]);
}
