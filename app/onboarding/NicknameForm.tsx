'use client'

import { useActionState } from 'react'
import { setNickname } from '@/lib/actions/profile-actions'

const initialState = { error: null }

export default function NicknameForm() {
  const [state, action, pending] = useActionState(setNickname, initialState)

  return (
    <form action={action} className="space-y-4">
      <div>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          maxLength={20}
          autoFocus
          className="w-full px-4 py-3 text-base text-center focus:outline-none focus:ring-2"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--lc-text-primary)',
            fontSize: '1.125rem',
          }}
          placeholder="例：taro"
        />
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--lc-text-muted)' }}>
          20文字以内 ・ あとから変更はできません
        </p>
      </div>

      {state.error && (
        <p
          className="text-sm px-4 py-2 text-center"
          style={{
            color: 'var(--lc-danger)',
            background: 'var(--lc-danger-light)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
      >
        {pending ? '保存中...' : 'はじめる'}
      </button>
    </form>
  )
}
