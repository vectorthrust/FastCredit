const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Get the contract addresses
  // NOTE: Replace these with actual deployed addresses from the deploy-all-contracts.js script
  const mockUsdcAddress = "YOUR_MOCK_USDC_ADDRESS";
  const fastCreditAddress = "YOUR_FAST_CREDIT_ADDRESS";
  const passportStakingAddress = "YOUR_PASSPORT_STAKING_ADDRESS";
  
  // Get contract instances
  const mockUSDC = await ethers.getContractAt("MockUSDC", mockUsdcAddress);
  const fastCredit = await ethers.getContractAt("FastCredit", fastCreditAddress);
  const passportStaking = await ethers.getContractAt("PassportStaking", passportStakingAddress);
  
  // Get signers
  const [deployer, user] = await ethers.getSigners();
  
  console.log("=== Testing Staking and Passport Creation ===");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`User: ${user.address}`);
  
  // Transfer some USDC to the user
  console.log("\nTransferring 100 USDC to user...");
  const usdcAmount = ethers.utils.parseUnits("100", 6); // 100 USDC with 6 decimals
  await mockUSDC.transfer(user.address, usdcAmount);
  
  // Check user balance
  const userUsdcBalance = await mockUSDC.balanceOf(user.address);
  console.log(`User USDC balance: ${ethers.utils.formatUnits(userUsdcBalance, 6)} USDC`);
  
  // Approve USDC spending by the staking contract
  console.log("\nApproving USDC for staking...");
  await mockUSDC.connect(user).approve(passportStakingAddress, usdcAmount);
  console.log("Approved USDC for staking");
  
  // Stake USDC and mint a passport
  console.log("\nStaking USDC and minting passport...");
  const stakeAmount = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals
  const initialMetadataURI = "ipfs://QmSampleMetadataURI";
  
  await passportStaking.connect(user).stake(stakeAmount, initialMetadataURI);
  console.log("Successfully staked USDC and minted passport");
  
  // Get user passport info
  const userPassportId = await fastCredit.getUserPassport(user.address);
  console.log(`\nUser passport NFT ID: ${userPassportId}`);
  
  if (userPassportId.toNumber() > 0) {
    const passportInfo = await fastCredit.getPassportInfo(userPassportId);
    const rankNames = ["NONE", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
    const rank = passportInfo[0];
    const stakeAmountFromContract = passportInfo[1];
    const verifiedIncome = passportInfo[2];
    
    console.log("=== Passport Information ===");
    console.log(`Rank: ${rankNames[rank]}`);
    console.log(`Stake Amount: ${ethers.utils.formatUnits(stakeAmountFromContract, 6)} USDC`);
    console.log(`Verified Income: ${ethers.utils.formatUnits(verifiedIncome, 0)} units`);
    console.log("============================");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 