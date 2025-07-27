'use server'

import { createClient } from '@/utils/supabase/server';

export type LoginState = {
  success: null | boolean;
  message: string;
}

export async function login(previewState: LoginState, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email, 
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
    }
  })

  if (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during login.'
    }
  }

  return {
    success: true,
    message: 'E-mail enviado!'
  }
}