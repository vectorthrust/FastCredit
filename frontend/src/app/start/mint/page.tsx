'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSendTransaction, usePrivy } from '@privy-io/react-auth';
import { Interface, ethers } from 'ethers';
import { IoDiamondOutline } from 'react-icons/io5';

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
          <img
            src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
            alt="icon"
            className="inline-block w-6 h-6 align-super ml-1 mb-1"
          />
        </h1>
        <Card className="w-[400px] max-w-full overflow-hidden gap-2 relative">
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
                <div className="text-green-600 font-medium mb-2">Your credit passport is now on-chain!</div>

                              <Card className="w-full border border-gray-200 p-4 pb-3">
                                {/* Badge Container with continuous spin animation */}
                                <div className="relative w-56 h-56 mx-auto flex items-center justify-center perspective-badge">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {/* This div creates a 3D container for the spinning badge */}
                                    <div className="badge-3d-container relative w-full h-full flex items-center justify-center">
                                      {/* Outer Ring */}
                                      <div className="absolute w-full h-full rounded-full border-4 border-cyan-200 bg-cyan-50 opacity-50"></div>
                
                                      {/* Inner Medal - Centered Circle */}
                                      <div className="absolute w-3/5 h-3/5 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg flex items-center justify-center">
                                        {/* Rating Letter */}
                                        <span className="text-7xl font-bold text-white">
                                            <IoDiamondOutline/>
                                        </span>
                                      </div>
                
                                      {/* Shine Effect */}
                                      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white opacity-10 rounded-full blur-md"></div>
                                    </div>
                                  </div>
                                </div>
                
                                {/* Rating Text */}
                                <div className=" text-center">
                                  <h3 className="text-2xl font-bold text-cyan-600">Diamond</h3>
                                  <p className="text-gray-500 mt-1">Your credit score is in the top 10%</p>
                                </div>
                                
                                {/* Simple footer */}
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                                  <h1 className="text-medium text-black font-bold tracking-tight text-center">
                                    <b>Fast</b>Credit
                                    <img
                                        src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
                                        alt="icon"
                                        className="inline-block w-2 h-2 align-super"
                                    />
                                    </h1>
                                  <span>0xcec...005f</span>
                                </div>
                              </Card>
                              <style jsx>{`
            .perspective-badge {
              perspective: 1000px;
            }
            
            .badge-3d-container {
              transform-style: preserve-3d;
              animation: spin 8s linear infinite;
            }
            
            @keyframes spin {
              0% {
                transform: rotateY(0deg);
              }
              100% {
                transform: rotateY(360deg);
              }
            }
          `}</style>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 