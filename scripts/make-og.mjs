// SNS 共有用の画像 (static/og-image.png, 1200x630) を作る。
//   node scripts/make-og.mjs
// 背景はサイトの配色、右にキャラクター、左にサイト名と説明。

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'static/icon-source.png');
const W = 1200;
const H = 630;

const NAME = 'ReFrame';
const TAGLINE = ['VRChat アバターのギミックを、', '壊さずに減らす'];
const SUB = 'NDMF / Modular Avatar / Quest 対応';
const FONTS = "'Yu Gothic UI','Meiryo','Noto Sans JP','Hiragino Sans','Segoe UI',sans-serif";

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0f14"/>
      <stop offset="60%" stop-color="#131022"/>
      <stop offset="100%" stop-color="#0d1a16"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#7d4fd6" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7d4fd6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#2ee39a" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#2ee39a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="250" cy="120" r="360" fill="url(#glow1)"/>
  <circle cx="1040" cy="560" r="340" fill="url(#glow2)"/>
  <g stroke="#b48cff" stroke-opacity="0.16" stroke-width="1.5" fill="none">
    <path d="M0 470 H190 L240 420 H430"/>
    <path d="M0 530 H120 L170 580 H400"/>
    <path d="M1200 90 H1010 L960 140 H820"/>
  </g>
  <rect x="0" y="0" width="12" height="${H}" fill="#7d4fd6"/>
</svg>`);

const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .name { font-family: ${FONTS}; font-size: 96px; font-weight: 700; fill: #ffffff; }
    .re { fill: #b48cff; }
    .tagline { font-family: ${FONTS}; font-size: 34px; font-weight: 600; fill: #e8ecf0; }
    .sub { font-family: ${FONTS}; font-size: 24px; fill: #9aa4b0; }
    .badge { font-family: ${FONTS}; font-size: 23px; font-weight: 600; fill: #5ee39a; }
  </style>
  <text x="72" y="230" class="name"><tspan class="re">Re</tspan>Frame</text>
  <text x="76" y="308" class="tagline">${escape(TAGLINE[0])}</text>
  <text x="76" y="352" class="tagline">${escape(TAGLINE[1])}</text>
  <text x="76" y="410" class="sub">${escape(SUB)}</text>
  <text x="76" y="545" class="badge">refreme.illusive-isc.jp</text>
</svg>`);

const layers = [{ input: background, top: 0, left: 0 }];

if (existsSync(source)) {
	const character = await sharp(source)
		.resize({ height: 520, fit: 'inside', withoutEnlargement: false })
		.toBuffer();
	const meta = await sharp(character).metadata();
	layers.push({
		input: character,
		top: H - (meta.height ?? 0),
		left: W - (meta.width ?? 0) + 70
	});
} else {
	console.warn('static/icon-source.png が無いので、キャラクター無しで作ります。');
}

layers.push({ input: text, top: 0, left: 0 });

await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } })
	.composite(layers)
	.png({ compressionLevel: 9 })
	.toFile(resolve(root, 'static/og-image.png'));

console.log(`static/og-image.png (${W}x${H})`);
