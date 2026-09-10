// サイト全体の設定。公開先が決まったら listingUrl を差し替える。

export const site = {
	name: 'ReFrame',
	tagline: 'VRChat アバターのギミックを、壊さずに減らす',
	// VPM の一覧 (このサイトが static/vpm/index.json として配る)
	listingUrl: 'https://illusive-isc.github.io/ReFrame/vpm/index.json',
	listingId: 'jp.illusive-isc.reframe',
	author: { name: 'illusive_isc', url: 'https://github.com/illusive-isc' },
	github: 'https://github.com/illusive-isc',
	packages: [
		{
			id: 'jp.illusive-isc.reframe-core',
			name: 'ReFrameCore',
			repo: 'illusive-isc/ReFrameCore',
			summary: '削除・Quest 簡易対応・Inspector の共通の仕組み。アバター用パッケージが依存する土台。'
		},
		{
			id: 'jp.illusive-isc.reframe-kaguya',
			name: 'ReFrame for kaguya',
			repo: 'illusive-isc/ReFrameForKaguya',
			summary: 'kaguya (IKUSIA) 用の宣言。衣装・ギミック・エモートの行と Quest 用の設定。'
		},
		{
			id: 'jp.illusive-isc.reframe-rurune',
			name: 'ReFrame for rurune',
			repo: 'illusive-isc/ReFrameForRurune',
			summary: 'rurune (IKUSIA) 用の宣言。'
		}
	]
};

/** VCC に一覧を追加するリンク */
export const vccAddRepoUrl = `vcc://vpm/addRepo?url=${encodeURIComponent(site.listingUrl)}`;
