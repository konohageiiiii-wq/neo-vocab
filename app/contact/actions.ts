'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactState = { success: boolean; error: string | null }

export async function sendContactEmail(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name    = (formData.get('name')    as string)?.trim()
  const email   = (formData.get('email')   as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  // バリデーション
  if (!name || !email || !message) {
    return { success: false, error: 'すべての項目を入力してください。' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'メールアドレスの形式が正しくありません。' }
  }
  if (name.length > 100) {
    return { success: false, error: 'お名前は100文字以内で入力してください。' }
  }
  if (message.length > 3000) {
    return { success: false, error: 'メッセージは3000文字以内で入力してください。' }
  }

  const toEmail = process.env.CONTACT_EMAIL
  if (!toEmail) {
    return { success: false, error: '送信設定が未構成です。管理者にお問い合わせください。' }
  }

  try {
    const { error } = await resend.emails.send({
      // Resend でドメイン検証後は自分のドメインに変更してください
      // 例: 'NeoVocab <noreply@yourdomain.com>'
      from: 'NeoVocab Contact <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `【NeoVocab お問い合わせ】${name} 様より`,
      text: [
        `お名前: ${name}`,
        `メールアドレス: ${email}`,
        '',
        '--- メッセージ ---',
        message,
      ].join('\n'),
    })

    if (error) throw new Error(error.message)
    return { success: true, error: null }
  } catch {
    return { success: false, error: '送信に失敗しました。しばらくしてから再度お試しください。' }
  }
}
