'use client';

interface PrintCardButtonProps {
  imageUrls: string[];
  className?: string;
}

// Prints the card images at their physical size, one per page, from a hidden iframe
export default function PrintCardButton({ imageUrls, className }: PrintCardButtonProps) {
  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    iframe.srcdoc = `<!doctype html><html><head><style>
      @page { size: 7in 5in; margin: 0; }
      html, body { margin: 0; }
      img { display: block; width: 7in; height: 5in; break-after: page; }
      img:last-child { break-after: auto; }
    </style></head><body>${imageUrls
      .map((url) => `<img src="${new URL(url, window.location.href).href}" alt="">`)
      .join('')}</body></html>`;

    iframe.onload = async () => {
      const printWindow = iframe.contentWindow;
      if (!printWindow) return;
      await Promise.all(
        Array.from(printWindow.document.images).map((img) => img.decode().catch(() => undefined))
      );
      printWindow.addEventListener('afterprint', () => iframe.remove());
      printWindow.focus();
      printWindow.print();
    };
    document.body.appendChild(iframe);
  };

  return (
    <button type="button" onClick={handlePrint} className={className}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2M7 14h10v7H7z" />
      </svg>
      Print
    </button>
  );
}
