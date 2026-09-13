import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import type { Image, Paragraph, Parent, Root, RootContent } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { ElementContent } from 'hast';

// Section directives, in tab order
export const SECTION_NAMES = ['photos', 'ingredients', 'instructions', 'notes', 'references'] as const;
export type SectionName = (typeof SECTION_NAMES)[number];

// Sections a custom ::::card can override
const CARD_SECTION_NAMES = ['ingredients', 'instructions'] as const;
export type CardSectionName = (typeof CARD_SECTION_NAMES)[number];

export interface RecipeContent {
  intro: Root;
  sections: Partial<Record<SectionName, Root>>;
  // null unless the recipe opts in with ::card or ::::card
  card: Partial<Record<CardSectionName, Root>> | null;
  outro: Root;
}

export class RecipeFormatError extends Error {
  constructor(filePath: string, node: { position?: { start: { line: number } } } | undefined, message: string) {
    super(`${filePath}:${node?.position?.start.line ?? '?'}: ${message}`);
    this.name = 'RecipeFormatError';
  }
}

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);

function isSectionName(name: string): name is SectionName {
  return (SECTION_NAMES as readonly string[]).includes(name);
}

function isCardSectionName(name: string): name is CardSectionName {
  return (CARD_SECTION_NAMES as readonly string[]).includes(name);
}

function root(children: RootContent[]): Root {
  return { type: 'root', children };
}

// Walks every parent node depth-first, letting the callback replace children
function transformChildren(node: Parent, fn: (child: RootContent, parent: Parent) => RootContent[] | undefined) {
  node.children = node.children.flatMap((child) => {
    const replacement = fn(child as RootContent, node);
    const result = replacement ?? [child as RootContent];
    for (const r of result) {
      if ('children' in r) transformChildren(r as Parent, fn);
    }
    return result;
  }) as Parent['children'];
}

// No text directives are defined yet, so `:name` in prose (e.g. "Tip:Use") stays literal
function restoreTextDirectives(tree: Root, source: string) {
  transformChildren(tree, (child) => {
    if (child.type !== 'textDirective') return undefined;
    const start = child.position?.start.offset;
    const end = child.position?.end.offset;
    const value = start !== undefined && end !== undefined ? source.slice(start, end) : `:${child.name}`;
    return [{ type: 'text', value }];
  });
}

// A paragraph holding only images becomes one <figure> per image, captioned by the image title:
// ![Alt text](./assets/photo.jpg "Caption")
function imageParagraphsToFigures(tree: Root) {
  transformChildren(tree, (child) => {
    if (child.type !== 'paragraph') return undefined;
    const images = child.children.filter((c): c is Image => c.type === 'image');
    const onlyImages = images.length > 0 && child.children.every(
      (c) => c.type === 'image' || c.type === 'break' || (c.type === 'text' && !c.value.trim())
    );
    if (!onlyImages) return undefined;

    return images.map((image): Paragraph => {
      const hChildren: ElementContent[] = [
        { type: 'element', tagName: 'img', properties: { src: image.url, alt: image.alt ?? '' }, children: [] },
      ];
      if (image.title) {
        hChildren.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: image.title }] });
      }
      return { type: 'paragraph', children: [], data: { hName: 'figure', hChildren }, position: image.position };
    });
  });
}

function parseCardContainer(node: ContainerDirective, filePath: string): Partial<Record<CardSectionName, Root>> {
  const card: Partial<Record<CardSectionName, Root>> = {};
  for (const child of node.children) {
    if (child.type === 'containerDirective' && isCardSectionName(child.name)) {
      if (card[child.name]) {
        throw new RecipeFormatError(filePath, child, `::::card has more than one :::${child.name}`);
      }
      card[child.name] = root(child.children as RootContent[]);
    } else {
      throw new RecipeFormatError(
        filePath,
        child,
        `::::card may only contain :::ingredients and :::instructions blocks (the outer fence needs four colons)`
      );
    }
  }
  return card;
}

export function parseRecipeContent(source: string, filePath: string): RecipeContent {
  const tree = processor.runSync(processor.parse(source)) as Root;
  restoreTextDirectives(tree, source);
  imageParagraphsToFigures(tree);

  const content: RecipeContent = { intro: root([]), sections: {}, card: null, outro: root([]) };
  let cardNode: RootContent | undefined;
  let seenSection = false;
  let trailing: RootContent[] = [];

  for (const node of tree.children) {
    if (node.type === 'containerDirective' && isSectionName(node.name)) {
      if (trailing.length > 0) {
        throw new RecipeFormatError(filePath, trailing[0], 'Content between sections must go inside a section');
      }
      if (content.sections[node.name]) {
        throw new RecipeFormatError(filePath, node, `Duplicate :::${node.name} section`);
      }
      if (node.children.length > 0) {
        content.sections[node.name] = root(node.children as RootContent[]);
      }
      seenSection = true;
      trailing = [];
    } else if ((node.type === 'leafDirective' || node.type === 'containerDirective') && node.name === 'card') {
      if (content.card) {
        throw new RecipeFormatError(filePath, node, 'A recipe can only have one ::card');
      }
      content.card = node.type === 'containerDirective' ? parseCardContainer(node, filePath) : {};
      cardNode = node;
    } else if (node.type === 'leafDirective' || node.type === 'containerDirective') {
      const hint = node.type === 'leafDirective' && isSectionName(node.name)
        ? ` Sections need the container form: :::${node.name} … :::`
        : ` Known directives: ${SECTION_NAMES.map((n) => `:::${n}`).join(', ')}, ::card`;
      throw new RecipeFormatError(filePath, node, `Unknown directive "${node.name}".${hint}`);
    } else if (seenSection) {
      trailing.push(node);
    } else {
      content.intro.children.push(node);
    }
  }
  content.outro.children = trailing;

  if (content.card && !content.card.ingredients && !content.card.instructions &&
      !content.sections.ingredients && !content.sections.instructions) {
    throw new RecipeFormatError(filePath, cardNode, '::card needs an :::ingredients or :::instructions section');
  }

  return content;
}
