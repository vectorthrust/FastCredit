const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Credit Passport NFT
  const CreditPassport = await ethers.getContractFactory("CreditPassport");
  const creditPassport = await CreditPassport.deploy();
  await creditPassport.deployed();
  console.log("CreditPassport deployed to:", creditPassport.address);

  // For demo purposes, let's assume USDC is already deployed
  // In a real environment, you would use the actual USDC address on Bahamut
  // This is a placeholder address - replace with actual USDC contract address on Bahamut
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Replace with actual USDC address

  // Deploy Passport Staking
  const PassportStaking = await ethers.getContractFactory("PassportStaking");
  const passportStaking = await PassportStaking.deploy(
    creditPassport.address,
    usdcAddress
  );
  await passportStaking.deployed();
  console.log("PassportStaking deployed to:", passportStaking.address);

  // Deploy AI Verifier
  const AIVerifier = await ethers.getContractFactory("AIVerifier");
  const aiVerifier = await AIVerifier.deploy(creditPassport.address);
  await aiVerifier.deployed();
  console.log("AIVerifier deployed to:", aiVerifier.address);

  // Grant the AIVerifier the ability to update the passport
  const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("MINTER_ROLE")
  );
  await creditPassport.grantRole(MINTER_ROLE, passportStaking.address);
  console.log("Granted MINTER_ROLE to PassportStaking");

  // Set up oracle role for the AI verifier
  const ORACLE_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("ORACLE_ROLE")
  );
  await aiVerifier.grantRole(ORACLE_ROLE, deployer.address);
  console.log("Granted ORACLE_ROLE to deployer for AI verification");

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 