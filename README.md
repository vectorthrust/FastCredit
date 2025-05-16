# FastCredit

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
