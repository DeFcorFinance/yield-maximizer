const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Get the Contract Factory
    const MockERC20 = await hre.ethers.getContractFactory("EETH");

    const mockERC20 = await MockERC20.deploy("ether.fi ETH", "eETH");
    // await mockERC20.deployed();

    console.log("MockERC20 deployed to:", mockERC20.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
