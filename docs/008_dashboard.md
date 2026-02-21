# 008 ダッシュボード（/dashboard）

学習統計の可視化。正答率の推移グラフとデッキごとの進捗を表示する。
007 完了後に着手する（`study_logs` / `card_reviews` にデータが蓄積されてから実装）。

---

## 関連ファイル

- `app/dashboard/page.tsx`（新規）
- `app/dashboard/loading.tsx`（新規）
- `components/ProgressChart.tsx`（新規・`"use client"`）
- `components/DeckProgress.tsx`（新規）

---

## TODO

### データ集計（app/dashboard/page.tsx）
- [x] Server Component でログインユーザーの `study_logs` を取得する
- [x] 直近30日の日別正答率を集計する（`is_correct` の割合）
- [x] デッキごとの進捗を集計する（`card_reviews` の `repetitions > 0` 件数 / `cards` 総数）
- [x] `Promise.all` でグラフ用データとデッキ進捗データを並列取得する

### 正答率グラフ（components/ProgressChart.tsx）
- [x] グラフライブラリを選定・インストールする（Recharts 推奨）
- [x] `dynamic(() => import(...), { ssr: false })` で遅延ロードする
- [x] 直近30日の日別正答率を折れ線グラフで表示する
- [x] PC表示を考慮したレイアウトにする

### デッキ進捗（components/DeckProgress.tsx）
- [x] デッキごとに「習得済み枚数 / 全枚数」をプログレスバーで表示する
- [x] 習得済みの定義：`card_reviews.repetitions >= 1`（1回以上復習済み）とする

### 統計サマリー
- [x] 総学習カード数（`study_logs` のレコード数）を表示する
- [x] 全体の正答率（`is_correct = true` の割合）を表示する
- [x] 今日復習すべきカード数（`next_review_at <= now()` の件数）を表示する

### loading.tsx
- [x] グラフ・進捗バーのスケルトンUIを実装する

### 動作確認
- [x] 学習履歴がない初期状態でエラーにならないことを確認する
- [x] 復習後に正答率グラフが更新されることを確認する
- [x] デッキ進捗が正しく反映されることを確認する
