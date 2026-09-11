<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { absolute, site } from '$lib/site';
	import Link from '$lib/Link.svelte';
	import CircuitBackground from '$lib/CircuitBackground.svelte';
	import '../app.css';

	let { children } = $props();

	const nav = [
		{ href: `${base}/`, label: 'はじめに' },
		{ href: `${base}/install/`, label: '導入と更新' },
		{ href: `${base}/guide/`, label: '導入手順' },
		{ href: `${base}/packages/`, label: 'パッケージ' },
		{ href: `${base}/changelog/`, label: '更新履歴' }
	];

	const isCurrent = (href: string) => page.url.pathname === href;

	// 検索結果に出す構造化データ (Unity 向けのソフトウェア)
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: site.name,
		description: site.description,
		url: site.url,
		image: absolute(site.ogImage),
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Windows',
		softwareRequirements: 'Unity 2022.3, VRChat SDK Avatars 3.7+, NDMF, Modular Avatar',
		inLanguage: 'ja',
		isAccessibleForFree: true,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
		author: { '@type': 'Person', name: site.author.name, url: site.author.url },
		license: 'https://opensource.org/licenses/MIT'
	};
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="{base}/favicon-32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="{base}/favicon-16.png" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
	<link rel="manifest" href="{base}/site.webmanifest" />
	<meta name="theme-color" content="#7d4fd6" />
	<!-- 検索は許可、学習用の収集は拒否 (robots.txt と対で使う) -->
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<meta name="robots" content="noai, noimageai" />
	<meta name="author" content={site.author.name} />
	<meta
		name="keywords"
		content="VRChat, アバター, ギミック削除, 軽量化, Quest, NDMF, Modular Avatar, AvatarOptimizer, ReFrame"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<CircuitBackground />

<header class="site-header">
	<a class="brand" href="{base}/"><span class="brand-mark">Re</span>Frame</a>
	<nav>
		{#each nav as item}
			<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a>
		{/each}
		<Link href={site.github}>GitHub</Link>
	</nav>
</header>

<main class="site-main">
	{@render children()}
</main>

<footer class="site-footer">
	<span>© {new Date().getFullYear()} <Link href={site.author.url}>{site.author.name}</Link></span>
	<span>VPM: <code>{site.listingUrl}</code></span>
	<span>
		問い合わせ:
		<Link href={site.contact.url}>{site.contact.handle}</Link> へ DM
	</span>
	<span class="legend">
		リンクの印: <span aria-hidden="true">↗</span> 外部サイト /
		<span aria-hidden="true">⧉</span> VCC などのアプリ /
		<span aria-hidden="true">↓</span> ダウンロード
	</span>
</footer>
