'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSendTransaction, usePrivy } from '@privy-io/react-auth';
import { Interface, ethers } from 'ethers';

const FAST_CREDIT_CONTRACT_ADDRESS = '0x410035fFCd2c21f5B2a0473016A78cE5ffCF2b07';
const FAST_CREDIT_ABI = [
  "function createPassport(address user, uint8 initialRank, uint256 stakeAmount, uint256 initialIncome, string memory uri) public returns (uint256)"
];

const RANK = 'DIAMOND';
const MINT_PRICE = 0.4; // in FTN
const NFT_IMAGE = 'https://placehold.co/300x300/EEE/31343C?text=FastCredit+NFT'; // Placeholder image

export default function MintPage() {
  const { ready, authenticated, login } = usePrivy();
  const [minted, setMinted] = useState(false);

  // Simulate minting as already done after staking
  const handleMint = async () => {
    setMinted(true);
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
            <CardTitle className="text-2xl">Mint Credit Passport</CardTitle>
            <CardDescription>
              Mint your FastCredit NFT to start building your on-chain credit history.<br />
              Your rank: <b>DIAMOND</b>
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
            ) : !minted ? (
              <button
                onClick={handleMint}
                className="px-4 py-2 rounded font-medium w-full text-sm transition-colors bg-pink-500 text-white hover:bg-pink-400"
              >
                Mint NFT 
              </button>
            ) : (
              <div className="w-full text-center">
                <div className="font-semibold mb-1">NFT Minted Successfully!</div>
                <div className="mb-2">Rank: <b>DIAMOND</b></div>
                <div className="text-green-600 font-medium">Your credit passport is now on-chain!</div>
                <img src={NFT_IMAGE} alt="NFT" className="rounded w-40 h-40 object-cover border mt-4 mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 