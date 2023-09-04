require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
let ALCHEMY_API_KEY = fs.readFileSync(".infura").toString().trim();
let GOERLI_PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: './public/artifacts'
  },
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  }
};
