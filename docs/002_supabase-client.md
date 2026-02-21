# 002 Supabase クライアント・Middleware 設定

Next.js に Supabase SSR クライアントと認証Middlewareを組み込む。
001 完了後、認証・DB操作を伴う全チケットの前提となる。

---

## 関連ファイル

- `lib/supabase/client.ts`（新規）
- `lib/supabase/server.ts`（新規）
- `middleware.ts`（新規）
- `types/database.types.ts`（001で生成済み）

---

## TODO

### パッケージインストール
- [x] `npm install @supabase/supabase-js @supabase/ssr` を実行する

### lib/supabase/client.ts
- [x] `createBrowserClient` を使った Client Component 用クライアントを実装する
- [x] `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を参照する

### lib/supabase/server.ts
- [x] `createServerClient` + `cookies()` を使った Server Component 用クライアントを実装する
- [x] `getAll` / `setAll` の cookie ハンドラを実装する
- [x] `setAll` の catch ブロックで Server Component からの呼び出し時エラーを無視する

### middleware.ts
- [x] `createServerClient` でトークンリフレッシュ用クライアントを生成する
- [x] `supabase.auth.getUser()` を呼び出してトークンをリフレッシュする
- [x] `request.cookies` と `supabaseResponse.cookies` の両方を更新する
- [x] `supabaseResponse` をそのまま return する（差し替え禁止）
- [x] matcher で `_next/static` / `_next/image` / `favicon.ico` / 画像拡張子を除外する

### 動作確認
- [x] `npm run dev` でエラーなく起動することを確認する
- [x] Supabase ダッシュボードから接続が認識されていることを確認する
