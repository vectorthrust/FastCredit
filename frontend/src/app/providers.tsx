'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { defineChain } from 'viem';

export const bahamutTestnet = defineChain({
  id: 2552,
  name: 'Bahamut Testnet',
  network: 'bahamut-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Fastex',
    symbol: 'FTN',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc1-horizon.bahamut.io'],
    },
  },
  blockExplorers: {
    default: { name: 'BahamutScan', url: 'https://testnet.bahamutscan.com/' },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmaqbhp6i03eqjx0mngwuxa8a"
      config={{
        loginMethods: ['email'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: bahamutTestnet,
        supportedChains: [bahamutTestnet],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
