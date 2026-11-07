'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface SidebarProps {
  id: string;
  title: string;
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

// Matches Tailwind's `lg` breakpoint, where the sidebar becomes a persistent column
const DESKTOP_QUERY = '(min-width: 1024px)';

// Responsive sidebar: a modal drawer below `lg`, a sticky column at `lg` and up.
// While the drawer is open the page behind it can't scroll, and scrolling inside
// it never chains through to the page.
export default function Sidebar({ id, title, open, onClose, footer, children }: SidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock page scroll, close on Escape, and move focus into the drawer while open
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const previousFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  // The drawer only exists below `lg`; close it if the viewport grows past that
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => {
      if (query.matches) onClose();
    };
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 overscroll-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id={id}
        aria-label={title}
        className={`
          fixed inset-y-0 left-0 z-50 h-dvh w-80 max-w-[85vw]
          bg-white dark:bg-gray-900 shadow-xl
          transition-[transform,visibility] duration-300 ease-in-out
          ${open ? 'visible translate-x-0' : 'invisible -translate-x-full'}
          lg:visible lg:sticky lg:top-8 lg:z-0 lg:h-auto lg:max-h-[calc(100vh-4rem)] lg:w-64 lg:max-w-none
          lg:shrink-0 lg:self-start lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:transition-none
        `}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          className="flex h-full flex-col focus:outline-none lg:max-h-[calc(100vh-4rem)]"
        >
          {/* Drawer header (mobile only) */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="text-base font-semibold text-gray-900 dark:text-white">{title}</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Close ${title.toLowerCase()}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrolls on its own; overscroll-contain stops it chaining to the page */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 lg:p-0 lg:pr-2">
            {children}
          </div>

          {footer && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 p-4">
              {footer}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
