<script lang="ts">
	import { pages, site } from '$lib/site';
	import Seo from '$lib/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const compare = (a: string, b: string) => {
		const pa = a.split(/[-+]/)[0].split('.').map(Number);
		const pb = b.split(/[-+]/)[0].split('.').map(Number);
		for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
		return 0;
	};

	const rows = $derived(
		site.packages.map((p) => {
			const entry = data.listing?.packages?.[p.id];
			const versions = entry ? Object.keys(entry.versions).sort(compare).reverse() : [];
			const latest = versions[0] ? entry!.versions[versions[0]] : null;
			return { ...p, versions, latest };
		})
	);
</script>

<Seo title={pages[2].title} description={pages[2].description} path={pages[2].path} />

<h1>パッケージ</h1>
<p class="lead">一覧 (<code>{site.listingUrl}</code>) に載っている最新版です。</p>

{#if !data.listing}
	<div class="note">一覧がまだ生成されていません。<code>npm run listing</code> で GitHub の Release から作れます。</div>
{/if}

{#each rows as p}
	<div class="card">
		<h3>{p.name} <span class="tag">{p.latest ? p.latest.version : '未公開'}</span></h3>
		<p><code>{p.id}</code> — {p.summary}</p>
		{#if p.latest}
			<table>
				<tbody>
					<tr><th>zip</th><td><a href={p.latest.url}>{p.latest.url}</a></td></tr>
					{#if p.latest.zipSHA256}
						<tr><th>SHA256</th><td><code>{p.latest.zipSHA256}</code></td></tr>
					{/if}
					{#if p.latest.vpmDependencies}
						<tr><th>依存</th><td>{Object.entries(p.latest.vpmDependencies).map(([k, v]) => `${k} ${v}`).join(' / ')}</td></tr>
					{/if}
					{#if p.versions.length > 1}
						<tr><th>過去の版</th><td>{p.versions.slice(1).join(', ')}</td></tr>
					{/if}
				</tbody>
			</table>
		{/if}
		<p><a href="https://github.com/{p.repo}/releases" target="_blank" rel="noopener">GitHub Releases</a></p>
	</div>
{/each}
