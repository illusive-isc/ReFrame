<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '$lib/site';
	import CircuitBackground from '$lib/CircuitBackground.svelte';
	import '../app.css';

	let { children } = $props();

	const nav = [
		{ href: `${base}/`, label: 'はじめに' },
		{ href: `${base}/guide/`, label: '導入手順' },
		{ href: `${base}/packages/`, label: 'パッケージ' },
		{ href: `${base}/changelog/`, label: '更新履歴' }
	];

	const isCurrent = (href: string) => page.url.pathname === href;
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.tagline} />
	<link rel="icon" href="{base}/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="{base}/favicon-32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="{base}/favicon-16.png" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
	<link rel="manifest" href="{base}/site.webmanifest" />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={site.tagline} />
	<meta property="og:image" content="{base}/og-image.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<CircuitBackground />

<header class="site-header">
	<a class="brand" href="{base}/"><span class="brand-mark">Re</span>Frame</a>
	<nav>
		{#each nav as item}
			<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a>
		{/each}
		<a href={site.github} target="_blank" rel="noopener">GitHub</a>
	</nav>
</header>

<main class="site-main">
	{@render children()}
</main>

<footer class="site-footer">
	<span>© {new Date().getFullYear()} <a href={site.author.url}>{site.author.name}</a></span>
	<span>VPM: <code>{site.listingUrl}</code></span>
</footer>
