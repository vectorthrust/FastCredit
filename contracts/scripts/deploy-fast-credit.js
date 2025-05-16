const hre = require("hardhat");

async function main() {
  console.log("Deploying FastCredit contracts to Bahamut testnet...");

  // Define USDC address - use an existing one or deploy a mock
  // For Bahamut testnet, we'll deploy our own mock
  console.log("Deploying MockUSDC for testnet...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.deployed();
  console.log(`MockUSDC deployed to: ${mockUSDC.address}`);
  const usdcAddress = mockUSDC.address;

  // Deploy FastCredit - using fully qualified name to avoid ambiguity
  console.log("Deploying FastCredit...");
  const FastCredit = await hre.ethers.getContractFactory("contracts/FastCredit.sol:FastCredit");
  const fastCredit = await FastCredit.deploy();
  await fastCredit.deployed();
  console.log(`FastCredit deployed to: ${fastCredit.address}`);

  // Deploy FastCreditStaking with references to FastCredit and USDC
  console.log("Deploying FastCreditStaking...");
  const FastCreditStaking = await hre.ethers.getContractFactory("FastCreditStaking");
  const fastCreditStaking = await FastCreditStaking.deploy(fastCredit.address, usdcAddress);
  await fastCreditStaking.deployed();
  console.log(`FastCreditStaking deployed to: ${fastCreditStaking.address}`);

  // Grant MINTER_ROLE to the FastCreditStaking contract
  console.log("Granting MINTER_ROLE to FastCreditStaking contract...");
  const MINTER_ROLE = await fastCredit.MINTER_ROLE();
  const grantRoleTx = await fastCredit.grantRole(MINTER_ROLE, fastCreditStaking.address);
  await grantRoleTx.wait();
  console.log("MINTER_ROLE granted to FastCreditStaking contract");

  console.log("\n=== Deployment Summary ===");
  console.log(`USDC: ${usdcAddress}`);
  console.log(`FastCredit: ${fastCredit.address}`);
  console.log(`FastCreditStaking: ${fastCreditStaking.address}`);
  console.log("========================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 