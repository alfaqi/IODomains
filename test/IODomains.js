const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("IODomains", () => {
  let IODomains, iodomains, result, transaction
  let deployer, owner

  const ID = 1;
  const NAME = 'Jack.eth';
  const AMOUNT = tokens(10);

  beforeEach(async () => {
    // Setup accounts
    [deployer, owner] = await ethers.getSigners();

    // Deploy the contract
    IODomains = await ethers.getContractFactory('IODomains');
    iodomains = await IODomains.deploy('IODomains', 'IOD');
    
    // Listing a new domain
    transaction = await iodomains.connect(deployer).list(NAME, AMOUNT)
    await transaction.wait()
  })

  describe('Deplyment', async () => {
    it('Has a name', async () => {
      expect(await iodomains.name()).to.equal('IODomains')
    })

    it('Has a symbol', async () => {
      expect(await iodomains.symbol()).to.equal('IOD')
    })

    it('Sets a deployer', async () => {
      expect(await iodomains.owner()).to.equal(deployer.address)
    })

    it('Returns max supply', async () => {
      expect(await iodomains.maxSupply()).to.equal(1)
    })

    it('Returns total supply', async () => {
      expect(await iodomains.totalSupply()).to.equal(0)
    })
  })

  describe('Domain', () => {
    it('Returns domain attriburtes', async () => {
      let domain = await iodomains.getDomain(ID)
      expect(domain.name).to.equal(NAME)
      expect(domain.cost).to.equal(AMOUNT)
      expect(domain.isOwned).to.equal(false)
    })
  })

  describe('Minting', () => {
    beforeEach(async () => {
      transaction = await iodomains.connect(owner).mint(ID, { value: AMOUNT });
      await transaction.wait()
    })

    it('Updates the owner', async () => {
      expect(await iodomains.ownerOf(ID)).to.equal(owner.address);
    })

    it('Updates the domain status', async () => {
      const doamin = await iodomains.getDomain(ID);
      expect(doamin.isOwned).to.equal(true);
    })

    it('Updates the contract balance', async () => {
      expect(await iodomains.getBalance()).to.equal(AMOUNT)
    })

    it('Updates the total supply', async () => {
      expect(await iodomains.totalSupply()).to.equal(1);
    })
  })

  describe('Withdrawing', () => {
    let balanceBefore
    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      transaction = await iodomains.connect(owner).mint(ID, { value: AMOUNT });
      await transaction.wait()

      transaction = await iodomains.connect(deployer).withdraw();
      await transaction.wait();

    })
    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      expect(await iodomains.getBalance()).to.equal(0);
    })

  })
})
