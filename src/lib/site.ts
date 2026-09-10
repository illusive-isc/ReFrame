// サイト全体の設定。公開先を変えるときは origin と basePath を直す
// (scripts/build-listing.mjs の listing.url と、各パッケージの package.json の repo も同じ値に揃える)。

const origin = 'https://reframe.illusive-isc.jp';
const basePath = '';

export const site = {
	name: 'ReFrame',
	tagline: 'IKUSIA アバターのギミックを、壊さずに減らす',
	description:
		'ReFrame は VRChat アバターの衣装・ギミック・エモートのうち使わないものを、元のプレハブを壊さずにビルド時だけ取り除く NDMF 拡張です。同期パラメーターの節約と Quest 簡易対応 (マテリアルの焼き込み・揺れ物の間引き) に対応します。',
	origin,
	basePath,
	/** 公開時の絶対 URL (canonical / OGP 用) */
	url: origin + basePath,
	// VPM の一覧 (このサイトが static/vpm/index.json として配る)
	listingUrl: `${origin}${basePath}/vpm/index.json`,
	listingId: 'jp.illusive-isc.reframe',
	author: { name: 'illusive_isc', url: 'https://github.com/illusive-isc' },
	github: 'https://github.com/illusive-isc',
	/** X (Twitter) のアカウント。@ 付き。空なら twitter:site を出さない */
	twitter: '',
	packages: [
		{
			id: 'jp.illusive-isc.reframe-core',
			name: 'ReFrameCore',
			repo: 'illusive-isc/ReFrameCore',
			summary: 'ReFrame の共通部分。アバター用のパッケージを入れると、依存として一緒に入ります。'
		},
		{
			id: 'jp.illusive-isc.reframe-kaguya',
			name: 'ReFrame for kaguya',
			repo: 'illusive-isc/ReFrameForKaguya',
			summary: '輝夜用のパッケージ。消す対象 (衣装・ギミック類) 及び Quest 対応用の差分設定。',
			avatar: 'kaguya'
		},
		{
			id: 'jp.illusive-isc.reframe-rurune',
			name: 'ReFrame for rurune',
			repo: 'illusive-isc/ReFrameForRurune',
			summary: 'ルルネ用のパッケージ。消す対象 (衣装・ギミック類) 及び Quest 対応用の差分設定。',
			avatar: 'rurune'
		}
	]
};

/** サイト内のページ。sitemap.xml と各ページの説明に使う */
export const pages = [
	{
		path: '/',
		title: site.name,
		description: site.description,
		priority: '1.0'
	},
	{
		path: '/guide/',
		title: '導入手順',
		description:
			'ReFrame の導入手順。VCC への一覧の登録、アバターへの追加、消す項目の選び方、Quest 簡易対応版の作成、PC と Quest の同時アップロードまでを順に説明します。',
		priority: '0.9'
	},
	{
		path: '/packages/',
		title: 'パッケージ',
		description:
			'ReFrameCore / ReFrame for kaguya / ReFrame for rurune の最新版、配布 zip、SHA256、依存パッケージの一覧。',
		priority: '0.7'
	},
	{
		path: '/install/',
		title: '導入と更新',
		description:
			'ReFrame を取り込むだけで入れられる unitypackage の配布ページ。VCC を開かずに、最新版の導入と更新ができます。',
		priority: '0.8'
	},
	{
		path: '/changelog/',
		title: '更新履歴',
		description: 'ReFrame の各パッケージの更新履歴と、GitHub の CHANGELOG / Releases へのリンク。',
		priority: '0.5'
	}
];

/** VCC に一覧を追加するリンク */
export const vccAddRepoUrl = `vcc://vpm/addRepo?url=${encodeURIComponent(site.listingUrl)}`;

/** 取り込むだけで入る unitypackage の URL (scripts/build-installers.mjs が作る) */
export const installerUrl = (packageId: string) =>
	`${basePath}/install/${packageId}-installer.unitypackage`;

/** サイト内のパスを絶対 URL にする */
export const absolute = (path: string) => site.url + (path.startsWith('/') ? path : `/${path}`);
