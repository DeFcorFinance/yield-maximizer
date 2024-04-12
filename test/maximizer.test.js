const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Maximizer Contract Tests", function () {
  let maximizer, weth, owner, user, migrator, signer;
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  async function deployMaximizerFixture() {
    [owner, user, migrator, signer] = await ethers.getSigners();

    const WETH = await ethers.getContractFactory("MockERC20");
    weth = await WETH.deploy();
    const wethAddress = await weth.getAddress();

    const TokenA = await ethers.getContractFactory("MockERC20");
    const tokenA = await TokenA.deploy();
    const tokenAddress = await tokenA.getAddress();

    const Maximizer = await ethers.getContractFactory("Maximizer");
    maximizer = await Maximizer.deploy(
      signer.address,
      [tokenAddress],
      wethAddress
    );
    const maximizerAddress = await maximizer.getAddress();

    return {
      maximizer,
      weth,
      tokenA,
      owner,
      user,
      migrator,
      signer,
      tokenAddress,
      wethAddress,
      maximizerAddress,
    };
  }
  describe("Deployment", function () {
    it("should set the correct initial state", async function () {
      const { maximizer, signer, tokenAddress } = await loadFixture(
        deployMaximizerFixture
      );
      expect(await maximizer.secureSigner()).to.equal(signer.address);
      expect(await maximizer.allowedTokens(tokenAddress)).to.be.true;
    });

    it("should revert with custom error on invalid constructor arguments", async function () {
      const { signer, wethAddress } = await loadFixture(deployMaximizerFixture);
      const Maximizer = await ethers.getContractFactory("Maximizer");
      await expect(
        Maximizer.deploy(zeroAddress, [wethAddress], wethAddress)
      ).to.be.revertedWithCustomError(Maximizer, "SignerCannotBeZeroAddress");
      await expect(
        Maximizer.deploy(signer.address, [zeroAddress], wethAddress)
      ).to.be.revertedWithCustomError(Maximizer, "TokenCannotBeZeroAddress");
    });
  });

  describe("Staking", function () {
    it("should allow depositing tokens and emit the correct event", async function () {
      const { maximizer, tokenA, user, maximizerAddress, tokenAddress } =
        await loadFixture(deployMaximizerFixture);
      const depositAmount = "1";
      await tokenA.connect(user).approve(maximizerAddress, depositAmount);
      await tokenA.mint(user.address, depositAmount);

      await expect(
        maximizer
          .connect(user)
          .depositFor(tokenAddress, user.address, depositAmount)
      )
        .to.emit(maximizer, "Deposit")
        .withArgs(1, user.address, tokenAddress, depositAmount);

      expect(await maximizer.balances(tokenAddress, user.address)).to.equal(
        depositAmount
      );
    });

    it("should reject deposits for non-allowed tokens", async function () {
      const { maximizer, user, wethAddress, weth, maximizerAddress } =
        await loadFixture(deployMaximizerFixture);
      const depositAmount = "5";
      await weth.connect(user).approve(maximizerAddress, depositAmount);
      await weth.mint(user.address, depositAmount);
      await expect(
        maximizer
          .connect(user)
          .depositFor(wethAddress, user.address, depositAmount)
      ).to.be.revertedWithCustomError(
        maximizer,
        "TokenNotAllowedForMaximizeYields"
      );
    });
  });

  describe("Withdrawals", function () {
    it("should allow users to withdraw their tokens and emit Withdraw event", async function () {
      const { maximizer, tokenA, user, maximizerAddress, tokenAddress } =
        await loadFixture(deployMaximizerFixture);
      const depositAmount = "10";
      await tokenA.connect(user).approve(maximizerAddress, depositAmount);
      await tokenA.mint(user.address, depositAmount);
      await maximizer
        .connect(user)
        .depositFor(tokenAddress, user.address, depositAmount);

      await expect(
        maximizer.connect(user).withdraw(tokenAddress, depositAmount)
      )
        .to.emit(maximizer, "Withdraw")
        .withArgs(2, user.address, tokenAddress, depositAmount);

      expect(await tokenA.balanceOf(user.address)).to.equal(depositAmount);
      expect(await maximizer.balances(tokenAddress, user.address)).to.equal(0);
    });
  });

  describe("Administrative Actions", function () {
    it("should allow the owner to update secure signer and emit event", async function () {
      const { maximizer, owner } = await loadFixture(deployMaximizerFixture);
      const newSigner = ethers.Wallet.createRandom();

      await expect(maximizer.connect(owner).setsecureSigner(newSigner.address))
        .to.emit(maximizer, "SignerChanged")
        .withArgs(newSigner.address);

      expect(await maximizer.secureSigner()).to.equal(newSigner.address);
    });

    it("should allow the owner to toggle token staking ability", async function () {
      const { maximizer, owner, tokenA, tokenAddress } = await loadFixture(
        deployMaximizerFixture
      );

      await expect(maximizer.connect(owner).setStakable(tokenAddress, false))
        .to.emit(maximizer, "TokenStakabilityChanged")
        .withArgs(tokenAddress, false);

      expect(await maximizer.allowedTokens(tokenAddress)).to.be.false;
    });
  });
});
