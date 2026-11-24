import { useSyncExternalStore } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * Bootstrap 5 breakpoints used by the reference Blade templates
 * (col-md = 768, col-lg = 992, col-xl = 1200).
 */
export const Breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

/**
 * The web build is statically pre-rendered (app.json → web.output "static").
 * The server has no window, so anything that depends on the screen width must
 * render exactly like the server while React hydrates the page; otherwise the
 * pre-rendered styles are kept and the layout is wrong. useSyncExternalStore
 * returns the server snapshot (false) during hydration and the client value
 * (true) right after, which triggers a normal re-render.
 */
const noopSubscribe = () => () => {};

/** false during static pre-render and while hydrating on web, true otherwise */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const SSR_WIDTH = 1280;
const SSR_HEIGHT = 800;

export function useBreakpoint() {
  const dims = useWindowDimensions();
  const ready = useHydrated();

  const width = ready ? dims.width : SSR_WIDTH;
  const height = ready ? dims.height : SSR_HEIGHT;

  return {
    width,
    height,
    isMobile: width < Breakpoints.md,
    isTablet: width >= Breakpoints.md && width < Breakpoints.lg,
    isDesktop: width >= Breakpoints.lg,
    isXL: width >= Breakpoints.xl,
    /** true for md and up */
    mdUp: width >= Breakpoints.md,
    /** true for lg and up */
    lgUp: width >= Breakpoints.lg,
  };
}
