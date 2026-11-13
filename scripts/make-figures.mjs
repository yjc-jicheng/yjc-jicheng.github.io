#!/usr/bin/env node
/**
 * 程序化生成抽象科研示意图（SVG）。
 * - 确定性：固定随机种子，每次构建输出一致，git diff 干净。
 * - 颜色策略：浅色值写成 SVG 呈现属性（任何渲染器都认），深色值用内嵌
 *   @media (prefers-color-scheme: dark) 覆盖（CSS 优先级高于呈现属性）。
 * - 不包含任何真实数据，可安全公开。
 * 用法：npm run figures
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'img', 'generated');
mkdirSync(OUT, { recursive: true });

/* ---------- 确定性随机 (mulberry32) ---------- */
const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const r1 = (x) => Math.round(x * 10) / 10;

/* ---------- 调色板（与 src/styles/tokens.css 对应的近似值） ---------- */
const LIGHT = { ink: '#2a2e3a', ink2: '#5d6475', acc: '#1f6bb3', warm: '#b96832', rule: '#d9dade', paper: '#fbfbf9' };
const DARK = { ink: '#e7e5e0', ink2: '#9aa2b4', acc: '#8fc2f2', warm: '#e0a575', rule: '#3a3f4b', paper: '#16181d' };

const STYLE = `
  <style>
    text { font-family: ui-sans-serif, system-ui, sans-serif; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: ${DARK.paper}; }
      .s-ink { stroke: ${DARK.ink}; }  .s-ink2 { stroke: ${DARK.ink2}; }
      .s-acc { stroke: ${DARK.acc}; }  .s-warm { stroke: ${DARK.warm}; }
      .s-rule { stroke: ${DARK.rule}; }
      .f-ink { fill: ${DARK.ink}; }    .f-ink2 { fill: ${DARK.ink2}; }
      .f-acc { fill: ${DARK.acc}; }    .f-warm { fill: ${DARK.warm}; }
      text { fill: ${DARK.ink2}; }
    }
  </style>`;

const S = (tone, width = 1) =>
  `class="s-${tone}" stroke="${LIGHT[tone]}" stroke-width="${width}" fill="none"`;
const F = (tone) => `class="f-${tone}" fill="${LIGHT[tone]}" stroke="none"`;

const svg = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${STYLE}
  <rect class="bg" fill="${LIGHT.paper}" width="${w}" height="${h}"/>
${inner}
</svg>
`;

const label = (x, y, size, text, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${LIGHT.ink2}" ${extra}>${text}</text>`;

const axis = (x1, y1, x2, y2) =>
  `<path ${S('ink', 1.2)} d="M${x1},${y1} L${x2},${y2}"/>`;

/* ============ 1. peptide mass spectrum ============ */
function spectrum() {
  const w = 1200, h = 800, rand = rng(8123);
  let s = axis(150, 660, 1080, 660) + axis(150, 660, 150, 130);
  for (let i = 0; i < 42; i++) {
    const x = 190 + i * 21 + (rand() - 0.5) * 6;
    const inten = 20 + Math.pow(rand(), 2.2) * 430;
    const tone = inten > 300 ? 'acc' : 'ink2';
    s += `<path ${S(tone, inten > 300 ? 2.4 : 1.2)} d="M${r1(x)},660 L${r1(x)},${r1(660 - inten)}"/>`;
  }
  s += label(1080, 700, 34, 'm/z', 'text-anchor="end"');
  s += label(118, 400, 32, 'intensity', 'text-anchor="middle" transform="rotate(-90 118 400)"');
  s += label(150, 112, 24, 'peptide spectrum (schematic)');
  return svg(w, h, s);
}

/* ============ 2. proteomics workflow ============ */
function workflow() {
  const w = 1200, h = 800;
  const boxes = [
    ['Samples', 120], ['LC-MS/MS', 330], ['Proteomics', 540],
    ['ML / stats', 750], ['PRM', 960],
  ];
  let s = '';
  boxes.forEach(([txt, x], i) => {
    s += `<rect ${S(i === 3 ? 'acc' : 'rule', 1.4)} x="${x}" y="330" width="150" height="130" rx="10"/>`;
    s += label(x + 75, 400, 24, txt, 'text-anchor="middle"');
    if (i < boxes.length - 1) {
      s += `<path ${S('ink2', 1.3)} d="M${x + 158},395 L${x + 198},395"/>`;
      s += `<path ${S('ink2', 1.3)} d="M${x + 190},389 L${x + 199},395 L${x + 190},401"/>`;
    }
  });
  s += label(600, 540, 24, 'discovery → validation', 'text-anchor="middle"');
  s += label(600, 280, 26, 'proteomics workflow (schematic)', 'text-anchor="middle"');
  return svg(w, h, s);
}

/* ============ 3. volcano plot ============ */
function volcano() {
  const w = 1200, h = 800, rand = rng(3301);
  let s = axis(170, 650, 1060, 650) + axis(170, 650, 170, 130);
  s += `<path ${S('rule', 1)} stroke-dasharray="5 6" d="M170,330 L1060,330"/>`;
  s += `<path ${S('rule', 1)} stroke-dasharray="5 6" d="M430,130 L430,650"/>`;
  s += `<path ${S('rule', 1)} stroke-dasharray="5 6" d="M800,130 L800,650"/>`;
  for (let i = 0; i < 220; i++) {
    const x = 170 + rand() * 890;
    const y = 650 - Math.pow(rand(), 1.7) * 500;
    const inWing = x < 430 || x > 800;
    if (!inWing && rand() < 0.75) continue;
    const tone = inWing ? (rand() < 0.5 ? 'acc' : 'warm') : 'ink2';
    s += `<circle ${F(tone)} cx="${r1(x)}" cy="${r1(y)}" r="${r1(1.8 + rand() * 2.2)}" opacity="0.65"/>`;
  }
  s += label(1060, 692, 30, 'log2 fold change', 'text-anchor="end"');
  s += label(138, 390, 30, '-log10 p', 'text-anchor="middle" transform="rotate(-90 138 390)"');
  s += label(300, 170, 28, 'down', 'text-anchor="middle"');
  s += label(930, 170, 28, 'up', 'text-anchor="middle"');
  return svg(w, h, s);
}

/* ============ 4. spatial omics map ============ */
function spatial() {
  const w = 1200, h = 800, rand = rng(5521);
  let s = '';
  // irregular tissue outline
  const pts = [];
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const rr = 300 + (rand() - 0.5) * 40;
    pts.push(`${r1(600 + rr * Math.cos(a))},${r1(400 + rr * 0.62 * Math.sin(a))}`);
  }
  s += `<path ${S('rule', 1.2)} d="M${pts.join(' L')} Z"/>`;
  // spots
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 16; c++) {
      const x = 300 + c * 38, y = 210 + r * 34;
      const dx = (x - 600) / 300, dy = (y - 400) / 190;
      if (dx * dx + dy * dy > 0.95) continue;
      const v = 0.5 + 0.45 * Math.sin(c * 0.45 + r * 0.55) + (rand() - 0.5) * 0.25;
      const tone = v > 0.62 ? 'warm' : v > 0.42 ? 'acc' : 'ink2';
      s += `<circle ${F(tone)} cx="${x}" cy="${y}" r="8" opacity="${r1(0.15 + Math.min(1, v) * 0.75)}"/>`;
    }
  }
  s += label(600, 120, 26, 'spatial map (schematic)', 'text-anchor="middle"');
  // legend
  for (let i = 0; i < 16; i++) {
    s += `<rect ${F(i > 10 ? 'warm' : i > 7 ? 'acc' : 'ink2')} x="${900 + i * 10}" y="690" width="9" height="12" opacity="${r1(0.15 + (i / 16) * 0.8)}"/>`;
  }
  s += label(900, 680, 22, 'low');
  s += label(1046, 680, 22, 'high', 'text-anchor="end"');
  return svg(w, h, s);
}

/* ============ 5. pathway / PPI network ============ */
function network() {
  const w = 1200, h = 800, rand = rng(9917);
  const nodes = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rand() * 0.3;
    const r = 80 + rand() * 260;
    nodes.push({ x: 600 + Math.cos(a) * r, y: 400 + Math.sin(a) * r * 0.72, r: 5 + rand() * 9 });
  }
  let s = '';
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 150 && rand() < 0.75) {
        s += `<path ${S(rand() < 0.18 ? 'warm' : 'rule', 1)} d="M${r1(nodes[i].x)},${r1(nodes[i].y)} L${r1(nodes[j].x)},${r1(nodes[j].y)}"/>`;
      }
    }
  }
  for (const n of nodes) {
    const tone = n.r > 10 ? 'acc' : 'ink2';
    s += `<circle ${F(tone)} cx="${r1(n.x)}" cy="${r1(n.y)}" r="${r1(n.r)}" opacity="0.8"/>`;
  }
  s += label(600, 110, 26, 'pathway network (schematic)', 'text-anchor="middle"');
  return svg(w, h, s);
}

/* ============ 6. ROC curves for the ICU project ============ */
function roc() {
  const w = 1200, h = 800;
  let s = axis(170, 650, 1050, 650) + axis(170, 650, 170, 140);
  s += `<path ${S('rule', 1)} stroke-dasharray="7 7" d="M170,650 L1050,140"/>`;
  const curves = [
    { color: 'ink2', pts: [[0, 0], [0.08, 0.45], [0.18, 0.58], [0.3, 0.7], [0.45, 0.78], [0.62, 0.86], [0.8, 0.93], [1, 1]] },
    { color: 'acc', pts: [[0, 0], [0.1, 0.5], [0.2, 0.6], [0.32, 0.7], [0.5, 0.8], [0.7, 0.88], [0.85, 0.94], [1, 1]] },
    { color: 'warm', pts: [[0, 0], [0.06, 0.38], [0.16, 0.52], [0.28, 0.62], [0.42, 0.72], [0.6, 0.82], [0.78, 0.9], [1, 1]] },
  ];
  for (const c of curves) {
    const d = c.pts.map(([x, y]) => `${r1(170 + x * 880)},${r1(650 - y * 510)}`).join(' L');
    s += `<path ${S(c.color, 2.2)} d="M${d}"/>`;
  }
  s += label(1050, 692, 30, '1 - specificity', 'text-anchor="end"');
  s += label(138, 395, 30, 'sensitivity', 'text-anchor="middle" transform="rotate(-90 138 395)"');
  s += label(1030, 610, 22, 'LR', 'text-anchor="end"');
  s += label(1030, 585, 22, 'RF', 'text-anchor="end"');
  s += label(1030, 560, 22, 'XGB', 'text-anchor="end"');
  return svg(w, h, s);
}

/* ============ 7. social preview 1200x630 ============ */
function og() {
  const rand = rng(99);
  let s = `<path ${S('rule', 1)} d="M80,470 L1120,470"/>`;
  s += `<text x="80" y="250" font-size="68" ${F('ink')} style="font-weight:500">Jicheng Yang</text>`;
  s += label(80, 315, 27, 'Proteomics · Spatial omics · Mass spectrometry');
  s += label(80, 536, 22, 'yjc-jicheng.github.io');
  for (let i = 0; i < 34; i++) {
    const x = 700 + i * 11.5, inten = 20 + Math.pow(rand(), 2.2) * 300;
    s += `<path ${S(inten > 220 ? 'warm' : 'ink2', inten > 220 ? 2.2 : 1.1)} d="M${r1(x)},470 L${r1(x)},${r1(470 - inten)}"/>`;
  }
  return svg(1200, 630, s);
}

const files = { spectrum, workflow, volcano, spatial, network, roc, og };
let total = 0;
for (const [name, fn] of Object.entries(files)) {
  const out = fn();
  writeFileSync(join(OUT, `${name}.svg`), out);
  total += Buffer.byteLength(out);
  console.log(`  ${name}.svg  ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB`);
}
console.log(`generated ${Object.keys(files).length} figures, ${(total / 1024).toFixed(1)} KB → public/img/generated/`);
