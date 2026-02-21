# 007 復習画面・SM-2実装（/decks/[id]/study）

フラッシュカードモードと穴埋めモードをランダム出題し、SM-2アルゴリズムで学習状態を更新する。
006 完了後に着手する。

---

## 関連ファイル

- `app/decks/[id]/study/page.tsx`（新規）
- `app/decks/[id]/study/StudyClient.tsx`（新規・`"use client"`）
- `lib/actions/review-actions.ts`（新規）
- `lib/sm2.ts`（新規）

---

## TODO

### SM-2アルゴリズム（lib/sm2.ts）
- [x] `calcNextReview(easeFactor, interval, repetitions, rating)` 関数を実装する
  - `rating`: `'easy'` = 5, `'normal'` = 3, `'hard'` = 1 のスコアに変換する
  - SM-2の計算式で `newEaseFactor` / `newInterval` / `newRepetitions` を算出して返す
  - `easeFactor` の最小値は 1.3 にクランプする

### 出題カード取得（app/decks/[id]/study/page.tsx）
- [x] Server Component で `next_review_at <= now()` のカードを取得する
- [x] `next_review_at` 昇順でソートして上限20枚を取得する
- [x] カードが0枚の場合は「本日の復習はありません」画面を表示する
- [x] カードデータを Client Component（StudyClient）に渡す

### StudyClient コンポーネント（`"use client"`）
- [x] カードのキューをローカル state で管理する
- [x] 各カードでフラッシュカードモード / 穴埋めモードをランダムに決定する

#### フラッシュカードモード
- [x] 表面に単語を表示する
- [x] タップ／クリックでフリップアニメーションして裏面を表示する
- [x] 裏面に読み方・意味・品詞・例文3文を表示する
- [x] 音声ボタンを設置する（Web Speech API）
- [x] 「簡単・普通・難しい」ボタンで評価する

#### 穴埋めモード
- [x] 例文3文からランダムに1文を選ぶ
- [x] 単語部分を `___` に置換して表示する
- [x] テキスト入力で回答させる
- [x] 送信後に正解・不正解を表示する（大文字小文字は無視して判定）
- [x] 正解表示後に「簡単・普通・難しい」ボタンで評価する

#### 音声読み上げ（Web Speech API）
- [x] `window.speechSynthesis.speak()` で単語と例文を読み上げる
- [x] 英語デッキは `en-US`、スペイン語デッキは `es-ES` を指定する
- [x] 指定言語が利用できない場合は最も近い言語にフォールバックする

### Server Action（lib/actions/review-actions.ts）
- [x] `submitReview(cardId, rating, isCorrect, mode)` アクションを実装する
- [x] `card_reviews` を upsert（初回は INSERT、以降は UPDATE）する
- [x] `lib/sm2.ts` の計算結果で `ease_factor` / `interval` / `repetitions` / `next_review_at` を更新する
- [x] `study_logs` に学習履歴を INSERT する
- [x] `revalidatePath('/decks/[id]/study')` する

### 動作確認
- [x] 復習カードが出題されることを確認する
- [x] フラッシュカードモードと穴埋めモードがランダムに切り替わることを確認する
- [x] 「簡単」で評価すると次回の `next_review_at` が長くなることを確認する
- [x] 「難しい」で評価すると `next_review_at` が短くなることを確認する
- [x] 音声ボタンで単語が読み上げられることを確認する
- [x] 全カード完了後に完了画面が表示されることを確認する
