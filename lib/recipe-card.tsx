import fs from 'fs';
import path from 'path';
import satori, { type Font } from 'satori';
import sharp from 'sharp';
import type { List, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import type { ReactElement } from 'react';
import { getRecipeContent, type Recipe } from './recipes';
import type { CardSectionName } from './recipe-content';
import { recipeCardImageUrl } from './recipe-urls';
import { SITE_NAME, SITE_URL } from './site';

// 5×7 in landscape at 300 DPI. 5×7 is a standard photo print size, so the PNG
// prints edge to edge on photo paper or card stock without scaling.
export const CARD_DPI = 300;
export const CARD_WIDTH = 7 * CARD_DPI;
export const CARD_HEIGHT = 5 * CARD_DPI;

const PADDING = 105;
const GUTTER = 72;
const INNER_WIDTH = CARD_WIDTH - 2 * PADDING;
const FOOTER_FONT_SIZE = 26;
const FOOTER_HEIGHT = 34;
const FOOTER_GAP = 28;
const LINE_HEIGHT = 1.32;

// Body text sizes to try, largest first (34px ≈ 8pt, 30px ≈ 7pt when printed).
// A single side at a smaller size beats front/back at a larger one.
const SINGLE_SIDED_SIZES = [44, 42, 40, 38, 36, 34];
const DOUBLE_SIDED_SIZES = [44, 42, 40, 38, 36, 34, 32, 30];

const COLORS = {
  background: '#ffffff',
  ink: '#1c1917',
  muted: '#78716c',
  accent: '#9a3412',
};

const SECTION_LABELS: Record<CardSectionName, string> = {
  ingredients: 'Ingredients',
  instructions: 'Instructions',
};

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'item'; marker: string; ordered: boolean; depth: number; text: string }
  | { kind: 'text'; text: string };

interface CardSection {
  name: CardSectionName;
  blocks: Block[];
}

interface Region {
  section: CardSection;
  columnWidth: number;
  columns: Block[][];
}

type FaceName = 'card' | 'front' | 'back';

interface CardFace {
  name: FaceName;
  compactHeader: boolean;
  regions: Region[];
}

interface CardLayout {
  fontSize: number;
  faces: CardFace[];
}

export interface RecipeCardImage {
  label: string;
  url: string;
  fileName: string;
  downloadName: string;
}

let fonts: Font[] | null = null;

function getFonts(): Font[] {
  if (!fonts) {
    const file = (pkg: string, name: string) =>
      fs.readFileSync(path.join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', name));
    fonts = [
      { name: 'Inter', data: file('inter', 'inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
      { name: 'Inter', data: file('inter', 'inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
      { name: 'Inter', data: file('inter', 'inter-latin-700-normal.woff'), weight: 700, style: 'normal' },
      { name: 'Lora', data: file('lora', 'lora-latin-700-normal.woff'), weight: 700, style: 'normal' },
    ];
  }
  return fonts;
}

// Flattens markdown into the blocks a printed card shows; images, tables and code are dropped
function toBlocks(tree: Root): Block[] {
  const blocks: Block[] = [];
  const addList = (list: List, depth: number) => {
    list.children.forEach((item, i) => {
      const ordered = Boolean(list.ordered);
      blocks.push({
        kind: 'item',
        ordered,
        depth,
        marker: ordered ? `${(list.start ?? 1) + i}.` : depth > 0 ? '–' : '•',
        text: item.children.filter((c) => c.type !== 'list').map((c) => toString(c)).join(' '),
      });
      for (const child of item.children) {
        if (child.type === 'list') addList(child, depth + 1);
      }
    });
  };

  for (const node of tree.children) {
    if (node.type === 'heading') {
      blocks.push({ kind: 'heading', text: toString(node) });
    } else if (node.type === 'list') {
      addList(node, 0);
    } else if (node.type === 'paragraph' && !node.data?.hName) {
      const text = toString(node).trim();
      if (text) blocks.push({ kind: 'text', text });
    }
  }
  return blocks;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

function headingTopGap(fontSize: number) {
  return Math.round(fontSize * 0.7);
}

function renderHeader(recipe: Recipe, fontSize: number, compact: boolean): ReactElement {
  const meta = [
    recipe.prepTime ? `Prep ${formatMinutes(recipe.prepTime)}` : null,
    recipe.cookTime ? `Cook ${formatMinutes(recipe.cookTime)}` : null,
    recipe.servings ? `Serves ${recipe.servings}` : null,
  ].filter((part): part is string => part !== null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: INNER_WIDTH }}>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Lora',
          fontWeight: 700,
          fontSize: Math.round(fontSize * (compact ? 1.3 : 2)),
          lineHeight: 1.12,
          color: COLORS.ink,
        }}
      >
        {recipe.title}
      </div>
      {!compact && meta.length > 0 && (
        <div style={{ display: 'flex', marginTop: Math.round(fontSize * 0.35), fontSize: Math.round(fontSize * 0.82), fontWeight: 600, color: COLORS.muted }}>
          {meta.map((part, i) => (
            <div key={part} style={{ display: 'flex' }}>
              {i > 0 && <div style={{ display: 'flex', margin: `0 ${Math.round(fontSize * 0.5)}px` }}>·</div>}
              {part}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          height: 4,
          backgroundColor: COLORS.accent,
          marginTop: Math.round(fontSize * 0.55),
          marginBottom: Math.round(fontSize * 0.8),
        }}
      />
    </div>
  );
}

function renderLabel(section: CardSection, fontSize: number, visible: boolean, key?: string): ReactElement {
  return (
    <div
      key={key}
      style={{
        display: 'flex',
        fontSize: Math.round(fontSize * 0.66),
        fontWeight: 700,
        letterSpacing: Math.round(fontSize * 0.12),
        textTransform: 'uppercase',
        color: visible ? COLORS.accent : 'transparent',
        paddingBottom: Math.round(fontSize * 0.45),
      }}
    >
      {SECTION_LABELS[section.name]}
    </div>
  );
}

function renderBlock(block: Block, fontSize: number, firstInColumn: boolean, key: string): ReactElement {
  if (block.kind === 'heading') {
    return (
      <div
        key={key}
        style={{
          display: 'flex',
          paddingTop: firstInColumn ? 0 : headingTopGap(fontSize),
          paddingBottom: Math.round(fontSize * 0.22),
          fontWeight: 700,
          color: COLORS.ink,
        }}
      >
        {block.text}
      </div>
    );
  }
  if (block.kind === 'text') {
    return (
      <div key={key} style={{ display: 'flex', paddingBottom: Math.round(fontSize * 0.4) }}>
        {block.text}
      </div>
    );
  }
  return (
    <div
      key={key}
      style={{
        display: 'flex',
        paddingBottom: Math.round(fontSize * 0.3),
        paddingLeft: Math.round(block.depth * fontSize * 1.3),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          width: Math.round(fontSize * (block.ordered ? 1.75 : 0.95)),
          fontWeight: block.ordered ? 700 : 400,
          color: block.ordered ? COLORS.accent : COLORS.muted,
        }}
      >
        {block.marker}
      </div>
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>{block.text}</div>
    </div>
  );
}

function textStyle(fontSize: number) {
  return { fontFamily: 'Inter', fontSize, lineHeight: LINE_HEIGHT, color: COLORS.ink };
}

async function measureHeaderHeight(recipe: Recipe, fontSize: number, compact: boolean): Promise<number> {
  const svg = await satori(
    <div style={{ display: 'flex', ...textStyle(fontSize) }}>{renderHeader(recipe, fontSize, compact)}</div>,
    { width: INNER_WIDTH, fonts: getFonts() }
  );
  return Number(svg.match(/height="([\d.]+)"/)![1]);
}

interface ColumnMeasurement {
  label: number;
  blocks: number[];
}

// Renders a section as one unconstrained column to get each block's height at this width
async function measureSection(section: CardSection, width: number, fontSize: number): Promise<ColumnMeasurement> {
  const heights = new Map<string, number>();
  await satori(
    <div style={{ display: 'flex', flexDirection: 'column', width, ...textStyle(fontSize) }}>
      {renderLabel(section, fontSize, true, 'label')}
      {section.blocks.map((block, i) => renderBlock(block, fontSize, false, `block-${i}`))}
    </div>,
    {
      width,
      fonts: getFonts(),
      onNodeDetected: (node) => {
        if (typeof node.key === 'string') heights.set(node.key, node.height);
      },
    }
  );
  return {
    label: heights.get('label')!,
    blocks: section.blocks.map((_, i) => heights.get(`block-${i}`)!),
  };
}

// Splits blocks into `count` columns no taller than `available`, balancing their heights
// and never leaving a heading at the bottom of a column. Returns null if it can't fit.
function flowIntoColumns(
  blocks: Block[],
  measurement: ColumnMeasurement,
  count: 1 | 2,
  available: number,
  fontSize: number
): Block[][] | null {
  const columnHeight = (start: number, end: number) => {
    if (start === end) return measurement.label;
    let height = measurement.label;
    for (let i = start; i < end; i++) height += measurement.blocks[i];
    if (blocks[start].kind === 'heading') height -= headingTopGap(fontSize);
    return height;
  };

  if (count === 1) {
    return columnHeight(0, blocks.length) <= available ? [blocks] : null;
  }

  let best: { split: number; tallest: number } | null = null;
  for (let split = 1; split <= blocks.length; split++) {
    if (split < blocks.length && blocks[split - 1].kind === 'heading') continue;
    const tallest = Math.max(columnHeight(0, split), columnHeight(split, blocks.length));
    if (tallest <= available && (!best || tallest < best.tallest)) {
      best = { split, tallest };
    }
  }
  return best ? [blocks.slice(0, best.split), blocks.slice(best.split)] : null;
}

async function computeLayout(recipe: Recipe): Promise<CardLayout | null> {
  const content = getRecipeContent(recipe);
  if (!content.card) return null;

  const sections: CardSection[] = (['ingredients', 'instructions'] as const)
    .map((name) => {
      const tree = content.card?.[name] ?? content.sections[name];
      return tree ? { name, blocks: toBlocks(tree) } : null;
    })
    .filter((s): s is CardSection => s !== null && s.blocks.length > 0);

  const measurements = new Map<string, ColumnMeasurement>();
  const measure = async (section: CardSection, width: number, fontSize: number) => {
    const key = `${section.name}:${width}:${fontSize}`;
    if (!measurements.has(key)) measurements.set(key, await measureSection(section, width, fontSize));
    return measurements.get(key)!;
  };

  // Tries to place each [section, columnCount, columnWidth] side by side on one face
  const tryFace = async (
    name: FaceName,
    compactHeader: boolean,
    fontSize: number,
    placements: Array<[CardSection, 1 | 2, number]>
  ): Promise<CardFace | null> => {
    const headerHeight = await measureHeaderHeight(recipe, fontSize, compactHeader);
    const available = CARD_HEIGHT - 2 * PADDING - headerHeight - FOOTER_HEIGHT - FOOTER_GAP;
    const regions: Region[] = [];
    for (const [section, count, columnWidth] of placements) {
      const columns = flowIntoColumns(section.blocks, await measure(section, columnWidth, fontSize), count, available, fontSize);
      if (!columns) return null;
      regions.push({ section, columnWidth, columns });
    }
    return { name, compactHeader, regions };
  };

  const half = Math.floor((INNER_WIDTH - GUTTER) / 2);
  const third = Math.floor((INNER_WIDTH - 2 * GUTTER) / 3);
  const [first, second] = sections;

  for (const fontSize of SINGLE_SIDED_SIZES) {
    const candidates: Array<Array<[CardSection, 1 | 2, number]>> = second
      ? [
          // Narrow ingredients beside wide instructions, then one ingredients column beside two instruction columns
          [[first, 1, Math.floor((INNER_WIDTH - GUTTER) * 0.37)], [second, 1, Math.ceil((INNER_WIDTH - GUTTER) * 0.63)]],
          [[first, 1, third], [second, 2, third]],
        ]
      : [[[first, 2, half]]];
    for (const placements of candidates) {
      const face = await tryFace('card', false, fontSize, placements);
      if (face) return { fontSize, faces: [face] };
    }
  }

  if (second) {
    for (const fontSize of DOUBLE_SIDED_SIZES) {
      const front = await tryFace('front', false, fontSize, [[first, 2, half]]);
      const back = front && await tryFace('back', true, fontSize, [[second, 2, half]]);
      if (front && back) return { fontSize, faces: [front, back] };
    }
  }

  throw new Error(
    `${path.relative(process.cwd(), recipe.filePath)}: the recipe card doesn't fit on a 5×7 card, even front and back ` +
    `at the smallest text size. Write a shorter version for the card with ::::card.`
  );
}

const layoutCache = new Map<string, Promise<CardLayout | null>>();

function getLayout(recipe: Recipe): Promise<CardLayout | null> {
  if (!layoutCache.has(recipe.filePath)) layoutCache.set(recipe.filePath, computeLayout(recipe));
  return layoutCache.get(recipe.filePath)!;
}

const FACE_LABELS: Record<FaceName, string> = { card: 'Card', front: 'Front', back: 'Back' };

// The card's image files, or null if the recipe doesn't opt in with ::card
export async function getRecipeCardImages(recipe: Recipe): Promise<RecipeCardImage[] | null> {
  const layout = await getLayout(recipe);
  if (!layout) return null;
  return layout.faces.map((face) => ({
    label: FACE_LABELS[face.name],
    fileName: `${face.name}.png`,
    url: recipeCardImageUrl(recipe, `${face.name}.png`),
    downloadName: `${recipe.slug}-recipe-card${face.name === 'card' ? '' : `-${face.name}`}.png`,
  }));
}

function renderFace(recipe: Recipe, layout: CardLayout, face: CardFace): ReactElement {
  const { fontSize } = layout;
  const pageUrl = `${SITE_URL}/recipes/${recipe.category}/${recipe.slug}`.replace(/^https?:\/\//, '');
  let columnIndex = 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: PADDING,
        backgroundColor: COLORS.background,
        ...textStyle(fontSize),
      }}
    >
      {renderHeader(recipe, fontSize, face.compactHeader)}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {face.regions.flatMap((region) =>
          region.columns.map((blocks, i) => (
            <div
              key={`column-${columnIndex}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: region.columnWidth,
                marginLeft: columnIndex++ === 0 ? 0 : GUTTER,
              }}
            >
              {renderLabel(region.section, fontSize, i === 0)}
              {blocks.map((block, j) => renderBlock(block, fontSize, j === 0, `block-${j}`))}
            </div>
          ))
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'auto',
          height: FOOTER_HEIGHT,
          fontSize: FOOTER_FONT_SIZE,
          lineHeight: 1.3,
          color: COLORS.muted,
        }}
      >
        <div style={{ display: 'flex' }}>{pageUrl}</div>
        <div style={{ display: 'flex' }}>{SITE_NAME}</div>
      </div>
    </div>
  );
}

export async function renderRecipeCardImage(recipe: Recipe, fileName: string): Promise<Buffer | undefined> {
  const layout = await getLayout(recipe);
  const face = layout?.faces.find((f) => `${f.name}.png` === fileName);
  if (!layout || !face) return undefined;

  const svg = await satori(renderFace(recipe, layout, face), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: getFonts(),
  });
  return sharp(Buffer.from(svg)).png().withMetadata({ density: CARD_DPI }).toBuffer();
}
