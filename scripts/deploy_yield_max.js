const hre = require("hardhat");

async function main() {
    // Get the Contract Factory
    const Maximizer = await hre.ethers.getContractFactory("Maximizer");

    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const maximizer = await Maximizer.deploy(
        deployer.address,
        ["0xb84c7570eB756A5Da3398Bd9Dd20684Ce0b6713D"],
        "0xcEF306C54cAE794e2571d6465080C00882501d59"
    );
    // await maximizer.deployed();

    console.log("Maximizer deployed to:", maximizer.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
