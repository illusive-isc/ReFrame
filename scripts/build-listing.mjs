// GitHub の Release から VPM の一覧 (static/vpm/index.json) を作る。
//   node scripts/build-listing.mjs
// 各リポジトリの Release に添付された package.json と <zip>.sha256 を読み、
// zip の URL と SHA256 を持つ一覧にする (VRChat の package-list-action と同じ形式)。
// GITHUB_TOKEN があれば API の回数制限が緩くなる。
// API が使えないとき (レート制限など) は、いまある一覧を残したまま正常終了する。

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = resolve(root, 'static/vpm/index.json');

// site.ts と同じ内容 (Node から TS を読まずに済むようにここにも持つ)
const listing = {
	name: 'illusive_isc ReFrame',
	id: 'jp.illusive-isc.reframe',
	url: 'https://reframe.illusive-isc.jp/vpm/index.json',
	author: 'illusive_isc',
	repos: ['illusive-isc/ReFrameCore', 'illusive-isc/ReFrameForKaguya', 'illusive-isc/ReFrameForRurune']
};

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'reframe-site-listing' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function json(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	return res.json();
}

async function text(url) {
	const res = await fetch(url, { headers: { 'User-Agent': headers['User-Agent'] } });
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	return res.text();
}

async function collect() {
	const packages = {};
	for (const repo of listing.repos) {
		const releases = await json(`https://api.github.com/repos/${repo}/releases?per_page=100`);
		for (const rel of releases) {
			if (rel.draft) continue;
			const zip = rel.assets.find((a) => a.name.endsWith('.zip'));
			const manifestAsset = rel.assets.find((a) => a.name === 'package.json');
			if (!zip || !manifestAsset) {
				console.warn(`${repo} ${rel.tag_name}: zip か package.json が無いので見送り`);
				continue;
			}
			const manifest = JSON.parse(await text(manifestAsset.browser_download_url));
			const shaAsset = rel.assets.find((a) => a.name === `${zip.name}.sha256`);
			const zipSHA256 = shaAsset ? (await text(shaAsset.browser_download_url)).trim() : undefined;
			const entry = { ...manifest, url: zip.browser_download_url, ...(zipSHA256 ? { zipSHA256 } : {}) };
			(packages[manifest.name] ??= { versions: {} }).versions[manifest.version] = entry;
			console.log(`${manifest.name} ${manifest.version}${zipSHA256 ? '' : ' (SHA256 なし)'}`);
		}
	}
	return packages;
}

// 作り直せないときは、いまある一覧をそのまま使う (無ければ失敗)
function keepExisting(reason) {
	if (existsSync(outPath)) {
		console.warn(`一覧を作り直せませんでした (${reason})。いまある ${outPath} をそのまま使います。`);
		return;
	}
	console.error(`一覧を作れませんでした: ${reason}`);
	process.exitCode = 1;
}

async function main() {
	let packages;
	try {
		packages = await collect();
	} catch (e) {
		return keepExisting(e.message);
	}
	if (Object.keys(packages).length === 0) return keepExisting('公開されている版が見つかりませんでした');

	const out = { name: listing.name, id: listing.id, url: listing.url, author: listing.author, packages };
	await mkdir(dirname(outPath), { recursive: true });
	await writeFile(outPath, JSON.stringify(out, null, 2) + '\n');
	console.log(`wrote ${outPath}: ${Object.keys(packages).length} packages`);
}

await main();
