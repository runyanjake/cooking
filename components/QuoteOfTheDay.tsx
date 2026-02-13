'use client';

import { useState, useEffect } from 'react';
import quotes from '@/public/quotes.json';

interface Quote {
  text: string;
  author?: string;
  link?: string;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const index = getDayOfYear() % quotes.length;
    setQuote(quotes[index] as Quote);
  }, []);

  if (!quote) {
    return <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">&nbsp;</p>;
  }

  const content = quote.author ? (
    <>
      <span className="italic">&ldquo;{quote.text}&rdquo;</span>
      <span> &mdash; {quote.author}</span>
    </>
  ) : (
    <span>{quote.text}</span>
  );

  const href = quote.link && !/^https?:\/\//.test(quote.link)
    ? `https://${quote.link}`
    : quote.link;

  const wrapper = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline transition-colors"
    >
      {content}
    </a>
  ) : (
    content
  );

  return (
    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      {wrapper}
    </p>
  );
}
