import { getAllRecipeAssetPaths, readRecipeAsset } from '@/lib/recipes';

// Recipe images live in the top-level recipes/ folder rather than public/,
// so they're served through this route and prerendered at build time.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRecipeAssetPaths();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string; slug: string; file: string[] }> }
) {
  const { category, slug, file } = await params;
  const asset = readRecipeAsset(category, slug, file);

  if (!asset) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(new Uint8Array(asset.data), {
    headers: { 'Content-Type': asset.contentType },
  });
}
