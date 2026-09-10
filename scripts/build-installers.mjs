// 「取り込むだけで入る」unitypackage (VPMPackageAutoInstaller) を作る。
//   node scripts/build-installers.mjs
// static/install/<パッケージ名>-installer.unitypackage として書き出す。
//
// 生成そのものは anatawa12 氏の VPMPackageAutoInstaller の creator.mjs (MIT) に任せる。
// Release に置かれている版は wasm を内蔵しているので、Node だけで動く (Unity は要らない)。
//
// バージョンは範囲で指定するため、パッケージを出すたびに作り直す必要は無い。
// 作り直しが要るのは、下限を上げたいときや配る対象を変えるときだけ。

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'static/install');
const workDir = resolve(root, '.installer-work');

// 使う creator.mjs の版。上げるときはここだけ変える。
const CREATOR_VERSION = 'v1.1.5';
const CREATOR_URL = `https://github.com/anatawa12/VPMPackageAutoInstaller/releases/download/${CREATOR_VERSION}/creator.mjs`;

const listingUrl = 'https://reframe.illusive-isc.jp/vpm/index.json';

// 配るのはアバター用だけ。Core は依存として一緒に入る。
// Core だけを直したときは、アバター用の依存の下限も上げて同時に出すこと。
const targets = [
	{ id: 'jp.illusive-isc.reframe-kaguya', range: '>=0.0.3', label: 'ReFrame for kaguya' },
	{ id: 'jp.illusive-isc.reframe-rurune', range: '>=0.0.3', label: 'ReFrame for rurune' }
];

await mkdir(outDir, { recursive: true });
await mkdir(workDir, { recursive: true });

const creatorPath = resolve(workDir, 'creator.mjs');
if (!existsSync(creatorPath)) {
	const res = await fetch(CREATOR_URL);
	if (!res.ok) throw new Error(`creator.mjs を取得できません: ${res.status} ${CREATOR_URL}`);
	await writeFile(creatorPath, Buffer.from(await res.arrayBuffer()));
	console.log(`creator.mjs ${CREATOR_VERSION} を取得しました`);
}

for (const target of targets) {
	const configPath = resolve(workDir, `${target.id}.json`);
	const outPath = resolve(outDir, `${target.id}-installer.unitypackage`);

	await writeFile(
		configPath,
		JSON.stringify(
			{
				vpmDependencies: { [target.id]: target.range },
				vpmRepositories: [{ url: listingUrl }]
			},
			null,
			2
		) + '\n'
	);

	await run(process.execPath, [creatorPath, configPath, outPath]);

	const size = (await readFile(outPath)).byteLength;
	console.log(`${target.label}: ${outPath.slice(root.length + 1)} (${Math.round(size / 1024)}KB)`);
}

await rm(workDir, { recursive: true, force: true });
console.log(`${targets.length} 個の導入用ファイルを作りました`);
