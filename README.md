# 学术个人主页

Astro + 原生 CSS 的静态站，部署到 GitHub Pages。设计决策已固化在
`src/styles/tokens.css` 与 `AGENTS.md`，改内容不需要碰样式。

## 五分钟上线

```bash
npm install
npm run dev        # http://localhost:4321
```

1. **填信息**：`src/data/site.yaml`（姓名、单位、邮箱、链接、研究主线、动态）
   和 `src/data/cv.yaml`。两个文件里的 `TODO(...)` 全部替换掉。
2. **填论文**：`src/content/publications.yaml`，一篇一条。
3. **改站点地址**：`astro.config.mjs` 的 `SITE` 改成 `https://<你的用户名>.github.io`，
   以及 `public/robots.txt` 里的 sitemap 地址。
4. **检查没有漏填**：
   ```bash
   grep -rn "TODO(" src/ public/ astro.config.mjs
   ```
5. **部署**：仓库名必须是 `<你的用户名>.github.io`。当前仓库的 `main` 保存源码，
   `gh-pages` 保存构建产物；修改后运行 `npm run build`，把 `dist/` 内容推到 `gh-pages`。
   GitHub Pages 的 Source 设为 `gh-pages` 分支根目录。

## 日常维护

| 要做的事 | 改哪里 |
|---|---|
| 加一篇论文 | `src/content/publications.yaml` 加一条 |
| 换首页代表作 | 把该条的 `selected` 改成 `true`/`false` |
| 加一张图 | `src/content/figures.yaml` 加一条（见下） |
| 加一个项目 | `src/content/projects/` 下新建一个 `.md` |
| 改最近动态 | `src/data/site.yaml` 的 `news`（只显示前 3 条） |

## 关于图

当前图集里的全部图形由 `scripts/make-figures.mjs` **程序化生成**（确定性随机种子，
每次构建一致），是抽象示意图，不含任何真实数据，可以安全公开。它们会跟随系统深浅色。

换成真实图片时：

1. 源图放 `assets/_source/`（**不入库**，见 `.gitignore`）；
2. 导出 web 衍生物到 `public/img/`（建议 AVIF/WebP + 原格式，宽度 480/960/1440/1920）；
3. 在 `src/content/figures.yaml` 把 `src` 改成 `img` 下的相对名，`kind` 改成 `raster`，
   并填真实 `width`/`height`。

> 三维体数据、OME-Zarr、原始 TIFF 不要进仓库：GitHub Pages 单文件上限 100 MB、
> 仓库 1 GB。三维内容请放预渲染的短视频（≤3 MB），原始数据挂外部存储并外链。

**公开前自查**：未发表的数据、合作方的数据、患者来源影像不要放上公网。

## 已经实现的、容易被忽略的部分

- 每篇论文详情页输出 Google Scholar 需要的 `citation_*` 元标签（没有它 Scholar 抓不到你的 PDF）
- 首页 JSON-LD `Person`、论文页 `ScholarlyArticle`
- 中英双语（`/` 与 `/zh`），同一份内容两种语言写在同一个 YAML 字段里
- 深浅色跟随系统 + 手动开关，首帧前设好属性，不闪白
- BibTeX 一键复制（剪贴板不可用时降级为选中文本）
- 图集灯箱用原生 `<dialog>`，Esc 关闭、焦点自动归还
- `/cv` 的打印样式：隐藏导航，链接以脚注形式展开
- 跳转到正文的 skip-link、`prefers-reduced-motion`

## 自检

```bash
npm run build
# 页面数、产物体积
du -sh dist
# 组件里不应出现写死的颜色（只有 src/styles/*.css 允许）
grep -rlE '#[0-9a-fA-F]{3,6}' src/components src/layouts src/views
```
