# ReFrame 公開サイト (E:\ReFreme)

ReFrame (VRChat アバターの非破壊ギミック削除 / Quest 簡易対応ツール) を公開するための静的サイト。SvelteKit + adapter-static、TypeScript、日本語。

## 役割

- 利用者向けの説明 (はじめに / 導入手順 / パッケージ / 更新履歴)。
- **VPM の一覧をこのサイトが配る**: `scripts/build-listing.mjs` が GitHub の Release (zip / package.json / .sha256) から `static/vpm/index.json` を生成し、`https://<公開先>/vpm/index.json` として配布する。VCC には `vcc://vpm/addRepo?url=<一覧 URL>` で登録できる (トップページのボタン)。
- 公開先の URL は `src/lib/site.ts` の `listingUrl` と `scripts/build-listing.mjs` の `listing.url` の 2 か所 (同じ値にする)。公開先が決まったら両方を直し、3 つのパッケージの package.json の `repo` も同じ URL に差し替える (ReFrame の更新通知がこれを見る)。

## コマンド

- `npm run dev` 開発サーバー / `npm run build` 静的書き出し (build/) / `npm run preview`
- `npm run listing` VPM 一覧の再生成 (GitHub API。`GITHUB_TOKEN` があると回数制限が緩い)
- サブパスで公開するときは `BASE_PATH=/ReFrame npm run build` (vite.config.ts の paths.base)。Git Bash では `MSYS_NO_PATHCONV=1` を付けないと `/ReFrame` が Windows のパスに化ける。Kit の設定 (adapter-static など) は svelte.config.js ではなく **vite.config.ts の sveltekit({...}) に書く** (テンプレートの方式)

## 公開の流れ (GitHub Actions)

- `.github/workflows/deploy.yml`: main への push / 手動 / `repository_dispatch` (package-released) / 毎日 1 回、で `npm run build` → GitHub Pages。build の中で一覧を作り直すので、手元で `npm run listing` を回さなくてよい。
- 各パッケージの release.yml は Release 作成後に `illusive-isc/ReFrame` へ `repository_dispatch` を送る (最後の "Notify site" ステップ)。送るには各パッケージ リポジトリの Secrets に `SITE_DISPATCH_TOKEN` (ReFrame リポジトリへの contents:write を持つ Fine-grained PAT) が要る。無ければ warning を出して飛ばす (翌日の schedule で拾われる)。
- Pages の Source は "GitHub Actions" にする。

## 関係するもの

- パッケージ本体: `D:\jp\illusive-isc\Kaguya\Packages\{ReFrameCore,ReFrameForKaguya,ReFrameForRurune}` (各自が GitHub リポジトリ illusive-isc/<同名>)。リリースは package.json の version と同名のタグを push → Actions が Release を作る。
- ReFrame の設計や経緯は avatar スキル (`C:\Users\owner\.claude\skills\avatar\references\tools\reframe-packages.md`、コメント原文は `reframe-notes/`)。
- 以前の一覧 (illusive-isc.github.io/vpm-repos) からは ReFrame を外してある。こちらが新しい公開領域。

## 書き方の約束

- 応答は日本語。文章は利用者向けの説明として、短い文で。
- 手順の本文は `src/routes/guide/+page.svelte` にあり、パッケージの README と内容を揃える。
