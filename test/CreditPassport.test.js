const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditPassport", function () {
  let CreditPassport;
  let creditPassport;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the CreditPassport contract
    CreditPassport = await ethers.getContractFactory("CreditPassport");
    creditPassport = await CreditPassport.deploy();
    await creditPassport.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await creditPassport.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await creditPassport.name()).to.equal("Credit Passport");
      expect(await creditPassport.symbol()).to.equal("CPASS");
    });
  });

  describe("Passport Creation and Updates", function () {
    it("Should create a new passport", async function () {
      const initialScore = 400;
      const initialIncome = ethers.utils.parseUnits("1000", 6); // 1000 USDC
      const uri = "ipfs://test";

      await creditPassport.createPassport(user1.address, initialScore, initialIncome, uri);

      const passportId = await creditPassport.getUserPassport(user1.address);
      expect(passportId).to.be.gt(0);

      const [score, income] = await creditPassport.getPassportInfo(passportId);
      expect(score).to.equal(initialScore);
      expect(income).to.equal(initialIncome);
    });

    it("Should not allow creating multiple passports for the same user", async function () {
      const initialScore = 400;
      const initialIncome = ethers.utils.parseUnits("1000", 6);
      const uri = "ipfs://test";

      await creditPassport.createPassport(user1.address, initialScore, initialIncome, uri);

      await expect(
        creditPassport.createPassport(user1.address, initialScore, initialIncome, uri)
      ).to.be.revertedWith("User already has a credit passport");
    });

    it("Should update an existing passport", async function () {
      const initialScore = 400;
      const initialIncome = ethers.utils.parseUnits("1000", 6);
      const uri = "ipfs://test";

      await creditPassport.createPassport(user1.address, initialScore, initialIncome, uri);
      const passportId = await creditPassport.getUserPassport(user1.address);

      const newScore = 500;
      const additionalIncome = ethers.utils.parseUnits("500", 6);
      const newUri = "ipfs://test-updated";

      await creditPassport.updatePassport(passportId, newScore, additionalIncome, newUri);

      const [score, income] = await creditPassport.getPassportInfo(passportId);
      expect(score).to.equal(newScore);
      expect(income).to.equal(initialIncome.add(additionalIncome));
    });
  });

  describe("Passport Tiers", function () {
    it("Should return the correct tier based on credit score", async function () {
      // Bronze tier (score < 500)
      await creditPassport.createPassport(
        user1.address, 
        400, 
        ethers.utils.parseUnits("1000", 6), 
        "ipfs://test1"
      );
      const passportId1 = await creditPassport.getUserPassport(user1.address);
      expect(await creditPassport.getPassportTier(passportId1)).to.equal(1);

      // Silver tier (500 <= score < 700)
      await creditPassport.createPassport(
        user2.address, 
        600, 
        ethers.utils.parseUnits("2000", 6), 
        "ipfs://test2"
      );
      const passportId2 = await creditPassport.getUserPassport(user2.address);
      expect(await creditPassport.getPassportTier(passportId2)).to.equal(2);
      
      // Update to Gold tier (score >= 700)
      await creditPassport.updatePassport(
        passportId2, 
        750, 
        ethers.utils.parseUnits("1000", 6), 
        "ipfs://test2-updated"
      );
      expect(await creditPassport.getPassportTier(passportId2)).to.equal(3);
    });
  });
}); 