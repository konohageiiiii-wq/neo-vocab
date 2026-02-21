'use client'

import { useActionState, useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { updateNickname } from '@/lib/actions/profile-actions'

const initialState = { error: null, success: false }

export default function SettingsForm({ currentNickname }: { currentNickname: string }) {
  const [state, action, pending] = useActionState(updateNickname, initialState)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.success && inputRef.current) {
      inputRef.current.blur()
    }
  }, [state.success])

  return (
    <form action={action} className="space-y-3">
      <input
        ref={inputRef}
        id="nickname"
        name="nickname"
        type="text"
        required
        maxLength={20}
        defaultValue={currentNickname}
        className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2"
        style={{
          background: 'var(--lc-bg)',
          border: '1px solid var(--lc-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--lc-text-primary)',
        }}
      />
      <p className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>
        20文字以内
      </p>

      {state.error && (
        <p
          className="text-sm px-3 py-2"
          style={{
            color: 'var(--lc-danger)',
            background: 'var(--lc-danger-light)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <div
          className="flex items-center gap-2 text-sm px-3 py-2"
          style={{
            color: 'var(--lc-success)',
            background: 'var(--lc-success-light)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <CheckCircle2 size={14} />
          保存しました
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
      >
        {pending ? '保存中...' : '変更を保存'}
      </button>
    </form>
  )
}
