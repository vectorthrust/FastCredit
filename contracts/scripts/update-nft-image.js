// Script to update an existing NFT with new metadata
const hre = require("hardhat");
require("dotenv").config();

// Sample NFT metadata with the new image URL
const newMetadata = {
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
  console.log("Updating NFT as:", deployer.address);
  
  // Get contract instance
  const FastCredit = await hre.ethers.getContractFactory("FastCredit");
  const nft = FastCredit.attach(contractAddress);
  
  // Get the user's passport ID
  const passportId = await nft.getUserPassport(deployer.address);
  console.log("Updating NFT with ID:", passportId.toString());
  
  if (passportId.toString() === "0") {
    console.error("No passport found for this address");
    return;
  }
  
  // In a production environment, you would upload this JSON to IPFS first
  // For this example, we'll use a hardcoded metadata URI that you would replace with your actual hosted metadata
  // You can use Pinata, NFT.Storage, or other IPFS hosting services to host your metadata
  const metadataURI = "https://green-biological-junglefowl-327.mypinata.cloud/ipfs/YOUR_METADATA_CID_HERE";
  
  console.log("Updating NFT with metadata URI:", metadataURI);
  console.log("This metadata points to image:", newMetadata.image);
  
  // Get current passport info
  const [currentRank, stakeAmount, verifiedIncome] = await nft.getPassportInfo(passportId);
  
  // Update passport with same rank and income, but new URI
  const tx = await nft.updatePassport(
    passportId,
    currentRank,    // Keep the same rank
    0,              // No additional income
    metadataURI     // New metadata URI
  );

  await tx.wait();
  console.log("NFT metadata updated successfully!");
  
  console.log("View on Bahamut Testnet Explorer:");
  console.log(`https://testnet-explorer.bahamut.io/address/${contractAddress}`);
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 