# 内容模型（Astro content collections）

`src/content/config.ts` 用 zod 定义，下面是字段与示例。原则：**一条论文只改一个 YAML**。

## publications（src/content/publications/*.yaml）
```yaml
id: series-2026                    # 唯一键，作为 URL slug
title: "SERIES: shared-field registration of serial thick sections for 3D single-cell analysis"
authors: ["Yang, J.", "…", "Senior, A."]   # 字符串数组；本人用 me: true 标记
me: "Yang, J."                     # 用于在列表里加粗本人
year: 2026
venue: "Nature Methods"            # 期刊/会议全称
venue_short: "Nat. Methods"
status: preprint | in-press | published
volume: "23"
pages: "1234-1245"
doi: "10.1038/s41592-026-xxxxx"
links:
  pdf: "/pdf/series-2026.pdf"      # 注意版权，优先放 accepted version
  code: "https://github.com/…"
  data: "https://zenodo.org/…"
  arxiv: "https://arxiv.org/abs/…"
selected: true                     # 首页只展示 selected
thumb: "pubs/series-fig1.png"      # 相对 assets/，脚本自动生成衍生图
tldr:
  en: "One shared XY field per slab plus a centre atlas; 5 µm sections reach ~2 µm P95 TRE."
  zh: "每层共享一个 XY 形变场加中心图谱；5 µm 切片的 P95 TRE 约 2 µm。"
```

## projects（src/content/projects/*.md，正文用 Markdown）
```yaml
---
id: pdac-3d-immune
title: { en: "3D single-cell morphology in pancreatic cancer", zh: "胰腺癌三维单细胞形态" }
period: "2025–"
role: "Lead"
stack: ["Python", "VTK", "u-Segment3D", "Slurm"]
hero: "projects/pdac-vessels.mp4"     # 视频或图
hero_poster: "projects/pdac-vessels.jpg"
status: ongoing | archived
---
正文：问题 → 方法 → 当前结果 → 边界。不写“前景广阔”。
```

## figures（src/content/figures/*.yaml）—— 你的强项，单独成页
```yaml
id: fig-vessel-morph
caption:
  en: "Vessel-adjacent macrophages, 3D reconstruction, 40× FV4000."
  zh: "血管旁巨噬细胞三维重建，40× FV4000。"
alt:
  en: "Magenta macrophages wrapped around a cyan vessel branch in a 50-micron tissue slab."
  zh: "50 µm 组织内，品红色巨噬细胞包绕青色血管分支。"
src: "figures/vessel-morph.png"       # 源图放 assets/_source/，不入库
credit: "Yang J., unpublished"
tags: ["3D", "PDAC", "imaging"]
width: 2400
height: 1600
```

## 其它
- `cv.yaml`：education / positions / awards / talks / teaching / service，字段都带 `en`/`zh`。
- `site.yaml`：name、affiliation、email（用 `name [at] domain` 防爬）、orcid、scholar、github、
  `og_default`（社交预览图）。
