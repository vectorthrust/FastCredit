const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Bahamut testnet...");

  // Get the contract factories
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const FastCredit = await hre.ethers.getContractFactory("FastCredit");
  const FastCreditStaking = await hre.ethers.getContractFactory("FastCreditStaking");

  // Deploy MockUSDC
  console.log("Deploying MockUSDC...");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.deployed();
  console.log(`MockUSDC deployed to: ${mockUSDC.address}`);

  // Deploy FastCredit
  console.log("Deploying FastCredit...");
  const fastCredit = await FastCredit.deploy();
  await fastCredit.deployed();
  console.log(`FastCredit deployed to: ${fastCredit.address}`);

  // Deploy FastCreditStaking with references to FastCredit and MockUSDC
  console.log("Deploying FastCreditStaking...");
  const fastCreditStaking = await FastCreditStaking.deploy(fastCredit.address, mockUSDC.address);
  await fastCreditStaking.deployed();
  console.log(`FastCreditStaking deployed to: ${fastCreditStaking.address}`);

  // Grant MINTER_ROLE to the FastCreditStaking contract
  console.log("Granting MINTER_ROLE to FastCreditStaking contract...");
  const MINTER_ROLE = await fastCredit.MINTER_ROLE();
  const grantRoleTx = await fastCredit.grantRole(MINTER_ROLE, fastCreditStaking.address);
  await grantRoleTx.wait();
  console.log("MINTER_ROLE granted to FastCreditStaking contract");

  console.log("\n=== Deployment Summary ===");
  console.log(`MockUSDC: ${mockUSDC.address}`);
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