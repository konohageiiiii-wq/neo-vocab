# 004 デッキ一覧・作成（/decks）

自分のデッキ一覧表示、公開デッキの閲覧、新規デッキ作成。
003 完了後に着手する。

---

## 関連ファイル

- `app/decks/page.tsx`（新規）
- `app/decks/new/page.tsx`（新規）
- `app/decks/actions.ts`（新規）
- `components/DeckCard.tsx`（新規）

---

## TODO

### デッキ一覧ページ（app/decks/page.tsx）
- [x] Server Component でログインユーザーのデッキ一覧を取得する（`user_id = auth.uid()`）
- [x] 公開デッキ（`is_public = true`）のセクションを別途表示する
- [x] デッキカード（DeckCard コンポーネント）をグリッドで表示する
- [x] 「新規デッキ作成」ボタンを設置する（`/decks/new` へ遷移）
- [x] PC表示を考慮したグリッドレイアウトにする（sm: 2列、lg: 3列など）
- [x] `loading.tsx` でスケルトンUIを実装する

### DeckCard コンポーネント
- [x] デッキ名・説明・言語バッジ・カード枚数を表示する
- [x] デッキ詳細ページ（`/decks/[id]`）へのリンクを設置する
- [x] 公開デッキは所有者名またはバッジで区別する

### 新規デッキ作成ページ（app/decks/new/page.tsx）
- [x] デッキ名（必須）・説明・言語（英語/スペイン語）・公開設定の入力フォームを実装する
- [x] `useActionState` でローディング・エラー状態を管理する

### Server Actions（app/decks/actions.ts）
- [x] `createDeck` アクション：`decks` テーブルに INSERT し `revalidatePath('/decks')` する
- [x] 作成成功後は `redirect('/decks/[新しいid]')` する
- [x] `deleteDeck` アクション：`decks` から DELETE し `revalidatePath('/decks')` する（後で使用）

### 動作確認
- [x] デッキを作成 → 一覧に表示されることを確認する
- [x] 他ユーザーの公開デッキが一覧に表示されることを確認する
- [x] 他ユーザーの非公開デッキが表示されないことを確認する
