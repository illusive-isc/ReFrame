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

<h2>for kaguya 0.5.3</h2>
<ul>
	<li>「もちまる 位置」を「頭上固定」にしたとき、頭の上のもちまるが後ろを向いて見える (尻尾が前へ回って顔を覆う) 問題を直しました。「地上」にしている場合と、もちまるを消している場合は変わりません。</li>
</ul>

<h2>ReFrameCore 0.8.2</h2>
<ul>
	<li>Quest の検査で、追加した服・小物のためにアップロードできないと分かったとき、「追加した服・小物のため、Quest 対応できません。別のツールで対応してください」と案内するようにしました。アバター本体だけなら上限に収まる項目 (使えないコンポーネント・Contact・Constraint・VRCRaycast) を、本体だけの値と関わっている服・小物の名前つきで並べます (輝夜・ルルネ・ちゆ共通)。</li>
</ul>

<h2>ReFrameCore 0.8.1</h2>
<ul>
	<li>ポーズの左右反転などを「ON で固定」したとき、反転しない姿勢があった問題を直しました (ちゆの立ち・浮遊、kaguya / rurune の立ち・しゃがみ・伏せ・エモート)。反転を固定しない場合や OFF で固定した場合は変わりません。</li>
</ul>

<h2>for Chiyu 0.1.1</h2>
<ul>
	<li>ソックスを着たまま固定したとき、太ももとソックスの履き口の間にすき間が開いていたのを直しました。</li>
</ul>

<h2>ReFrameCore 0.8.0 / for Chiyu 0.1.0</h2>
<ul>
	<li>ちゆ (plium) 用の ReFrame for Chiyu を追加しました。服・髪・表情・小物・ジャンプ／ダッシュ・AFK・エモート・ロコモーションを消せ、Quest 簡易対応版の初期設定も入っています。</li>
	<li>ReFrameCore: 固定して消した服がアップロード後に表示されることがある問題 (Modular Avatar の Merge Animator を使う衣装) と、残す項目が 8 個埋まったメニューに入らない問題を直しました。kaguya / rurune では「足の固定」の並び位置が変わります。</li>
</ul>

<h2>ReFrameCore 0.1.0</h2>
<ul>
	<li>更新のお知らせから zip を直接入れ替える「更新する…」を無くしました。更新は「更新ページを開く」からの unitypackage か VCC で行います。</li>
</ul>

<h2>ReFrameCore 0.0.7 / for kaguya 0.0.8 / for rurune 0.0.7</h2>
<ul>
	<li>Hierarchy の右クリックメニューを「ILLUSORY OVERRIDE → ReFrame」の下に移しました (Add Component と同じ場所)。</li>
	<li>各パッケージの README を利用者向けの説明に書き直しました。</li>
	<li>アバター用パッケージは ReFrameCore 0.0.7 以上を要求します。</li>
</ul>

<h2>ReFrameCore 0.0.6</h2>
<ul>
	<li>Inspector の一番上に作者ショップ (BOOTH) の商品紹介を置きました。折りたたみで、既定では閉じています。設定には影響しません。</li>
</ul>

<h2>ReFrameCore 0.0.5 / for kaguya 0.0.6</h2>
<ul>
	<li>見た目の切り替えの下にあるポーズ (尻尾の向きなど) を固定しても、切り替えごと消えないようにしました。</li>
	<li>Merge Armature で統合するアクセサリのボーンが固定後のポーズに付いてくるようにしました。</li>
	<li>行の相互リンク: 片方を ON にするともう片方も ON になります (kaguya の尻尾の向き 左右 / 上下)。</li>
</ul>

<h2>ReFrameCore 0.0.4</h2>
<ul>
	<li>更新のお知らせから「更新ページを開く」を押せるようになりました。VCC (ALCOM) を開くボタンも足しました。</li>
</ul>

<h2>ReFrameCore 0.0.3</h2>
<ul>
	<li>プレビューの表示が重かったのを直しました。NDMF の切り替えメニューからプレビューを個別に止められます。</li>
</ul>

<h2>0.0.2</h2>
<ul>
	<li>配布先の一覧をこのサイト (<code>{site.listingUrl}</code>) に変更。Inspector の更新通知がこの一覧を見るようになりました。</li>
	<li>0.0.1 を入れている場合は、この版に上げると更新通知が働きます。</li>
</ul>

<h2>0.0.1</h2>
<ul>
	<li>初版。ギミック削除、Quest 簡易対応版 (別コンポーネント)、揺れ物の一覧、マテリアルの焼き込み、更新通知。</li>
</ul>
