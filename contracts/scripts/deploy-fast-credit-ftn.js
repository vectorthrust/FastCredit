const hre = require("hardhat");

async function main() {
  // Deploy FastCredit NFT first
  const FastCredit = await hre.ethers.getContractFactory("FastCredit");
  const fastCredit = await FastCredit.deploy();
  await fastCredit.waitForDeployment();
  console.log("FastCredit deployed to:", await fastCredit.getAddress());

  // Deploy FastCreditStaking with FastCredit address
  const FastCreditStaking = await hre.ethers.getContractFactory("FastCreditStaking");
  const staking = await FastCreditStaking.deploy(await fastCredit.getAddress());
  await staking.waitForDeployment();
  console.log("FastCreditStaking deployed to:", await staking.getAddress());

  // Grant MINTER_ROLE to staking contract
  const MINTER_ROLE = await fastCredit.MINTER_ROLE();
  await fastCredit.grantRole(MINTER_ROLE, await staking.getAddress());
  console.log("Granted MINTER_ROLE to staking contract");

  // Verify contracts on explorer
  console.log("Waiting for block confirmations...");
  await fastCredit.deployTransaction.wait(5);
  await staking.deployTransaction.wait(5);

  console.log("Verifying FastCredit contract...");
  await hre.run("verify:verify", {
    address: await fastCredit.getAddress(),
    constructorArguments: [],
  });

  console.log("Verifying FastCreditStaking contract...");
  await hre.run("verify:verify", {
    address: await staking.getAddress(),
    constructorArguments: [await fastCredit.getAddress()],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 