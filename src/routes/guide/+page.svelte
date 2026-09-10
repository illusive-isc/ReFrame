<script lang="ts">
	import { site, vccAddRepoUrl } from '$lib/site';
</script>

<svelte:head>
	<title>導入手順 - {site.name}</title>
</svelte:head>

<h1>導入手順</h1>
<p class="lead">VCC への登録から Quest 用の設定、アップロードまで。</p>

<h2>前提</h2>
<ul>
	<li>Unity 2022.3 と VRChat Creator Companion (VCC)、VRChat SDK (Avatars 3.7 以上) が入ったアバタープロジェクト。</li>
	<li>NDMF、Modular Avatar、AvatarOptimizer、lilToon。ReFrame を入れると依存として一緒に入ります。</li>
</ul>

<h2>1. VCC に一覧を登録してパッケージを入れる</h2>
<ol class="steps">
	<li><a href={vccAddRepoUrl}>VCC に一覧を追加</a> を押すか、VCC の Settings → Packages → Add Repository に <code>{site.listingUrl}</code> を入れて追加します。</li>
	<li>対象プロジェクトの Manage Packages で、使うアバターに合わせて <strong>ReFrame for kaguya</strong> または <strong>ReFrame for rurune</strong> を追加します。共通部分の <strong>ReFrameCore</strong> は依存として自動で入るので、別に選ぶ必要はありません。</li>
</ol>

<h2>2. アバターに ReFrame を付ける</h2>
<ol class="steps">
	<li>Unity でシーンを開き、Hierarchy でアバターのルートを右クリック → <strong>GameObject → ReFrame → このアバターに ReFrame を追加</strong>。</li>
	<li>アバターの下に「ReFrame」という子オブジェクトが作られ、そのアバター用のコンポーネントが付きます。プレハブをアンパックしていたり名前を変えていても、FBX から判別します。判別できないときは「種類を選んで追加」から選びます。</li>
</ol>

<h2>3. 消すものを選ぶ (PC 用の設定)</h2>
<ul>
	<li>Inspector には衣装・ギミック・エモートなどの項目が、ゲーム内メニューと同じまとまりで並びます。各行の右側が「維持 / 削除」のタイルと値です。</li>
	<li>削除にすると、その項目のメニュー・パラメーター・アニメーションがビルド時に外れます。値を OFF にして削除すればギミックごと消え、ON にして削除すればその状態で固定されます (タイルの文言が「ギミック削除」「メニュー削除」と変わります)。</li>
	<li>行の左の数字は、削除で空く同期パラメーターのビット数です。上部の帯に合計が出ます。</li>
	<li>「プレビューに反映」が ON なら、消える物が Hierarchy と Scene で非表示になります。元のアバターは変わりません。</li>
	<li>「使わなくなったモノの片付け」は「あらかじめ削除する」のままで構いません。消したギミックの実体とボーンを AvatarOptimizer より先に片付けます。</li>
</ul>

<h2>4. Quest 用の設定 (必要な人だけ)</h2>
<ol class="steps">
	<li>PC 用の Inspector の一番上にある <strong>Quest 簡易対応版を作成</strong> を押します。同じオブジェクトに Quest 用のコンポーネントが増え、その時点の設定が写されます。以後、PC 用と Quest 用は別々に編集できます。</li>
	<li>Quest 用の Inspector で、追加で消すもの、揺れ物の一覧 (プレハブごとの箱、上限 8 本の目安付き)、服に隠れた面の切り取り、テクスチャサイズを決めます。</li>
	<li><strong>Quest 用マテリアルを作成</strong> を押すと、lilToon の見た目を Toon Lit 用に焼いた置き場が作られます。Windows ターゲットのままで焼けます。マテリアルを変えたときは焼き直しを促されます。</li>
	<li>見た目を Unity で確かめたいときだけ <strong>Quest (Android) 用に切り替える</strong> (Android プレビューモード) を使います。アップロードだけなら切り替えは要りません。</li>
	<li>両方のコンポーネントがあるときは、一番上の「プレビューに使う側」で PC 用 / Quest 用のどちらを Scene に映すか選べます。</li>
</ol>

<h2>5. アップロード</h2>
<p>VRChat SDK のビルド画面で Windows と Android の両方にチェックを入れて Build &amp; Publish すれば、PC には PC 用、Android には Quest 用の設定が自動で使われます (同じアバター ID に 2 つの版が付きます)。片方ずつ上げても同じです。</p>

<h2>6. 更新</h2>
<p>新しい版が出ると、Inspector の一番上に「新しい版 X が公開されています」と出ます。「更新する…」で内容を確認してから入れ替えられます。VCC から更新しても構いません。</p>

<h2>困ったときの見方</h2>
<div class="note">
	<ul>
		<li>行に「前提削除」と出ているものは、別の項目を消した結果として一緒に消える物です。戻したいなら元の項目を維持に戻します。</li>
		<li>Quest 用で「Quest 非対応」と出る行は、Quest では動かないコンポーネントを含むため自動で削除になります。</li>
		<li>消えて困る物があれば、その項目を維持に戻すか、「使わなくなったモノの片付け」を「AAO にお任せする」に切り替えてください。</li>
	</ul>
</div>
