'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CardWithForm() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const router = useRouter();

  // Auto-redirect after login + wallet creation
  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      router.push('/start/onramp'); // redirect after wallet is ready
    }
  }, [ready, authenticated, user?.wallet?.address, router]);

  if (!ready) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="text-xl">Loading authentication...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center mb-20">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-center">
          <b>Fast</b>Credit
          <img
            src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
            alt="icon"
            className="inline-block w-6 h-6 align-super ml-1 mb-1"
          />
        </h1>

        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {authenticated
                ? `Welcome ${user?.email?.address || 'User'}`
                : 'Sign up with Email'}
            </CardTitle>
            <CardDescription>
              {authenticated
                ? 'Setting up your wallet...'
                : 'Login to continue using FastCredit.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {!authenticated ? (
              <Button onClick={login}>Login with Email</Button>
            ) : (
              <Button variant="outline" onClick={logout}>
                Cancel Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
