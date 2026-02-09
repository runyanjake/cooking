export interface RecipeSection {
  title: string;
  content: string;
}

export function parseRecipeSections(markdownContent: string): RecipeSection[] {
  const lines = markdownContent.split('\n');
  const sections: RecipeSection[] = [];
  let currentSection: RecipeSection | null = null;
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (inFrontmatter) {
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: '',
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.map(section => ({
    ...section,
    content: section.content.trim(),
  }));
}
