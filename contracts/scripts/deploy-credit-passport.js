// We require the Hardhat Runtime Environment explicitly here
const hre = require("hardhat");

async function main() {
  // Get the network
  const network = await hre.ethers.provider.getNetwork();
  console.log("Deploying Credit Passport ecosystem to", network.name);
  
  // Get the ContractFactory for all contracts
  const CreditPassport = await hre.ethers.getContractFactory("CreditPassport");
  const PassportStaking = await hre.ethers.getContractFactory("PassportStaking");
  const AIVerifier = await hre.ethers.getContractFactory("AIVerifier");
  
  // For testnet, we need to deploy a mock USDC token if not available
  let usdcAddress;
  // minor change
  if (network.chainId === 1422) { // Bahamut testnet
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    
    await mockUSDC.deployed();
    console.log("Mock USDC deployed to:", mockUSDC.address);
    
    usdcAddress = mockUSDC.address;
  } else {
    // On mainnet, use the actual USDC address
    // Replace with actual USDC address on Bahamut when available
    usdcAddress = process.env.USDC_ADDRESS;
    
    if (!usdcAddress) {
      console.error("USDC_ADDRESS environment variable not set");
      return;
    }
  }
  
  // 1. Deploy CreditPassport
  console.log("Deploying CreditPassport...");
  const creditPassport = await CreditPassport.deploy();
  await creditPassport.deployed();
  console.log("CreditPassport deployed to:", creditPassport.address);
  
  // 2. Deploy PassportStaking
  console.log("Deploying PassportStaking...");
  const passportStaking = await PassportStaking.deploy(
    creditPassport.address,
    usdcAddress
  );
  await passportStaking.deployed();
  console.log("PassportStaking deployed to:", passportStaking.address);
  
  // 3. Deploy AIVerifier
  console.log("Deploying AIVerifier...");
  const aiVerifier = await AIVerifier.deploy(creditPassport.address);
  await aiVerifier.deployed();
  console.log("AIVerifier deployed to:", aiVerifier.address);
  
  // Grant roles
  console.log("Setting up roles...");
  
  // Grant MINTER_ROLE to PassportStaking
  const MINTER_ROLE = await creditPassport.MINTER_ROLE();
  await creditPassport.grantRole(MINTER_ROLE, passportStaking.address);
  console.log("Granted MINTER_ROLE to PassportStaking");
  
  // Grant MINTER_ROLE to AIVerifier
  await creditPassport.grantRole(MINTER_ROLE, aiVerifier.address);
  console.log("Granted MINTER_ROLE to AIVerifier");
  
  console.log("Deployment complete!");
  console.log({
    creditPassport: creditPassport.address,
    passportStaking: passportStaking.address,
    aiVerifier: aiVerifier.address,
    usdc: usdcAddress
  });
}

// Pattern to use with any command-line tool
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 