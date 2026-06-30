import { useEffect, useRef, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Lenis from 'lenis';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import Home from './pages/Home';
import './styles/globals.css';
import './styles/animations.css';

// Route-level code splitting: Home stays eager (landing page);
// the rest load on demand to shrink the initial bundle.
const Challenge = lazy(() => import('./pages/Challenge'));
const Archive = lazy(() => import('./pages/Archive'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Keeps scroll position sane across client-side navigation:
 *  - new route (no hash)  → jump to top
 *  - route with #hash     → smooth-scroll to the matching element
 * Uses the shared Lenis instance so it cooperates with smooth scroll.
 */
const ScrollManager: React.FC<{ lenis: React.MutableRefObject<Lenis | null> }> = ({
  lenis,
}) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const instance = lenis.current;

    if (hash) {
      // Media-heavy sections grow as images/video load, so the target keeps
      // moving. Poll the element's absolute top until it settles, then perform
      // a single scroll to an unambiguous numeric position (no fighting Lenis).
      const id = hash.replace('#', '');
      const OFFSET = 80;
      let raf = 0;
      let lastTop = -1;
      let stableFrames = 0;
      let attempts = 0;
      const MAX_ATTEMPTS = 90; // ~1.5s at 60fps

      const settleAndScroll = () => {
        const el = document.getElementById(id);
        attempts += 1;
        if (!el || attempts > MAX_ATTEMPTS) {
          if (el) doScroll(el);
          return;
        }
        const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
        stableFrames = top === lastTop ? stableFrames + 1 : 0;
        lastTop = top;
        // Two identical frames in a row = layout has settled.
        if (stableFrames >= 2) {
          doScroll(el);
          return;
        }
        raf = requestAnimationFrame(settleAndScroll);
      };

      const doScroll = (el: HTMLElement) => {
        const target = Math.max(
          0,
          el.getBoundingClientRect().top + window.scrollY - OFFSET
        );
        if (instance) instance.scrollTo(target);
        else window.scrollTo({ top: target, behavior: 'smooth' });
      };

      raf = requestAnimationFrame(settleAndScroll);
      return () => cancelAnimationFrame(raf);
    }

    if (instance) instance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash, lenis]);

  return null;
};

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Respect reduced-motion: skip the smooth-scroll engine entirely.
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollManager lenis={lenisRef} />
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
