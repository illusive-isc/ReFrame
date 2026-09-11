<script lang="ts">
	import { base } from '$app/paths';
	import { pages, site, vccAddRepoUrl } from '$lib/site';
	import Link from '$lib/Link.svelte';
	import Seo from '$lib/Seo.svelte';
</script>

<Seo title={pages[0].title} description={pages[0].description} path={pages[0].path} />

<h1>{site.name}</h1>
<p class="lead">{site.tagline}</p>
<p class="supported">現在は輝夜 / ルルネに対応。ほかのアバターは開発中です。</p>

<p>
	ReFrame は、VRChat アバターの衣装・ギミック・エモートのうち使わないものを、元のプレハブを壊さずにビルド時だけ取り除くツールです。
	NDMF の上で動き、Modular Avatar や AvatarOptimizer と一緒に使えます。Quest 向けには、マテリアルの焼き込みや揺れ物の間引きまで含めた「Quest 簡易対応」を、PC 用とは別の設定として持てます。
</p>

<div class="card">
	<h3>追加する</h3>
	<p>方法は 2 つあります。どちらでも同じものが入り、共通部分の ReFrameCore は依存として一緒に入ります。</p>

	<h4>インストーラーで追加する (自動)</h4>
	<p>
		UnityPackage を利用して VCC へ登録します。使うアバターのファイルを Unity
		に取り込むと、一覧の登録とパッケージの追加がまとめて行われます。VCC
		の画面を操作する必要はありません。更新のときも同じ手順です。
	</p>
	<p>
		<Link class="button" href="{base}/install/">インストーラーで追加</Link>
	</p>

	<h4>VCC に追加する (手動)</h4>
	<p>
		VRChat Creator Companion に一覧を自分で登録します。登録後、プロジェクトの Manage Packages
		から使うアバターの <strong>ReFrame for …</strong> を追加してください。
	</p>
	<p>
		<Link class="button secondary" href={vccAddRepoUrl}>VCC に一覧を追加</Link>
		<Link class="button secondary" href="{base}/guide/">導入手順を読む</Link>
	</p>
	<p>手動で登録する場合の URL: <code>{site.listingUrl}</code></p>
</div>

<h2>できること</h2>
<div class="grid">
	<div class="card">
		<h3>壊さずに減らす</h3>
		<p>削除はビルド時の処理です。シーンのアバターはそのままなので、いつでも戻せます。</p>
	</div>
	<div class="card">
		<h3>メニューと同じ並び</h3>
		<p>Inspector にはゲーム内メニューと同じまとまりで項目が並び、消すと空く同期パラメーターのビット数が見えます。</p>
	</div>
	<div class="card">
		<h3>Quest は別設定</h3>
		<p>「Quest 簡易対応版」を作ると、PC 用とは独立した設定で Android のビルドだけを軽くできます。</p>
	</div>
	<div class="card">
		<h3>後始末まで</h3>
		<p>消したギミックの実体とボーンは、他の最適化ツールより前に ReFrame が片付けます。</p>
	</div>
</div>

<h2>パッケージ</h2>
<table>
	<thead><tr><th>パッケージ</th><th>内容</th></tr></thead>
	<tbody>
		{#each site.packages as p}
			<tr>
				<td><a href="https://github.com/{p.repo}" target="_blank" rel="noopener">{p.name}</a><br /><code>{p.id}</code></td>
				<td>{p.summary}</td>
			</tr>
		{/each}
	</tbody>
</table>
<p><a href="{base}/packages/">最新版と配布ファイルの一覧 →</a></p>
