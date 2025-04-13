'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

// Define the state structure
interface AuthState {
  message: string | null;
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  console.log('--- Login Action ---');
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('Login Data:', data);

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login Error:', error);
    return { message: error.message };
  }

  console.log('Login successful, redirecting...');
  revalidatePath('/', 'layout')
  // Redirect only on success - NOTE: redirect throws an error, so it effectively stops execution here.
  // It doesn't return the AuthState, which might be technically inconsistent but works in practice
  // because the component unmounts before needing the state.
  redirect('/')
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  console.log('--- Signup Action ---');
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('Signup Data:', data);

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup Error:', error);
    return { message: error.message };
  }

  console.log('Signup successful, email confirmation might be required...');
  return { message: 'Signup successful! Please check your email to confirm your account.' };
}