# AGENTS.md — 本仓库的常驻规则（给 Codex / 任何编码代理）

这是一个学术个人主页，部署在 GitHub Pages。读者是同行、审稿人、招聘委员会。
默认假设：**信息密度优先，装饰其次**。下面的规则对本仓库内所有改动生效。

## 技术约束
- 框架 Astro + TypeScript。不引入 CSS 框架（禁止 Bootstrap / Tailwind / DaisyUI）。
- 样式只写原生 CSS，颜色/字号/间距一律引用 `src/styles/tokens.css` 的变量；
  禁止在组件里出现写死的 hex、rgb() 或 px 字号。
- 客户端 JS 预算：全站首页 ≤ 50 KB（gzip 后）。任何需要新增运行时依赖的方案，
  先在 PR 说明里写清为什么不能用原生实现（`<dialog>`、`details`、CSS 等）。
- 不引入分析脚本、cookie 横幅、聊天气泡、字体 CDN 以外的第三方请求。
  自托管字体子集（woff2），最多 2 个字族 × 2 个字重。

## 内容与代码分离
- 出版物、项目、图集、演讲全部放在 `src/content/**` 的 YAML/MD 里，
  由 Astro content collections + zod schema 校验；**禁止把条目写进 .astro 模板**。
- 新增一篇论文只应改动一个 YAML 文件，不应改动任何组件。

## 可访问性与性能（硬性门槛，CI 检查）
- Lighthouse（移动端）性能 ≥ 95、可访问性 = 100、最佳实践 ≥ 95、SEO = 100。
- 所有图片必须有显式 `width`/`height`（防 CLS）和有意义的 `alt`；
  科研图的 alt 要写清“图里是什么”（例：“胰腺癌组织三维重建，血管为青色、巨噬细胞为品红”），
  不许写 “figure 1” 或留空。装饰性图用 `alt=""` 并加 `role="presentation"`。
- 键盘可完整操作；`:focus-visible` 必须可见；尊重 `prefers-reduced-motion`。
- 正文与背景对比度 ≥ 4.5:1，次级文字 ≥ 4.5:1（不要用 --ink-3 放正文）。

## 学术元数据（容易被漏掉，必须做）
- 每个出版物详情页输出 Google Scholar 的 `citation_*` meta：
  `citation_title`、`citation_author`（每位作者一条）、`citation_publication_date`、
  `citation_journal_title`、`citation_volume`、`citation_firstpage`、`citation_doi`、`citation_pdf_url`。
- 首页输出 JSON-LD `Person`（含 `sameAs`: ORCID / Google Scholar / GitHub），
  出版物页输出 `ScholarlyArticle`。
- 生成 `sitemap.xml`；notes/blog 生成 RSS。

## 数据与大文件（GitHub Pages 限制，别踩）
- 仓库 ≤ 1 GB，单文件 ≤ 100 MB，带宽软上限 100 GB/月。
- 三维体数据、OME-Zarr、原始 TIFF **一律不入库**。主页只放：
  (a) 预渲染的短 MP4/WebM 循环（≤ 3 MB，`muted autoplay loop playsinline preload="metadata"`），
  (b) 静态 AVIF/WebP 衍生图，
  (c) 指向外部托管（R2/S3/Zenodo）或 Neuroglancer 分享链接的按钮。
- 图片衍生物由 `scripts/images.mjs`（sharp）生成：AVIF + WebP + 原格式兜底，
  按 480/960/1440/1920 出 srcset，源图放 `assets/_source/`（git-lfs 或不入库）。

## 写作与语气
- 不使用营销腔。禁止出现 “passionate about”、“cutting-edge”、“revolutionary”、
  “世界领先”、“颠覆”。描述工作只写做了什么、用了什么数据、结论边界在哪。
- 中英双语：英文为默认语言（`/`），中文在 `/zh`。同一条内容的两种语言放同一 YAML 的
  `en` / `zh` 字段，不要维护两套文件。中文不用斜体表示强调。

## 提交
- 一次提交只做一件事；涉及视觉改动的提交，在说明里附改动前后的 Lighthouse 分数。
