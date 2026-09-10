<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
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
	<link rel="icon" href={favicon} />
	<title>{site.name}</title>
	<meta name="description" content={site.tagline} />
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
