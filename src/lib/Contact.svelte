<script lang="ts">
	// 問い合わせ先の案内。文面を 1 か所にまとめて、各ページから同じものを出す。
	import { site } from '$lib/site';

	// 見出しを出すか (ページ本文に置くときは true、注記の中では false)
	let { heading = true }: { heading?: boolean } = $props();
</script>

{#if heading}
	<h2>問い合わせ</h2>
{/if}

<p>
	うまくいかないときや、消したい物が選べないときは、X の
	<a href={site.contact.url} target="_blank" rel="noopener">{site.contact.handle}</a>
	まで DM でご連絡ください。
</p>

<p>
	DM に反応が無い場合は、あわせて <strong>{site.contact.handle} 宛のメンション付きの投稿</strong>
	でお知らせください。DM に気づいていないことがあります。
</p>

<p>
	お伝えいただけると助かる内容は、使っているアバター、ReFrame の版、Unity
	の版、それと何をしたときに何が起きたかです。
</p>
