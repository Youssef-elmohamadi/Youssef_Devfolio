import SignInForm from '@/app/[locale]/(admin)/components/loginForm'
import { setRequestLocale } from 'next-intl/server';
import React from 'react'

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div><SignInForm/></div>
  )
}