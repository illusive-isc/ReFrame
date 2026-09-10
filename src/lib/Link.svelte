<script lang="ts">
	// リンクの行き先が分かるように印を付ける。
	//   サイト内: 印なし
	//   サイト外: ↗ (別のタブで開く)
	//   vcc:     アプリの印 (VCC / ALCOM が起動する)
	//   ファイル: ↓ (ダウンロードが始まる)
	import type { Snippet } from 'svelte';

	let {
		href,
		children,
		class: className = '',
		download = false
	}: {
		href: string;
		children: Snippet;
		class?: string;
		download?: boolean;
	} = $props();

	// download は真偽値で受けるが、属性に true をそのまま渡すと
	// 保存名が "true" になってしまう。href の末尾 (ファイル名) を渡す。
	const downloadName = $derived(download ? decodeURIComponent(href.split('/').pop() ?? '') : undefined);

	const kind = $derived(
		href.startsWith('vcc:')
			? 'app'
			: download
				? 'download'
				: /^https?:\/\//.test(href)
					? 'external'
					: 'internal'
	);
</script>

<a
	{href}
	class={className}
	download={downloadName}
	target={kind === 'external' ? '_blank' : undefined}
	rel={kind === 'external' ? 'noopener' : undefined}
>{@render children()}{#if kind === 'external'}<span class="mark" aria-hidden="true">↗</span><span
			class="sr">(別のタブで開きます)</span
		>{:else if kind === 'app'}<span class="mark" aria-hidden="true">⧉</span><span class="sr"
			>(VCC または ALCOM が開きます)</span
		>{:else if kind === 'download'}<span class="mark" aria-hidden="true">↓</span><span class="sr"
			>(ダウンロードします)</span
		>{/if}</a
>

<style>
	.mark {
		margin-left: 0.25em;
		font-size: 0.85em;
		opacity: 0.75;
		/* 印は行き先を示すだけなので、選択やコピーの対象にしない */
		user-select: none;
	}

	/* 画面には出さず、読み上げには残す */
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
</style>
