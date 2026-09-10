// static/icon-source.png から favicon 一式を作る。
//   node scripts/make-icons.mjs
// 元画像は正方形でなくてもよい (透明で余白を足して正方形にしてから縮小する)。

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'static/icon-source.png');

if (!existsSync(source)) {
	console.error(`元画像がありません: ${source}`);
	console.error('アイコンにしたい画像を static/icon-source.png として置いてから、もう一度実行してください。');
	process.exit(1);
}

const meta = await sharp(source).metadata();
const size = Math.max(meta.width ?? 0, meta.height ?? 0);

// 正方形に整える (足りない分は透明)
const square = await sharp(source)
	.resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.png()
	.toBuffer();

const outputs = [
	['static/favicon-16.png', 16],
	['static/favicon-32.png', 32],
	['static/favicon-48.png', 48],
	['static/apple-touch-icon.png', 180],
	['static/icon-192.png', 192],
	['static/icon-512.png', 512],
	['static/og-image.png', 512]
];

await mkdir(resolve(root, 'static'), { recursive: true });
for (const [rel, px] of outputs) {
	const out = resolve(root, rel);
	await sharp(square).resize(px, px, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(out);
	console.log(`${rel} (${px}x${px})`);
}

// favicon.ico (16 / 32 / 48 をまとめた ICO を手で組む)
const pngs = await Promise.all(
	[16, 32, 48].map((px) => sharp(square).resize(px, px, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer())
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // 1 = ICO
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = [];
for (let i = 0; i < pngs.length; i++) {
	const px = [16, 32, 48][i];
	const entry = Buffer.alloc(16);
	entry.writeUInt8(px === 256 ? 0 : px, 0);
	entry.writeUInt8(px === 256 ? 0 : px, 1);
	entry.writeUInt8(0, 2); // パレット無し
	entry.writeUInt8(0, 3);
	entry.writeUInt16LE(1, 4); // カラープレーン
	entry.writeUInt16LE(32, 6); // ビット深度
	entry.writeUInt32LE(pngs[i].length, 8);
	entry.writeUInt32LE(offset, 12);
	offset += pngs[i].length;
	entries.push(entry);
}
await writeFile(resolve(root, 'static/favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));
console.log('static/favicon.ico (16/32/48)');
