'use client';

import { useRef } from 'react';

interface RecipeCardImageProps {
  src: string;
  alt: string;
}

// A card preview that enlarges to fill the screen when clicked. The native <dialog>
// sits above the tab's overflow clipping and handles Escape and focus; clicking
// anywhere closes it.
export default function RecipeCardImage({ src, alt }: RecipeCardImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    document.documentElement.style.overflow = 'hidden';
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`View ${alt} full screen`}
        className="block w-full cursor-zoom-in rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <img
          src={src}
          alt={alt}
          width={2100}
          height={1500}
          loading="lazy"
          className="h-auto w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white shadow-sm"
        />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        onClick={() => dialogRef.current?.close()}
        onClose={() => { document.documentElement.style.overflow = ''; }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none cursor-zoom-out bg-black/90 p-2 open:block"
      >
        <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
        <button
          type="button"
          autoFocus
          aria-label="Close full screen view"
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
