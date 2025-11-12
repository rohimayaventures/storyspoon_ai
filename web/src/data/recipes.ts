// src/data/recipes.ts
import matter from 'gray-matter';
import { marked } from 'marked';

export type Recipe = {
  id: string;
  title: string;
  author?: string;
  cuisine?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  tags?: string[];
  cover?: string;
  story?: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
  html?: string;
};

const files = import.meta.glob('/content/**/*.md', { as: 'raw', eager: true }) as Record<string,string>;

function extractList(section: string): string[] {
  return section.split('\n')
    .map(s => s.trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
    .filter(Boolean);
}

export const RECIPES: Recipe[] = Object.entries(files).map(([path, raw]) => {
  const { data, content } = matter(raw);
  const parts = content.split(/\n##\s+/g);
  let ingredientsSec = '', stepsSec = '', notesSec = '';

  for (const p of parts) {
    if (p.toLowerCase().startsWith('ingredients')) {
      ingredientsSec = p.split('\n').slice(1).join('\n');
    } else if (p.toLowerCase().startsWith('steps')) {
      stepsSec = p.split('\n').slice(1).join('\n');
    } else if (p.toLowerCase().startsWith('notes')) {
      notesSec = p.split('\n').slice(1).join('\n');
    }
  }

  const ingredients = extractList(ingredientsSec);
  const steps = extractList(stepsSec);
  const notes = notesSec.trim();
  const html = marked.parse(content);

  return {
    id: String((data as any).id ?? cryptoRandom(path)),
    title: String((data as any).title ?? 'Untitled Recipe'),
    author: (data as any).author,
    cuisine: (data as any).cuisine,
    difficulty: (data as any).difficulty,
    prepTime: numOrUndef((data as any).prepTime),
    cookTime: numOrUndef((data as any).cookTime),
    tags: Array.isArray((data as any).tags) ? (data as any).tags.map(String) : undefined,
    cover: (data as any).cover,
    story: (data as any).story,
    ingredients,
    steps,
    notes,
    html
  };
}).sort((a,b)=> a.title.localeCompare(b.title));

function cryptoRandom(s: string): string {
  let h=0; for (let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i)|0;
  return 'r'+Math.abs(h);
}
function numOrUndef(v:any){ const n=Number(v); return Number.isFinite(n) ? n : undefined; }
