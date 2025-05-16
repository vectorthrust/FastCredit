'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePrivy, useSignMessage } from '@privy-io/react-auth';

const RANK = 'DIAMOND';
const NFT_ID = '#5678';
const VERIFIED_INCOME = '$12,000';

export default function ProofPage() {
  const { user, ready, authenticated, login } = usePrivy();
  const { signMessage } = useSignMessage();
  const [signature, setSignature] = useState<string | null>(null);
  const [signedMsg, setSignedMsg] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = async () => {
    setIsSigning(true);
    try {
      const address = user?.wallet?.address || '0x...';
      const msg = `I own FastCredit NFT ${NFT_ID} on Bahamut (0x410035fFCd2c21f5B2a0473016A78cE5ffCF2b07), rank: ${RANK}.\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const sig = await signMessage({ message: msg });
      setSignedMsg(msg);
      setSignature(sig.signature);
    } catch (e) {
      setSignature('Signing cancelled or failed.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-center">
          <b>Fast</b>Credit
        </h1>
        <Card className="w-[400px] max-w-full overflow-hidden gap-2 relative pb-0">
          <CardHeader className="z-10">
            <CardTitle className="text-2xl">Credit Passport</CardTitle>
            <CardDescription>
              Your on-chain credit credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">NFT ID:</span>
                <span className="font-medium">{NFT_ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Rank:</span>
                <span className="font-medium">{RANK}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified Income:</span>
                <span className="font-medium">{VERIFIED_INCOME}</span>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded font-medium w-full text-sm transition-colors bg-pink-500 text-white hover:bg-pink-400"
              onClick={handleSign}
              disabled={isSigning || !authenticated}
            >
              {isSigning ? 'Signing...' : 'Export Proof (Sign Message)'}
            </button>
            {signedMsg && signature && (
              <div className="w-full mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Signed Message:</label>
                <textarea
                  className="w-full p-2 border rounded text-xs font-mono bg-gray-50"
                  rows={4}
                  value={signedMsg}
                  readOnly
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Signature:</label>
                <textarea
                  className="w-full p-2 border rounded text-xs font-mono bg-gray-50"
                  rows={2}
                  value={signature}
                  readOnly
                />
              </div>
            )}
            <div className="flex gap-2 mt-4">
             
              <button className="px-4 py-2 rounded font-medium w-full text-sm transition-colors border border-pink-500 text-pink-500 hover:bg-pink-50">
                Verify Proof
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 