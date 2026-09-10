<script lang="ts">
	import { base } from '$app/paths';
	import { installerUrl, pages, site, vccAddRepoUrl } from '$lib/site';
	import Seo from '$lib/Seo.svelte';

	const page = pages.find((p) => p.path === '/install/')!;

	// 配るのはアバター用だけ。共通部分は依存として一緒に入る。
	const avatars = site.packages.filter((p) => 'avatar' in p);
</script>

<Seo title={page.title} description={page.description} path={page.path} />

<h1>導入と更新</h1>
<p class="lead">
	使うアバターのファイルを Unity に取り込むだけで、ReFrame の最新版が入ります。更新のときも同じ手順です。
</p>

<h2>手順</h2>

<ol class="steps">
	<li>下から、使うアバターのファイルを保存します。</li>
	<li>
		対象のプロジェクトを Unity で開いた状態で、保存したファイルをダブルクリックするか、Unity
		の画面にドラッグします。
	</li>
	<li>取り込みの確認が出たら、そのまま進めます。最新版の導入が終わるまで待ちます。</li>
</ol>

<div class="grid">
	{#each avatars as pkg}
		<div class="card">
			<h3>{pkg.name}</h3>
			<p>{pkg.summary}</p>
			<a class="button" href={installerUrl(pkg.id)} download>ダウンロード</a>
		</div>
	{/each}
</div>

<div class="note">
	<p>
		共通部分の <strong>ReFrameCore</strong> は依存として一緒に入ります。別に入れる必要はありません。
	</p>
</div>

<h2>すでに入っている場合</h2>

<p>
	同じファイルで更新できます。入っている版より新しいものが公開されていれば、そちらに入れ替わります。すでに最新なら何も起きません。
</p>

<h2>VCC で管理したい場合</h2>

<p>
	上のファイルを使うと、VRChat Creator Companion (と ALCOM) にも ReFrame の一覧が登録されます。以降は
	VCC の Manage Packages からも更新できます。
</p>

<p>
	一覧だけを先に登録しておくこともできます。<a href={vccAddRepoUrl}>VCC に一覧を追加</a>
	を押すか、VCC の Settings → Packages → Add Repository に次の URL を入れてください。
</p>

<pre><code>{site.listingUrl}</code></pre>

<h2>うまくいかないとき</h2>

<p>
	取り込んでも何も起きない場合は、Unity のプロジェクトが VPM
	に対応しているか確認してください。VRChat Creator Companion で作ったプロジェクトであれば対応しています。
</p>

<p>
	手動で入れる方法は <a href="{base}/guide/">導入手順</a> にあります。各パッケージの zip は
	<a href="{base}/packages/">パッケージ</a> から取得できます。
</p>

<div class="note">
	<p>
		配布しているファイルは <a href="https://github.com/anatawa12/VPMPackageAutoInstaller" target="_blank" rel="noopener">VPMPackageAutoInstaller</a>
		(anatawa12 氏、MIT ライセンス) で作っています。
	</p>
</div>
