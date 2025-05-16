<img width="200" alt="Screenshot 2025-05-16 at 4 48 20 AM" src="https://github.com/user-attachments/assets/18dfe512-74eb-43dc-82fc-6c759eff5937" />

## FastCredit
FastCredit is an AI-powered financial identity system built on the Bahamut blockchain that provides unbanked and gig workers with a verifiable financial passport.

## Overview

Credit Passport is a decentralized solution that helps gig workers and unbanked individuals establish a verifiable financial identity. The system uses AI to verify income data from various sources (receipts, voice notes, etc.) and mints a unique NFT "credit passport" that evolves over time as users add more proof of income.

## Problem Statement

- **1.4 Billion Unbanked Adults Globally**: According to the World Bank, approximately 1.4 billion adults worldwide remain unbanked, lacking access to essential financial services.
- **Gig Workers Face Credit Challenges**: Nearly half (48.9%) of gig workers have been denied access to financial services they could afford, primarily due to traditional credit scoring systems that don't account for their income patterns.
- **"Credit Invisible" Individuals**: Many gig workers are labeled as "credit invisible" because they lack traditional credit histories.

## Solution

Our Credit Passport system enables gig workers and unbanked individuals to establish a verifiable financial identity:

1. **Income Verification via AI**: Users can upload receipts or voice notes detailing their income. Gemini AI processes and verifies this information.
2. **Accessible Staking**: Users stake a small amount of USDC, demonstrating financial commitment.
3. **Minting Credit NFTs**: A smart contract on Bahamut mints a unique NFT "credit passport" encapsulating the user's income summary and a basic reputation score.
4. **Building Financial Identity**: Over time, as users add more income proof, their NFT evolves, serving as a dynamic, on-chain financial identity.

## Smart Contracts

The system comprises three key smart contracts:

### 1. FastCredit.sol

An NFT contract representing the user's financial identity, using a 5-tier rank system:
- BRONZE
- SILVER
- GOLD
- PLATINUM
- DIAMOND

### 2. PassportStaking.sol

Allows users to stake USDC to create their FastCredit passport. The rank is determined by:
- Stake amount - Users stake USDC once to create their passport
- Income verification - Users can improve their rank through verified income

### 3. AIVerifier.sol

A placeholder contract for AI-based income verification where the frontend team will implement document verification processes.

## Technology Stack

- **Blockchain**: Bahamut
- **Smart Contracts**: Solidity
- **Development Environment**: Hardhat
- **AI**: Google Gemini AI
- **Frontend**: React (not included in this repository)

## Getting Started

### Prerequisites

- Node.js and npm
- Hardhat
- Metamask wallet
- Google Gemini API key

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/credit-passport.git
cd credit-passport
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file with the following variables:
```
PRIVATE_KEY=your_private_key
BAHAMUT_TESTNET_URL=https://bahamut-testnet-rpc.ontheweb3.com
BAHAMUT_MAINNET_URL=https://bahamut-rpc.ontheweb3.com
GEMINI_API_KEY=your_gemini_api_key
```

### Deployment

Deploy to Bahamut testnet:
```
npm run deploy -- --network bahamut_testnet
```

## Deployment

The contracts are deployed on the Bahamut Horizon testnet (Chain ID: 2552).

### Deployment Steps

1. Deploy FastCredit.sol
2. Deploy MockUSDC.sol (for testing) or use an existing USDC token
3. Deploy PassportStaking.sol with FastCredit and USDC addresses
4. Deploy AIVerifier.sol with FastCredit address
5. Grant MINTER_ROLE to both PassportStaking and AIVerifier contracts

## Frontend

The frontend directory contains a minimal structure for the frontend team to implement the user interface.

## Testing

The project uses Hardhat for testing and deployment. To run the tests:

```
npx hardhat test
```

## Licensing

This project is licensed under MIT License.

# FastCredit Demo

## Deployed Contract Addresses (Bahamut Testnet)
- **FastCredit (NFT):** `0x410035fFCd2c21f5B2a0473016A78cE5ffCF2b07`
- **FastCreditStaking:** `0x92471aD0ED84d2172eA0A3ee65dED3F17eE9DAC0`

---

## Product Flow & Architecture

**FastCredit** is a hybrid onchain/offchain credit passport system powered by AI and staking, designed for seamless user onboarding and demoability.

### Demo Flow
1. **Stake FTN (Capped):**
   - User stakes FTN (native token) to get an initial credit rank (up to SILVER).
   - Contract: `FastCreditStaking`.
   - UI: `/start/stake`.
2. **AI Document Verification:**
   - User uploads income documents (file/camera).
   - Gemini AI verifies docs and suggests a new rank.
   - UI: `/start/verify`.
3. **Stake Again (Uncapped):**
   - User is prompted to stake 0.4 FTN (or more) to unlock DIAMOND rank.
   - UI: `/start/stake2`.
4. **Mint NFT:**
   - User mints their FastCredit NFT, reflecting their final, AI-verified rank and staked amount.
   - NFT is minted onchain, visible on explorer.
   - UI: `/start/mint`.

### Key Features
- **Staking Contract:**
  - Allows multiple stakes per user (for demo flexibility).
  - Mints a new NFT on every stake.
  - Uses FTN (native) for staking.
- **NFT Contract:**
  - No longer restricts to one NFT per user (for demo).
  - Stores rank, stake amount, and verified income.
- **AI Verification:**
  - Gemini AI runs on backend, verifies uploaded docs, and suggests rank.
- **Frontend:**
  - Built with Next.js/React, minimal and clean UI.
  - Uses Privy for embedded wallet and Bahamut Testnet.
  - Automatic navigation between steps.
  - Error handling for contract/network/auth issues.

### Architecture
- **Contracts:** Solidity, OpenZeppelin, deployed to Bahamut Testnet.
- **Frontend:** Next.js, Privy, Ethers.js for contract calls.
- **Backend:** Node.js/Express (for AI verification, if running locally).

---

## Quick Start
1. Connect wallet (Privy embedded, Bahamut Testnet).
2. Stake FTN to get started.
3. Upload docs for AI verification.
4. Stake again to unlock higher rank.
5. Mint your FastCredit NFT and view on explorer.

---

For more details, see the code and comments in the respective contract and frontend files.
