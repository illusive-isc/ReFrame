// 組み立てたばかりの VPM 一覧 (static/vpm/index.json) と、いま公開中の一覧を見比べる。
//   node scripts/listing-changed.mjs
// 変化があれば changed=true を GITHUB_OUTPUT に書く。定期実行で無駄に公開し直さないための判定。
// 公開中のものが取れないとき (初回・障害) は、安全側に倒して変化ありとして扱う。

import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localPath = resolve(root, 'static/vpm/index.json');

/** 鍵の並び順の違いを無視して比べられるように、入れ子ごと並べ直す。 */
function canonical(value) {
	if (Array.isArray(value)) return value.map(canonical);
	if (value && typeof value === 'object') {
		const out = {};
		for (const key of Object.keys(value).sort()) out[key] = canonical(value[key]);
		return out;
	}
	return value;
}

const local = JSON.parse(readFileSync(localPath, 'utf8'));

let live = null;
try {
	const res = await fetch(local.url, { headers: { 'User-Agent': 'reframe-site-listing-check' } });
	if (res.ok) live = await res.json();
	else console.log(`公開中の一覧が取れませんでした (${res.status})`);
} catch (error) {
	console.log(`公開中の一覧が取れませんでした (${error.message})`);
}

const changed = live === null || JSON.stringify(canonical(live)) !== JSON.stringify(canonical(local));
console.log(changed ? '一覧が変わったので公開し直します' : '一覧に変化なし');

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
