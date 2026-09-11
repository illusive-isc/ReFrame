// 「取り込むだけで入る」unitypackage (VPMPackageAutoInstaller) を作る。
//   node scripts/build-installers.mjs
// static/install/ReFrame_<アバター名>_<最新版>.unitypackage として書き出し、
// ページが参照する対応表を static/install/installers.json に置く。
//
// 生成そのものは anatawa12 氏の VPMPackageAutoInstaller の creator.mjs (MIT) に任せる。
// Release に置かれている版は wasm を内蔵しているので、Node だけで動く (Unity は要らない)。
//
// 最新版は直前に build-listing.mjs が作った static/vpm/index.json から取る。
// 下限をその版にするので、リリースのたびに (= build のたびに) 作り直す。

import { mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
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
const listingPath = resolve(root, 'static/vpm/index.json');

// 依存の取得元も一緒に登録する。VPMPackageAutoInstaller は「公式 (official) と
// curated 以外は自分で並べること」という決まりで、NDMF / Modular Avatar /
// Avatar Optimizer / lilToon は**どちらにも入っていない** (curated は AudioLink や
// Gesture Manager など 8 個だけ)。並べておかないと、それらが未導入のプロジェクトで
// 「パッケージが見つからない」で失敗する。
const dependencyListings = [
	'https://vpm.nadena.dev/vpm.json', // nadena.dev.ndmf / nadena.dev.modular-avatar
	'https://vpm.anatawa12.com/vpm.json', // com.anatawa12.avatar-optimizer
	'https://lilxyzw.github.io/vpm-repos/vpm.json' // jp.lilxyzw.liltoon
];

// 配るのはアバター用だけ。Core は依存として一緒に入るが、アバター用の依存の下限が
// 古いままだと入れ替わらないので、Core も最新版を下限にして並べる。
const coreId = 'jp.illusive-isc.reframe-core';
const targets = [
	{ id: 'jp.illusive-isc.reframe-kaguya', avatar: 'kaguya', label: 'ReFrame for kaguya' },
	{ id: 'jp.illusive-isc.reframe-rurune', avatar: 'rurune', label: 'ReFrame for rurune' }
];

const compare = (a, b) => {
	const x = a.split('.').map(Number);
	const y = b.split('.').map(Number);
	for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
	return 0;
};
const listing = JSON.parse(await readFile(listingPath, 'utf8'));
const latestOf = (id) => {
	const versions = Object.keys(listing.packages?.[id]?.versions ?? {}).filter((v) => /^\d+\.\d+\.\d+$/.test(v));
	if (versions.length === 0) throw new Error(`${id} が一覧 (${listingPath}) にありません`);
	return versions.sort(compare).at(-1);
};

await mkdir(outDir, { recursive: true });
await mkdir(workDir, { recursive: true });
for (const name of await readdir(outDir))
	if (name.endsWith('.unitypackage') || name === 'installers.json') await rm(resolve(outDir, name));

const creatorPath = resolve(workDir, 'creator.mjs');
if (!existsSync(creatorPath)) {
	const res = await fetch(CREATOR_URL);
	if (!res.ok) throw new Error(`creator.mjs を取得できません: ${res.status} ${CREATOR_URL}`);
	await writeFile(creatorPath, Buffer.from(await res.arrayBuffer()));
	console.log(`creator.mjs ${CREATOR_VERSION} を取得しました`);
}

const coreVersion = latestOf(coreId);
const installers = {};
for (const target of targets) {
	const version = latestOf(target.id);
	const file = `ReFrame_${target.avatar}_${version}.unitypackage`;
	const configPath = resolve(workDir, `${target.id}.json`);
	const outPath = resolve(outDir, file);
	installers[target.id] = { file, version, core: coreVersion };

	await writeFile(
		configPath,
		JSON.stringify(
			{
				vpmDependencies: { [target.id]: `>=${version}`, [coreId]: `>=${coreVersion}` },
				// 文字列の配列で書く (オブジェクト形式は headers を付けたいとき用)。
				vpmRepositories: [listingUrl, ...dependencyListings]
			},
			null,
			2
		) + '\n'
	);

	await run(process.execPath, [creatorPath, configPath, outPath]);

	const size = (await readFile(outPath)).byteLength;
	console.log(`${target.label} ${version} (Core ${coreVersion}): ${outPath.slice(root.length + 1)} (${Math.round(size / 1024)}KB)`);
}

await writeFile(resolve(outDir, 'installers.json'), JSON.stringify(installers, null, 2) + '\n');
await rm(workDir, { recursive: true, force: true });
console.log(`${targets.length} 個の導入用ファイルを作りました`);
