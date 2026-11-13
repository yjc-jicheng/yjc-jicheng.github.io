type Pub = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  volume?: string;
  pages?: string;
  doi?: string;
  status?: string;
};

/** 生成可直接粘进 .bib 的条目。预印本用 @misc，其余 @article。 */
export function toBibtex(p: Pub): string {
  const first = (p.authors[0] ?? 'anon').replace(/[^A-Za-z]/g, '').toLowerCase();
  const key = `${first}${p.year}${p.id.split('-')[0]}`;
  const authors = p.authors.join(' and ');
  const type = p.status === 'preprint' ? 'misc' : 'article';
  const rows: [string, string | undefined][] = [
    ['author', authors],
    ['title', `{${p.title}}`],
    [p.status === 'preprint' ? 'howpublished' : 'journal', p.venue],
    ['year', String(p.year)],
    ['volume', p.volume || undefined],
    ['pages', p.pages || undefined],
    ['doi', p.doi || undefined],
  ];
  const body = rows
    .filter(([, v]) => v && !/^TODO/.test(v))
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n');
  return `@${type}{${key},\n${body}\n}`;
}
