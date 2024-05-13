const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Maximizer Deposit on Forked Mainnet", function () {
    let maximizer;
    let maximizerAddress;
    let deployer, user;
    const mainnetAccount = "0x00000000219ab540356cBB839Cbe05303d7705Fa";
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    let weth, owner, migrator, signer, eventId;

    before(async function () {
        [deployer] = await ethers.getSigners();

        const WETH = await ethers.getContractFactory("MockERC20");
        weth = await WETH.deploy();
        //const wethAddress = await weth.getAddress();

        const TokenA = await ethers.getContractFactory("MockERC20");
        const tokenA = await TokenA.deploy();
        const tokenAddress = await tokenA.getAddress();

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0x00000000219ab540356cBB839Cbe05303d7705Fa"],
        });
        user = await ethers.getSigner(mainnetAccount);

        // Check and if necessary, send ETH to the impersonated account
        const balance = await ethers.provider.getBalance(mainnetAccount);
        console.log(`Current balance:`, balance);

        const Maximizer = await ethers.getContractFactory("Maximizer", deployer);
        maximizer = await Maximizer.deploy(
            user.address,
            [tokenAddress, wethAddress],
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        );
        maximizerAddress = await maximizer.getAddress();
        console.log("await maximizer.getAddress():", maximizerAddress);
    });

    it("should allow ETH deposit from an impersonated account", async function () {
        const depositAmount = "100";
        console.log(2);
        // await maximizer.unpause();

        await expect(
            user.sendTransaction({
                to: maximizerAddress,
                value: depositAmount,
                data: maximizer.interface.encodeFunctionData("depositETHFor", [
                    user.address,
                ]),
            })
        )
            .to.emit(maximizer, "Deposit")
            .withArgs(1, user.address, wethAddress, depositAmount);
        const internalBalance = await maximizer.balances(wethAddress, user.address);
        console.log("internalBalance:", internalBalance);
        expect(internalBalance).to.equal(depositAmount);
    });

    after(async function () {
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [mainnetAccount],
        });
    });
});
