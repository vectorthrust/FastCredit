<img width="200" alt="Screenshot 2025-05-16 at 4 48 20 AM" src="https://github.com/user-attachments/assets/18dfe512-74eb-43dc-82fc-6c759eff5937" />

# FastCredit: AI-Powered On-Chain Credit Passports

FastCredit is a decentralized, AI-driven platform that empowers unbanked and gig workers to build a verifiable, evolving financial identity on the Bahamut blockchain.

---

## ❗ Problem Statement
- **1.4 Billion Unbanked Adults Globally:** According to the World Bank, 1.4 billion adults lack access to essential financial services.
- **Gig Workers Face Credit Challenges:** Nearly half of gig workers are denied financial services due to traditional credit scoring that ignores their income patterns.
- **"Credit Invisible" Individuals:** Many are excluded from the financial system because they lack a formal credit history, making it hard to prove creditworthiness.

---

## 🚀 Deployed Contracts
- **FastCreditStaking (Bahamut Testnet):** [0x92471aD0ED84d2172eA0A3ee65dED3F17eE9DAC0 on FTNScan](https://horizon.ftnscan.com/address/0x92471aD0ED84d2172eA0A3ee65dED3F17eE9DAC0)
- **FastCredit (NFT):** `0x410035fFCd2c21f5B2a0473016A78cE5ffCF2b07`

## 🎥 Demo Video
[![Watch the demo](https://user-images.githubusercontent.com/18dfe512-74eb-43dc-82fc-6c759eff5937/your-thumbnail.png)](https://www.tella.tv/video/proving-credit-worthiness-7ghe)

[Watch the full demo on Tella](https://www.tella.tv/video/proving-credit-worthiness-7ghe)

---<img width="541" alt="Screenshot 2025-05-16 at 8 06 40 AM" src="https://github.com/user-attachments/assets/4da87f7f-df03-48bd-bf8b-56fa1007df58" />
<img width="466" alt="Screenshot 2025-05-16 at 8 06 58 AM" src="https://github.com/user-attachments/assets/32ab0c8c-dcff-4dfc-b1e2-09215974feab" />
<img width="1304" alt="Screenshot 2025-05-16 at 8 07 28 AM" src="https://github.com/user-attachments/assets/1c8deaa8-8dad-49aa-8825-9ce1f4d07b79" />
<img width="437" alt="Screenshot 2025-05-16 at 8 07 54 AM" src="https://github.com/user-attachments/assets/5b736237-e62a-4cb9-8218-c9f3d7c4e4bb" />
<img width="438" alt="Screenshot 2025-05-16 at 8 08 51 AM" src="https://github.com/user-attachments/assets/e7395828-aef6-4a70-acb7-93c943670c48" />
<img width="384" alt="Screenshot 2025-05-16 at 8 09 09 AM" src="https://github.com/user-attachments/assets/e2ff6c42-4bbc-4192-8e81-a69e8a74828f" />


## 🏆 Key Features
- **Embedded Wallets:** Seamless onboarding with Privy-powered wallets.
- **Staking for Reputation:** Users stake FTN to initiate their credit journey and receive a rank.
- **AI Income Verification:** Gemini AI verifies income docs (receipts, voice notes, etc.) for dynamic rank upgrades.
- **NFT Credit Passports:** Mintable, upgradable NFTs represent a user's financial status and evolve as more data is added.
- **EVM Compatibility:** Exportable signatures to prove credit status across any EVM dApp.

---

## 🚦 User Flow
1. **Wallet Creation & Onramp:** Instantly create an embedded wallet and onramp to FTN.
2. **Stake FTN:** Stake tokens to receive an initial (capped) credit rank.
3. **AI Verification:** Upload income documents for AI-powered verification and rank upgrades.
4. **Mint NFT Passport:** Mint your dynamic credit passport NFT.
5. **Prove Credit Anywhere:** Export a signature to prove your rank on any EVM-compatible dApp.

---

## 🛠️ Smart Contract Architecture

### FastCredit.sol
- ERC-721 NFT contract representing a user's financial identity and rank (BRONZE, SILVER, GOLD, PLATINUM, DIAMOND).
- Stores stake amount, verified income, and allows for dynamic upgrades via AI verification.
- Only authorized contracts can mint or update passports.

### PassportStaking.sol
- Users stake FTN to mint their Credit Passport NFT.
- Rank is determined by the amount staked (with thresholds for each rank).
- Allows multiple stakes per user for demo flexibility.
- Enforces a lock period before unstaking.

### AIVerifier.sol
- Handles verification of user income data through an oracle pattern.
- Integrates with backend AI (Gemini) to verify documents and update NFT rank.
- Rank can be upgraded based on verified income, never downgraded.

---

## 🌐 Technology Stack
- **Blockchain:** Bahamut (Testnet)
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin
- **AI:** Google Gemini API
- **Frontend:** Next.js, React, Privy, Ethers.js
- **Backend:** Node.js/Express (for AI verification, if running locally)

---

## 🧑‍💻 Quick Start

### Prerequisites
- Node.js and npm
- Hardhat
- Metamask wallet
- Google Gemini API key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/credit-passport.git
   cd credit-passport
   ```
2. Install dependencies:
   ```bash
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
```bash
npm run deploy -- --network bahamut_testnet
```

---

## 🖥️ Frontend
- Built with Next.js/React for a clean, minimal UI.
- Uses Privy for embedded wallet and Bahamut Testnet onboarding.
- Automatic navigation between steps: `/start/stake`, `/start/verify`, `/start/stake2`, `/start/mint`.
- Error handling for contract/network/auth issues.

To run the frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing
The project uses Hardhat for testing and deployment. To run the tests:
```bash
npx hardhat test
```

---

## 📈 Roadmap
- [x] Bahamut testnet deployment
- [x] AI-powered income verification
- [x] NFT credit passport minting
- [ ] Bahamut mainnet launch
- [ ] DeFi protocol integrations
- [ ] Mobile app & UX enhancements
- [ ] Cross-chain support
- [ ] Community governance

---

## 📸 Demo Flow & Architecture
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

## Licensing
This project is licensed under MIT License.

---

For more details, see the code and comments in the respective contract and frontend files.
