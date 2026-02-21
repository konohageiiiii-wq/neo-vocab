# 003 認証画面（/auth）

ユーザーのログイン・新規登録画面。Supabase Auth を使用する。
002 完了後に着手する。

---

## 関連ファイル

- `app/auth/page.tsx`（新規）
- `app/auth/actions.ts`（新規）
- `middleware.ts`（002で作成済み・認証ガード追加）

---

## TODO

### UI
- [x] ログイン・新規登録を切り替えるタブ or トグルを実装する
- [x] メールアドレス・パスワードの入力フォームを実装する
- [x] 送信ボタンのローディング状態を `useActionState`（React 19）で管理する
- [x] エラーメッセージ（認証失敗・バリデーション）を表示する

### Server Actions（app/auth/actions.ts）
- [x] `signUp` アクション：`supabase.auth.signUp()` でユーザー登録する
- [x] `signIn` アクション：`supabase.auth.signInWithPassword()` でログインする
- [x] 成功後は `redirect('/dashboard')` でリダイレクトする
- [x] `signOut` アクション：`supabase.auth.signOut()` でログアウトし `redirect('/auth')` する

### 認証ガード（middleware.ts）
- [x] 未ログイン状態で `/dashboard` / `/decks` などにアクセスした場合 `/auth` にリダイレクドする
- [x] ログイン済み状態で `/auth` にアクセスした場合 `/dashboard` にリダイレクトする
- [x] リダイレクト時も `supabaseResponse` の Cookie を引き継ぐ

### 動作確認
- [x] 新規登録 → Supabase ダッシュボードの auth.users にレコードが作成されることを確認する
- [x] ログイン → `/dashboard` にリダイレクトされることを確認する
- [x] ログアウト → `/auth` にリダイレクトされることを確認する
- [x] 未ログインで `/decks` にアクセス → `/auth` にリダイレクトされることを確認する
