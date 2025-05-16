require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bahamut_testnet: {
      url: process.env.BAHAMUT_TESTNET_URL || "https://rpc1-horizon.bahamut.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2552,
    },
    bahamut: {
      url: process.env.BAHAMUT_MAINNET_URL || "https://rpc.bahamut.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1377,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    // For Bahamut verification, we'll need to update this once an explorer API is available
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
}; 