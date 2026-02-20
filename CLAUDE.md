# CLAUDE.md — LinguaCard プロジェクト

> **読む前に**: このファイルはチーム全員（人間・AI）の共通ナレッジベースです。
> 実装を始める前に必ずこのファイルを読み、作業完了後は変更内容をここに反映してください。

---

## コマンド

```bash
npm run dev      # 開発サーバー起動（http://localhost:3000）
npm run build    # 本番ビルド（型チェック込み）
npm run start    # 本番サーバー起動
npm run lint     # ESLint 実行
```

テストフレームワーク: 未設定。

---

## サービス概要：LinguaCard

英語・スペイン語対応のフラッシュカード学習アプリ。
単語を登録するだけで Claude AI が例文を自動生成し、SM-2 間隔反復アルゴリズムで効率的な学習をサポートする。

### ターゲットユーザー
学生・社会人（20〜40代）。毎日継続して使うツールとして設計。

### 技術スタック

| 項目 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js App Router | 16.1.6 |
| UI | React + Tailwind CSS v4 | React 19 |
| DB・認証 | Supabase（PostgreSQL + Auth） | - |
| AI例文生成 | Claude API（Anthropic SDK） | claude-sonnet-4-5-20250929 |
| 音声読み上げ | Web Speech API | - |
| アイコン | Lucide React | - |
| デプロイ | Vercel | - |

### 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=   # OAuthコールバック用（本番URL）
```

---

## MVP 実装状況（2026-02-20 時点）

### ✅ 完了済み

#### 認証
- メール/パスワード認証（Supabase Auth）
- Google OAuth（`/auth/callback` ルート実装済み）
- エラーメッセージ: 内部詳細を隠蔽し日本語で返す
- 保護ルート: `proxy.ts`（Next.js middleware 相当）で `/dashboard`, `/decks`, `/study` を保護

#### データベース
- 全テーブル作成済み（`decks`, `cards`, `card_reviews`, `study_logs`）
- RLS ポリシー設定済み（全テーブル）
- RLS パフォーマンス最適化済み: `auth.uid()` → `(SELECT auth.uid())`
- FK インデックス 8 本追加済み
- `decks.accent` カラム追加済み（マイグレーション適用済み）

#### ランディングページ（`/`）
- 未ログイン: LinguaCard のブランドページ表示
- ログイン済み: `/dashboard` へ自動リダイレクト
- ダークヒーロー（`#0F172A`）+ CSS のみのカードモックアップ
- メタデータ・OGP 設定済み
- `/sitemap.xml` 自動生成済み

#### ダッシュボード（`/dashboard`）
- ストリーク表示（`Flame` アイコン + amber、連続学習日数）
- 「今すぐ復習を始める」CTA（全デッキ一括 `/study` へ）
- 「続きから再開」ボタン（最後に学習したデッキに due カードがある場合のみ表示）
- 「次の復習まで：X時間後」表示（due ゼロ時）
- 復習があるデッキのみ一覧表示（「復習する」ボタン付き）
- 統計: 総習得数（learned/total）、今週のレビュー回数

#### デッキ一覧（`/decks`）
- 自分のデッキ一覧（並び替え: 作成日 / カード枚数 / 名前）
- 公開デッキ閲覧
- 新規デッキ作成（`/decks/new`）

#### デッキ詳細（`/decks/[id]`）
- カード一覧表示
- カードクリックで詳細モーダル（単語・読み・品詞・レベル・意味・例文3文）
- カード削除ボタン（所有者のみ）
- 復習開始ボタン

#### カード作成（`/decks/[id]/cards/new`）
- フォーム: 単語・読み方・意味・品詞・難易度（A1〜C2）
- Claude API 呼び出しで例文3文自動生成
- 例文の確認・編集・保存

#### 復習（`/decks/[id]/study`）
- SM-2 アルゴリズムで次回日時を計算（`lib/sm2.ts`）
- フラッシュカードモード + 穴埋めモード（ランダム切り替え）
- 簡単 / 普通 / 難しい の3段階評価
- study_logs への記録
- 復習完了後「もう一度復習する」「デッキに戻る」
- 最大20枚/セッション

#### 全デッキ一括復習（`/study`）
- ユーザーの全デッキから due カードを集約（最大50枚）
- 同一の StudyClient を再利用
- 完了後はダッシュボードに戻る

#### デッキ作成時のアクセント設定
- 英語: `en-US` / `en-GB` / `en-AU`
- スペイン語: `es-ES` / `es-MX` / `es-CO` / `es-AR`
- デッキの `accent` カラムに保存
- 復習時にそのアクセントで Web Speech API を使用
- フォールバック: 同言語の別アクセント → ブラウザデフォルト

### ❌ 未実装（次のスプリント候補）

| 機能 | 優先度 | 備考 |
|---|---|---|
| カード編集画面（`/decks/[id]/cards/[cardId]/edit`） | 高 | 現在は削除のみ |
| デッキ編集画面 | 中 | 現在は削除のみ |
| `cards.updated_at` カラム | 低 | スキーマ未追加 |
| `decks.cover_image_url` | 低 | スキーマ未追加 |
| 学習時間トラッキング | 中 | study_logs に duration なし |
| デッキ内カード並び替え | 低 | - |
| パスワードリセット | 中 | - |
| 通知・リマインダー | 低 | - |

---

## データベース設計（現在）

### decks

| カラム | 型 | 備考 |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | → auth.users |
| name | text | デッキ名 |
| description | text | nullable |
| language | text | `'en'` / `'es'` |
| accent | text | nullable。`'en-US'`, `'en-GB'`, `'en-AU'`, `'es-ES'`, `'es-MX'`, `'es-CO'`, `'es-AR'` |
| is_public | boolean | デフォルト false |
| created_at | timestamp | |

### cards

| カラム | 型 | 備考 |
|---|---|---|
| id | uuid PK | |
| deck_id | uuid | → decks |
| user_id | uuid | → auth.users |
| word | text | |
| reading | text | nullable |
| meaning | text | |
| part_of_speech | text | nullable |
| level | text | nullable。`'A1'`〜`'C2'` |
| examples | text[] | Claude API で生成した例文3文 |
| created_at | timestamp | |

### card_reviews（SM-2 学習状態）

| カラム | 型 | デフォルト | 備考 |
|---|---|---|---|
| id | uuid PK | | |
| card_id | uuid | | → cards |
| user_id | uuid | | → auth.users |
| ease_factor | float | 2.5 | SM-2 用 |
| interval | int | 1 | 次の復習まで何日か |
| repetitions | int | 0 | 累計復習回数 |
| next_review_at | timestamp | now() | 次の復習日 |
| last_reviewed_at | timestamp | null | |

### study_logs（学習履歴）

| カラム | 型 | 備考 |
|---|---|---|
| id | uuid PK | |
| card_id | uuid | → cards |
| deck_id | uuid | → decks |
| user_id | uuid | → auth.users |
| rating | text | `'easy'` / `'normal'` / `'hard'` |
| is_correct | boolean | |
| mode | text | `'flashcard'` / `'fill_in_blank'` |
| created_at | timestamp | |

---

## ファイル構成

```
app/
├── globals.css                    # デザイントークン（CSS変数）・Tailwind
├── layout.tsx                     # ルートレイアウト（Geist フォント・メタデータ）
├── page.tsx                       # ランディングページ（未ログイン） or /dashboard リダイレクト
├── sitemap.ts                     # /sitemap.xml 自動生成
├── api/
│   └── generate-examples/route.ts # Claude API 呼び出し（認証・バリデーション済み）
├── auth/
│   ├── page.tsx                   # ログイン・新規登録（Client Component）
│   ├── actions.ts                 # signIn / signUp / signInWithGoogle / signOut
│   └── callback/route.ts          # OAuth コールバック処理
├── dashboard/
│   └── page.tsx                   # ダッシュボード（Server Component）
├── decks/
│   ├── page.tsx                   # デッキ一覧
│   ├── actions.ts                 # createDeck / deleteDeck
│   ├── new/page.tsx               # 新規デッキ作成フォーム（Client Component）
│   └── [id]/
│       ├── page.tsx               # デッキ詳細
│       ├── cards/new/page.tsx     # カード作成（Client Component）
│       └── study/
│           ├── page.tsx           # 復習ページ（Server Component）
│           └── StudyClient.tsx    # 復習UI（Client Component）
└── study/
    └── page.tsx                   # 全デッキ一括復習（Server Component）

components/
├── CardList.tsx                   # カード一覧＋モーダル＋削除（Client Component）
├── DeckCard.tsx                   # デッキカード表示
├── DeckListSorted.tsx             # ソート付きデッキ一覧（Client Component）
├── DeckProgress.tsx               # 進捗バー
├── ProgressChart.tsx              # 正答率グラフ（現在未使用）
└── ProgressChartWrapper.tsx       # グラフの遅延ロードラッパー（現在未使用）

lib/
├── sm2.ts                         # SM-2 アルゴリズム実装
├── supabase/
│   ├── client.ts                  # ブラウザ用クライアント
│   └── server.ts                  # サーバー用クライアント
└── actions/
    ├── card-actions.ts            # createCard / deleteCard
    └── review-actions.ts          # submitReview

types/
└── database.types.ts              # Supabase 自動生成型（accent 追加済み）

proxy.ts                           # Next.js middleware（保護ルート管理）
```

---

## デザインシステム

### CSS 変数（`app/globals.css`）

```css
/* カラー */
--lc-bg: #F9FAFB;           /* ページ背景 */
--lc-surface: #FFFFFF;       /* カード背景 */
--lc-border: #E5E7EB;        /* 通常ボーダー */
--lc-border-strong: #D1D5DB; /* 強調ボーダー */
--lc-text-primary: #111827;  /* 本文（white背景で17.4:1 ✓） */
--lc-text-secondary: #374151;/* 副テキスト（7.2:1 ✓） */
--lc-text-muted: #4B5563;    /* 補助テキスト（5.74:1 ✓） */
--lc-accent: #4F46E5;        /* インディゴ・主要アクション */
--lc-accent-hover: #4338CA;
--lc-accent-light: #EEF2FF;  /* アクセントの薄背景 */
--lc-success: #059669;       /* 完了・習得 */
--lc-success-light: #ECFDF5;
--lc-danger: #DC2626;        /* エラー・削除 */
--lc-danger-light: #FEF2F2;
--lc-streak: #F59E0B;        /* ストリーク（amber） */

/* ボーダー半径 */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
```

### アイコン規約
- **Lucide React を使用**。絵文字をアイコン目的で使用禁止。
- ストリーク: `Flame`（amber）
- 学習: `BookOpen`, `Brain`, `Layers`
- 完了: `CheckCircle2`, `Trophy`
- ナビ: `ArrowRight`, `ChevronRight`, `RotateCcw`
- 音声: `Volume2`

### WCAG コントラスト
- 通常テキスト（<18px）: 4.5:1 以上必須
- 大テキスト（≥18px bold）: 3:1 以上必須
- `text-gray-500`（#6B7280）は white 背景で 3.95:1 → **使用禁止**。最低 `text-gray-600`（#4B5563）を使う

---

## アーキテクチャ原則

### Server / Client Component の使い分け

- **デフォルトは Server Component**（DB アクセス・認証・データ取得）
- `"use client"` は `useState` / `useEffect` / イベントハンドラ / ブラウザ API が必要な場合のみ
- `ANTHROPIC_API_KEY` は Server Component / Route Handler 限定。Client に渡さない

### データ取得
- Server Component 内で `async/await` 直接取得
- 並列クエリは `Promise.all` で実行（ウォーターフォール禁止）
- 変更操作は Server Actions（`lib/actions/`）か Route Handlers（`app/api/`）

### セキュリティ実装済み事項
- 全 Server Action で `supabase.auth.getUser()` による認証チェック
- `deleteDeck` / `createCard` / `deleteCard` / `submitReview`: 所有権確認あり
- Claude API Route: 認証チェック + 入力バリデーション（word長制限・言語ホワイトリスト）
- `maskWord` 関数: 正規表現メタ文字エスケープ済み
- OAuth コールバック: エラーハンドリング実装済み

### パフォーマンス実装済み事項
- Dashboard: N+1 クエリ排除（`cards(deck_id)` JOIN）
- Study page: `card_reviews(next_review_at)` JOIN で1クエリ化 + `Promise.all` 並列化
- RLS: `auth.uid()` → `(SELECT auth.uid())` に最適化
- FK インデックス: 8 本追加

---

## SM-2 アルゴリズム（`lib/sm2.ts`）

```
スコア: easy=5, normal=3, hard=1

ease_factor 更新式:
  newEF = max(1.3, EF + 0.1 - (5-q) * (0.08 + (5-q) * 0.02))

interval 更新:
  q < 3（hard）: repetitions=0, interval=1（リセット）
  rep=1: interval=1
  rep=2: interval=6
  rep≥3: interval = round(interval * newEF)
```

---

## チーム役割定義

### 各役割の担当範囲

| 役割 | 担当ファイル・領域 | 参照ドキュメント |
|---|---|---|
| **Tech Lead** | アーキテクチャ設計、DB設計、セキュリティ、パフォーマンス | CLAUDE.md 全体 |
| **UI 実装** | `components/`, `globals.css`, 各 page.tsx の JSX | CLAUDE.md > デザインシステム |
| **UX** | ユーザーフロー、アクセシビリティ、学習継続率 | `docs/ux-research.md` |
| **Product** | 機能優先順位、スプリント管理、要件定義 | `docs/sprint.md` |
| **Business** | 収益モデル、競合分析、Launch 戦略、KPI | `docs/business.md` |

### エージェント間の引き継ぎ規約
1. **作業開始前**: この CLAUDE.md を読む
2. **作業中の決定事項**: `docs/decisions.md` に追記
3. **作業完了後**: CLAUDE.md の「MVP 実装状況」を更新

---

## 意思決定ログ（主要なもの）

| 日付 | 決定事項 | 理由 |
|---|---|---|
| 2026-02 | middleware.ts → proxy.ts にリネーム | Next.js 16 で `middleware` 規約が非推奨 |
| 2026-02 | `language` 変数を廃止し `accent`（BCP-47）に統一 | en-US/en-GB 等を直接扱う方がシンプル |
| 2026-02 | 絵文字禁止・Lucide React に統一 | アクセシビリティ（スクリーンリーダー）・WCAG 対応 |
| 2026-02 | ダッシュボードから正答率グラフを削除 | 毎日見る画面に情報過多。統計は将来の専用ページへ |
| 2026-02 | 「今週の学習時間」→「今週のレビュー回数」 | study_logs に duration カラムがなく計算不可 |
| 2026-02 | デッキ別復習はダッシュボードから due デッキのみ表示 | 完了デッキの表示は不要なノイズ |

---

## Next.js ベストプラクティス（重要なもの抜粋）

```typescript
// params は Promise 型（Next.js 15+）
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// Server Action
'use server'
export async function myAction(prevState: State, formData: FormData) { ... }

// Client Component でのアクション
const [state, action, pending] = useActionState(myAction, initialState)
<form action={action}>...</form>

// キャッシュ無効化
revalidatePath('/decks')
```

**パスエイリアス:** `@/*` → プロジェクトルート

---

## Supabase プロジェクト情報

- **Project ID**: `vwseztjeiswhyuilvkqw`
- **Region**: ap-northeast-1（東京）
- **Status**: ACTIVE_HEALTHY
- Google OAuth: 有効化済み
