'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useSendTransaction, usePrivy } from '@privy-io/react-auth';
import { Interface, ethers } from 'ethers';

const STAKING_CONTRACT_ADDRESS = '0x92471aD0ED84d2172eA0A3ee65dED3F17eE9DAC0';
const STAKING_ABI = [
  "function stake(string initialMetadataURI) public payable"
];

export default function Stake2Page() {
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();
  const { ready, authenticated, login } = usePrivy();
  const [staked, setStaked] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [isLoading, setIsLoading] = useState(false);

  const handleStake = async () => {
    setIsLoading(true);
    try {
      const iface = new Interface(STAKING_ABI);
      await sendTransaction({
        to: STAKING_CONTRACT_ADDRESS,
        value: ethers.parseEther(stakeAmount).toString(),
        data: iface.encodeFunctionData('stake', ["ipfs://QmInitialMetadata"]),
      });
      setStaked(true);
      setTimeout(() => router.push('/start/mint'), 1200);
    } catch (error) {
      console.error('Staking error:', error);
      alert('Transaction failed!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading authentication...</div>;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-center">
          <b>Fast</b>Credit
        </h1>
        <Card className="w-[400px] max-w-full overflow-hidden gap-2 relative pb-0">
          <CardHeader className="z-10">
            <CardTitle className="text-2xl">Stake FTN (Upgrade)</CardTitle>
            <CardDescription>
              Stake again to unlock a higher rank after AI verification.<br />
              The more you stake, the higher your rank!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
            {!authenticated ? (
              <button
                onClick={login}
                className="px-4 py-2 rounded font-medium w-full text-sm transition-colors bg-pink-500 text-white hover:bg-pink-400"
              >
                Login to continue
              </button>
            ) : !staked ? (
              <>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Stake Amount (FTN)
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0.05"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Minimum: 0.05 FTN (Bronze)<br />
                    Silver: 0.1 FTN<br />
                    Gold: 0.2 FTN<br />
                    Platinum: 0.5 FTN<br />
                    Diamond: 1 FTN
                  </div>
                </div>
                <button
                  onClick={handleStake}
                  disabled={isLoading}
                  className="px-4 py-2 rounded font-medium w-full text-sm transition-colors bg-pink-500 text-white hover:bg-pink-400 disabled:opacity-50"
                >
                  {isLoading ? 'Staking...' : `Stake ${stakeAmount} FTN`}
                </button>
              </>
            ) : (
              <div className="w-full text-center">
                <div className="font-semibold mb-1">Staked: <b>{stakeAmount} FTN</b></div>
                <div className="mb-2">Transaction sent!</div>
                <div className="text-green-600 font-medium mb-4">Redirecting to mint...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 