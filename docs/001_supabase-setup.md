# 001 Supabase セットアップ・DB設計

Supabaseプロジェクトの作成とテーブル・RLSポリシーの設定。
後続の全チケットの前提となる。

---

## TODO

### プロジェクト作成
- [ ] Supabase でプロジェクトを新規作成する
- [ ] `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を記載する

### テーブル作成

#### decks
- [ ] `id` uuid PK (default: `gen_random_uuid()`)
- [ ] `user_id` uuid（→ auth.users）
- [ ] `description` text
- [ ] `language` text NOT NULL（'en' / 'es'）
- [ ] `is_public` boolean NOT NULL default false
- [ ] `created_at` timestamptz NOT NULL default now()

#### cards
- [ ] `id` uuid PK (default: `gen_random_uuid()`)
- [ ] `deck_id` uuid NOT NULL（→ decks）
- [ ] `user_id` uuid NOT NULL（→ auth.users）
- [ ] `word` text NOT NULL
- [ ] `reading` text
- [ ] `meaning` text NOT NULL
- [ ] `part_of_speech` text
- [ ] `level` text（'A1'〜'C2'）
- [ ] `examples` text[] default '{}'
- [ ] `created_at` timestamptz NOT NULL default now()

#### card_reviews
- [ ] `id` uuid PK (default: `gen_random_uuid()`)
- [ ] `card_id` uuid NOT NULL（→ cards）
- [ ] `user_id` uuid NOT NULL（→ auth.users）
- [ ] `ease_factor` float8 NOT NULL default 2.5
- [ ] `interval` int4 NOT NULL default 1
- [ ] `repetitions` int4 NOT NULL default 0
- [ ] `next_review_at` timestamptz NOT NULL default now()
- [ ] `last_reviewed_at` timestamptz

#### study_logs
- [ ] `id` uuid PK (default: `gen_random_uuid()`)
- [ ] `card_id` uuid NOT NULL（→ cards）
- [ ] `deck_id` uuid NOT NULL（→ decks）
- [ ] `user_id` uuid NOT NULL（→ auth.users）
- [ ] `rating` text NOT NULL（'easy' / 'normal' / 'hard'）
- [ ] `is_correct` boolean NOT NULL
- [ ] `mode` text NOT NULL（'flashcard' / 'fill_in_blank'）
- [ ] `created_at` timestamptz NOT NULL default now()

### RLS（Row Level Security）ポリシー

- [ ] 全テーブルで RLS を有効化する
- [ ] `decks`: SELECT は `is_public = true` または `user_id = auth.uid()` を許可
- [ ] `decks`: INSERT / UPDATE / DELETE は `user_id = auth.uid()` のみ許可
- [ ] `cards`: SELECT / INSERT / UPDATE / DELETE は `user_id = auth.uid()` のみ許可
- [ ] `card_reviews`: SELECT / INSERT / UPDATE は `user_id = auth.uid()` のみ許可
- [ ] `study_logs`: SELECT / INSERT は `user_id = auth.uid()` のみ許可

### 型生成
- [ ] `npx supabase gen types typescript --project-id <project-id> > types/database.types.ts` で型ファイルを生成する
