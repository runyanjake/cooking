// Typography for markdown-style body content (recipe tabs, About page).
// Lives in components/ because Tailwind only scans components/ and app/ for class names,
// and outside RecipeTabs because a 'use client' module can't share values with server components.
export const MARKDOWN_BODY_CLASSES = `max-w-none text-base leading-relaxed
  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-2
  [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_p]:my-2
  [&_strong]:text-gray-900 dark:[&_strong]:text-white
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
  [&_li]:text-gray-700 dark:[&_li]:text-gray-300
  [&_li]:marker:text-gray-500 dark:[&_li]:marker:text-gray-400
  [&_code]:text-gray-900 dark:[&_code]:text-gray-100 [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5
  [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-900
  [&_table]:border-collapse
  [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-600
  [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600
  [&_figure]:my-6
  [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-gray-600 dark:[&_figcaption]:text-gray-400`;
