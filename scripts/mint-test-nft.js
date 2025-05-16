// Script to mint a test NFT
const hre = require("hardhat");
require("dotenv").config();

// Sample NFT metadata (replace with your own hosted image)
const sampleMetadata = {
  name: "FastCredit - GOLD",
  description: "Financial identity passport with GOLD rank",
  image: "https://green-biological-junglefowl-327.mypinata.cloud/ipfs/bafkreiamtwrvnnicvqgfhjomts4gkrxdwwcfirwexq35xhlrwcwsvis6vy",
  attributes: [
    {"trait_type": "Rank", "value": "GOLD"},
    {"trait_type": "Stake Amount", "value": 100},
    {"trait_type": "Verified Income", "value": 10000}
  ]
};

async function main() {
  // Get the NFT contract address from .env
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS in .env file");
    return;
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Minting NFT as:", deployer.address);
  
  // Get contract instance
  const FastCredit = await hre.ethers.getContractFactory("FastCredit");
  const nft = FastCredit.attach(contractAddress);
  
  // For this example, we'll use a hardcoded metadata URI
  // In production, you would host this JSON on IPFS or another decentralized storage
  const metadataURI = "https://bafkreia5vbbwbat6j3rtudwjqzf2nzp3gaxwmf5sql7ytpocvvr6bogfk4.ipfs.nftstorage.link/";
  
  console.log("Minting NFT with metadata:", metadataURI);
  
  // Create passport for the deployer
  const tx = await nft.createPassport(
    deployer.address,          // User address
    2,                         // Rank.GOLD (enum value 2)
    hre.ethers.utils.parseUnits("100", 6), // 100 USDC stake amount
    hre.ethers.utils.parseUnits("10000", 6), // 10,000 verified income
    metadataURI                // Metadata URI
  );

  await tx.wait();
  
  // Get the user's passport
  const passportId = await nft.getUserPassport(deployer.address);
  console.log("Minted NFT with ID:", passportId.toString());
  
  console.log("View on Bahamut Testnet Explorer:");
  console.log(`https://testnet-explorer.bahamut.io/address/${contractAddress}`);
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 