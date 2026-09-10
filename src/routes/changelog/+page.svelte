<script lang="ts">
	import { site } from '$lib/site';
</script>

<svelte:head>
	<title>更新履歴 - {site.name}</title>
</svelte:head>

<h1>更新履歴</h1>
<p class="lead">各パッケージの CHANGELOG.md へのリンクと、主な変更の要約。</p>

{#each site.packages as p}
	<div class="card">
		<h3>{p.name}</h3>
		<p><a href="https://github.com/{p.repo}/blob/main/CHANGELOG.md" target="_blank" rel="noopener">CHANGELOG.md</a> / <a href="https://github.com/{p.repo}/releases" target="_blank" rel="noopener">Releases</a></p>
	</div>
{/each}

<h2>0.0.1</h2>
<ul>
	<li>初版。ギミック削除、Quest 簡易対応版 (別コンポーネント)、揺れ物の一覧、マテリアルの焼き込み、更新通知。</li>
</ul>
