import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import type { Image, Paragraph, Parent, Root, RootContent } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { ElementContent } from 'hast';
import { toString } from 'mdast-util-to-string';

// The one reserved tab name: its body says what the printable card shows
const CARD_NAME = 'card';
const MAX_CARD_SECTIONS = 2;

export interface MarkdownTab {
  type: 'markdown';
  name: string;
  title: string;
  content: Root;
}

export interface CardTab {
  type: 'card';
  name: string;
  title: string;
  sections: MarkdownTab[];
}

export type RecipeTabContent = MarkdownTab | CardTab;

export interface RecipeContent {
  intro: Root;
  // In the order they appear in the file
  tabs: RecipeTabContent[];
  outro: Root;
}

export class RecipeFormatError extends Error {
  constructor(filePath: string, node: { position?: { start: { line: number } } } | undefined, message: string) {
    super(`${filePath}:${node?.position?.start.line ?? '?'}: ${message}`);
    this.name = 'RecipeFormatError';
  }
}

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);

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

// `wine-pairing` reads as "Wine Pairing"
function titleFromName(name: string): string {
  return name.split(/[-_]/).filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

// `:::name[Title]` sets the title, which remark-directive stores as a leading labelled paragraph
function toMarkdownTab(node: ContainerDirective): MarkdownTab {
  const [first, ...rest] = node.children;
  const label = first?.type === 'paragraph' && first.data?.directiveLabel ? first : undefined;
  return {
    type: 'markdown',
    name: node.name,
    title: label ? toString(label) : titleFromName(node.name),
    content: root((label ? rest : node.children) as RootContent[]),
  };
}

// Each child of :::card is either `::tab`, reusing a tab, or `:::name … :::`, written just for the card
function parseCard(node: ContainerDirective, tabs: MarkdownTab[], filePath: string): CardTab {
  const { title, content } = toMarkdownTab(node);
  const sections: MarkdownTab[] = [];
  for (const child of content.children) {
    let section: MarkdownTab | undefined;
    if (child.type === 'containerDirective') {
      section = toMarkdownTab(child);
    } else if (child.type === 'leafDirective') {
      section = tabs.find((tab) => tab.name === child.name);
      if (!section) {
        throw new RecipeFormatError(filePath, child, `:::card lists ::${child.name}, but this recipe has no :::${child.name} tab`);
      }
    } else {
      throw new RecipeFormatError(
        filePath,
        child,
        'A :::card may only contain ::tab references and :::name blocks (around :::name blocks, its fence needs four colons)'
      );
    }
    if (sections.some((s) => s.name === section.name)) {
      throw new RecipeFormatError(filePath, child, `:::card lists ${section.name} more than once`);
    }
    sections.push(section);
  }
  if (sections.length === 0 || sections.length > MAX_CARD_SECTIONS) {
    throw new RecipeFormatError(filePath, node, 'A :::card must list one or two sections, e.g. ::ingredients and ::instructions');
  }
  return { type: 'card', name: node.name, title, sections };
}

export function parseRecipeContent(source: string, filePath: string): RecipeContent {
  const tree = processor.runSync(processor.parse(source)) as Root;
  restoreTextDirectives(tree, source);
  imageParagraphsToFigures(tree);

  const intro: RootContent[] = [];
  const tabNodes: ContainerDirective[] = [];
  let trailing: RootContent[] = [];

  for (const node of tree.children) {
    if (node.type === 'containerDirective') {
      if (trailing.length > 0) {
        throw new RecipeFormatError(filePath, trailing[0], 'Content between tabs must go inside a tab');
      }
      if (tabNodes.some((tab) => tab.name === node.name)) {
        throw new RecipeFormatError(filePath, node, `Duplicate :::${node.name} tab`);
      }
      tabNodes.push(node);
    } else if (node.type === 'leafDirective') {
      throw new RecipeFormatError(filePath, node, `Tabs need the container form: :::${node.name} … :::`);
    } else if (tabNodes.length > 0) {
      trailing.push(node);
    } else {
      intro.push(node);
    }
  }

  // A card can list tabs from anywhere in the file, so it's resolved once they're all known
  const markdownTabs = tabNodes.filter((node) => node.name !== CARD_NAME).map(toMarkdownTab);
  const tabs = tabNodes.map((node): RecipeTabContent =>
    node.name === CARD_NAME
      ? parseCard(node, markdownTabs, filePath)
      : markdownTabs.find((tab) => tab.name === node.name)!
  );

  return { intro: root(intro), tabs, outro: root(trailing) };
}
