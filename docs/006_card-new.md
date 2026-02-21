# 006 カード登録・AI例文生成（/decks/[id]/cards/new）

単語情報の入力と Claude API による例文自動生成。
005 完了後に着手する。環境変数 `ANTHROPIC_API_KEY` が必要。

---

## 関連ファイル

- `app/decks/[id]/cards/new/page.tsx`（新規）
- `app/api/generate-examples/route.ts`（新規）
- `lib/actions/card-actions.ts`（新規）

---

## TODO

### カード登録フォーム（app/decks/[id]/cards/new/page.tsx）
- [x] 入力項目を実装する：単語（必須）・読み方・意味（必須）・品詞・難易度（A1〜C2）
- [x] 「例文を生成する」ボタンを実装する（Claude API を呼び出す）
- [x] 生成中はローディングスピナーを表示する
- [x] 生成された例文3文を編集可能なテキストエリアで表示する
- [x] 例文確認後に「カードを保存する」ボタンで保存できるようにする
- [x] `useActionState` でローディング・エラー状態を管理する

### Route Handler（app/api/generate-examples/route.ts）
- [x] POST リクエストで `word` / `part_of_speech` / `level` / `language` を受け取る
- [x] `ANTHROPIC_API_KEY` は Route Handler 内でのみ参照しクライアントに渡さない
- [x] Claude API（`claude-sonnet-4-5-20250929` 推奨）に例文3文の生成を依頼する
- [x] プロンプトに言語・難易度・品詞を含め、`word` を使った自然な例文を要求する
- [x] レスポンスを `string[]`（3要素）として返す

### Server Action（lib/actions/card-actions.ts）
- [x] `createCard` アクション：`cards` テーブルに INSERT する
- [x] `deck_id` / `user_id` / 全フォームフィールド / `examples` を保存する
- [x] 保存後は `revalidatePath('/decks/[id]')` して `redirect('/decks/[id]')` する

### 動作確認
- [x] 単語を入力して例文生成ボタンを押すと3文が表示されることを確認する
- [x] 例文を編集して保存するとデッキ詳細にカードが追加されることを確認する
- [x] `ANTHROPIC_API_KEY` がブラウザのネットワークリクエストに露出しないことを確認する
