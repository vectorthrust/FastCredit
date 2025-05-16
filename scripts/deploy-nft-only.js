// Deploy only the FastCredit NFT contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying FastCredit NFT to Bahamut testnet");
  
  // Get the ContractFactory
  const FastCredit = await hre.ethers.getContractFactory("FastCredit");
  
  // Deploy FastCredit
  console.log("Deploying FastCredit...");
  const fastCredit = await FastCredit.deploy();
  await fastCredit.deployed();
  
  console.log("FastCredit deployed to:", fastCredit.address);
  
  // Mint a test NFT (optional)
  console.log("If you want to mint a test NFT, run this command:");
  console.log(`npx hardhat run scripts/mint-test-nft.js --network bahamut_testnet`);
  console.log("Make sure to set the CONTRACT_ADDRESS in your .env file to:", fastCredit.address);
}

// Run the deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 