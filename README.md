# ReFrame 公開サイト

[ReFrame](https://reframe.illusive-isc.jp/) の説明ページと、VPM の一覧 (VCC 用リポジトリ) を配るための静的サイト。

- 公開先: <https://reframe.illusive-isc.jp/>
- VPM の一覧: <https://reframe.illusive-isc.jp/vpm/index.json>

ReFrame は VRChat アバターの衣装・ギミック・エモートのうち使わないものを、元のプレハブを壊さずにビルド時だけ取り除くツールです。使い方はサイトの[導入手順](https://reframe.illusive-isc.jp/guide/)を見てください。

## 開発

```sh
npm install
npm run dev       # 開発サーバー
npm run build     # 一覧の再生成 + 静的書き出し (build/)
npm run preview   # 書き出したものを確認
npm run listing   # VPM 一覧だけ再生成 (GITHUB_TOKEN があると API の制限が緩い)
```

サブパスで公開するので、手元で本番と同じ形を見るときは `BASE_PATH=/ReFrame npm run build`。

## VPM 一覧の作られ方

`scripts/build-listing.mjs` が ReFrameCore / ReFrameForKaguya / ReFrameForRurune の GitHub Release を読み、
添付された zip・package.json・.sha256 から `static/vpm/index.json` を組み立てます。

公開は GitHub Actions (`.github/workflows/deploy.yml`) が行います。動くきっかけは次の 4 つ。

- main への push
- 手動実行
- 各パッケージが Release を作った後に送る通知 (`repository_dispatch`)
- 毎日 1 回 (通知が届かなかったときの保険)

パッケージ側から通知を送るには、各パッケージのリポジトリに `SITE_DISPATCH_TOKEN`
(このリポジトリへの contents:write を持つ Fine-grained PAT) を Secrets として登録します。
無い場合は警告を出して飛ばすので、リリース自体は失敗しません。
