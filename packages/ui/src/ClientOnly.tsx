import React from 'react';
import { useHydrated } from './hooks/useBreakpoint';

/**
 * Renders its children only after the web page has hydrated.
 * Use it around content that depends on the URL's query string (?id=, ?tab=, ?search=):
 * the static pre-render can't know those values, so rendering them during hydration
 * would produce a mismatch (React error #418).
 */
export default function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hydrated = useHydrated();
  return <>{hydrated ? children : fallback}</>;
}
