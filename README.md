# ReFrame

IKUSIA アバターのギミックを、壊さずに減らす。

<https://reframe.illusive-isc.jp/>

ReFrame は、VRChat アバターの衣装・ギミック・エモートのうち使わないものを、元のプレハブを壊さずにビルド時だけ取り除くツールです。シーンのアバターはそのままなので、いつでも元に戻せます。

Quest 向けには、マテリアルの焼き込みや揺れ物の間引きまで含めた「Quest 簡易対応」を、PC 用とは別の設定として持てます。

## このリポジトリについて

上のサイトを置いている場所です。サイトでは次のことを案内しています。

- [はじめに](https://reframe.illusive-isc.jp/) — できることの紹介と、VCC への登録
- [導入手順](https://reframe.illusive-isc.jp/guide/) — 導入から Quest 用の設定、アップロードまで
- [パッケージ](https://reframe.illusive-isc.jp/packages/) — 配布しているパッケージの一覧
- [更新履歴](https://reframe.illusive-isc.jp/changelog/) — 各版の変更点

## 導入

サイトの[はじめに](https://reframe.illusive-isc.jp/)にあるボタンから、VRChat Creator Companion に一覧を登録できます。

手で登録する場合は、VCC の Settings → Packages → Add Repository に次の URL を入れてください。

```
https://reframe.illusive-isc.jp/vpm/index.json
```

登録したら、対象プロジェクトの Manage Packages で、使うアバターに合わせたパッケージを追加します。共通部分は依存として自動で入ります。

## 作者

[illusive_isc](https://github.com/illusive-isc)
