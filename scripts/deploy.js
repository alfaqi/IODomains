const { ethers } = require("hardhat");
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// deployer: 0xB0739AaF97B5F12D3529ec6C109fbE1A9c9F6bAe
// more expencife
// The contract deployed at: 0x697251869619dB4Bd5d18EfC58d5C59865cD8bB7
// less expencife
// The contract deployed at: 0xed9a61cD30FA445F2ed0f01Dde685fab7B190632 

// 0x9d5523b1e26A23A2dCa0B93a0971c9b374D7d595
async function main() {
  // Setup accounts and variabes
  const [deployer] = await ethers.getSigners();
  const NAME = 'IODomains';
  const SYMBOL = 'IOD';

  console.log(`deployer: ${deployer.address}`);
  
  // Deploy the contract
  const IODomains = await ethers.getContractFactory('IODomains');
  const iodomains = await IODomains.deploy(NAME, SYMBOL);
  await iodomains.deployed();

  console.log(`The contract deployed at: ${iodomains.address}`);
  
  //Listing new domains
  const names = ['jack.eth', 'john.eth', 'oxygen.eth', 'files.eth', 'io.eth'];
  const cost = [tokens(0.005), tokens(0.005), tokens(0.03), tokens(0.04), tokens(0.02)];

  for (let i = 0; i < names.length; i++) {
    const transaction = await iodomains.connect(deployer).list(names[i], cost[i]);
    await transaction.wait();

    console.log(`Listed domain ${i + 1}: ${names[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
