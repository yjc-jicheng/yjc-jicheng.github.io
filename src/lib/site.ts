import { parse } from 'yaml';

/**
 * 构建期读取 YAML 配置。
 * 用 Vite 的 ?raw + eager 在打包时内联文件内容——不能用 fs.readFileSync 配
 * import.meta.url，因为打包后模块位置变了，路径会指向 dist/ 里不存在的文件。
 */
const RAW = import.meta.glob('../data/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function readYaml<T>(relPath: string): T {
  const key = Object.keys(RAW).find((k) => k.endsWith(`/${relPath}`));
  if (!key) throw new Error(`找不到数据文件 src/data/${relPath}`);
  return parse(RAW[key]) as T;
}

export type Lang = 'en' | 'zh';
export type Bi = { en: string; zh: string };

export type Site = {
  name: Bi;
  tagline: Bi;
  affiliation: Bi;
  bio: Bi;
  email: string;
  links: Record<string, string>;
  research: { id: string; title: Bi; summary: Bi; detail: Bi; figure?: string }[];
  news: { date: string | Date; text: Bi }[];
  og_image: string;
};

export type CvEntry = { period: string; what: Bi; where: Bi; note: Bi };
export type Cv = {
  education: CvEntry[];
  positions: CvEntry[];
  awards: CvEntry[];
  talks: CvEntry[];
  service: CvEntry[];
  skills: { group: Bi; items: string[] }[];
};

export const site = readYaml<Site>('site.yaml');
export const cv = readYaml<Cv>('cv.yaml');

/** 取双语字段，缺失时回退到英文。 */
export const t = (v: Bi | undefined, lang: Lang): string => (v ? v[lang] || v.en || '' : '');

/** 语言前缀：en -> ''，zh -> '/zh' */
export const prefix = (lang: Lang): string => (lang === 'zh' ? '/zh' : '');

export const href = (lang: Lang, path: string): string => {
  const p = path === '/' ? '' : path.replace(/\/$/, '');
  return `${prefix(lang)}${p}` || '/';
};

/** 过滤掉空字符串/占位，便于模板里 "有就显示" */
export const filled = (s: string | undefined): boolean => !!s && s.trim() !== '';
