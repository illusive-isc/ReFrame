<script lang="ts">
	import { pages, site } from '$lib/site';
	import Link from '$lib/Link.svelte';
	import Seo from '$lib/Seo.svelte';
</script>

<Seo title={pages[3].title} description={pages[3].description} path={pages[3].path} />

<h1>更新履歴</h1>
<p class="lead">各パッケージの CHANGELOG.md へのリンクと、主な変更の要約。</p>

{#each site.packages as p}
	<div class="card">
		<h3>{p.name}</h3>
		<p><Link href="https://github.com/{p.repo}/blob/main/CHANGELOG.md">CHANGELOG.md</Link> / <Link href="https://github.com/{p.repo}/releases">Releases</Link></p>
	</div>
{/each}

<h2>0.0.2</h2>
<ul>
	<li>配布先の一覧をこのサイト (<code>{site.listingUrl}</code>) に変更。Inspector の更新通知がこの一覧を見るようになりました。</li>
	<li>0.0.1 を入れている場合は、この版に上げると更新通知が働きます。</li>
</ul>

<h2>0.0.1</h2>
<ul>
	<li>初版。ギミック削除、Quest 簡易対応版 (別コンポーネント)、揺れ物の一覧、マテリアルの焼き込み、更新通知。</li>
</ul>
