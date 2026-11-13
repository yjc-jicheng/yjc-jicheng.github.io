import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';

const yamlArray = (text: string) => parse(text) ?? [];

const bilingual = z.object({ en: z.string().default(''), zh: z.string().default('') });

const publications = defineCollection({
  loader: file('src/content/publications.yaml', { parser: yamlArray }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    me: z.string(),
    role: bilingual.default({ en: '', zh: '' }),
    year: z.number(),
    venue: z.string(),
    venue_short: z.string().default(''),
    status: z.enum(['preprint', 'in-press', 'published']).default('published'),
    volume: z.string().default(''),
    pages: z.string().default(''),
    doi: z.string().default(''),
    selected: z.boolean().default(false),
    topics: z.array(z.string()).default([]),
    figure: z.string().optional(),
    links: z
      .object({ pdf: z.string().default(''), code: z.string().default(''), data: z.string().default('') })
      .default({ pdf: '', code: '', data: '' }),
    abstract: bilingual.default({ en: '', zh: '' }),
    tldr: bilingual.default({ en: '', zh: '' }),
  }),
});

const figures = defineCollection({
  loader: file('src/content/figures.yaml', { parser: yamlArray }),
  schema: z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
    kind: z.enum(['svg', 'raster', 'video']).default('svg'),
    caption: bilingual,
    alt: bilingual,
    credit: bilingual.default({ en: '', zh: '' }),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: bilingual,
    period: z.string(),
    role: z.string().default(''),
    stack: z.array(z.string()).default([]),
    status: z.enum(['ongoing', 'archived']).default('ongoing'),
    hero: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { publications, figures, projects };
