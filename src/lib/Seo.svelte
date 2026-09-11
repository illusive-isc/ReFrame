<script lang="ts">
	import { absolute, site } from '$lib/site';

	let {
		title,
		description = site.description,
		path = '/',
		image = site.ogImage
	}: { title?: string; description?: string; path?: string; image?: string } = $props();

	const fullTitle = $derived(title && title !== site.name ? `${title} | ${site.name}` : site.name);
	const canonical = $derived(absolute(path));
	const imageUrl = $derived(absolute(image));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{site.name} — {site.tagline}" />

	<meta name="twitter:card" content="summary_large_image" />
	{#if site.twitter}
		<meta name="twitter:site" content={site.twitter} />
		<meta name="twitter:creator" content={site.twitter} />
	{/if}
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content="{site.name} — {site.tagline}" />
</svelte:head>
