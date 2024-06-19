const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MaximizerModule", (m) => {

  const Maximizer = m.contract("Maximizer", 
    [
         "0xeB1F1A741f62CCe4F0F55640E7CdF324d70Ff08C",
        [
            "0xae78736cd615f374d3085123a210448e74fc6393", // rETH
            "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // stETH
            "0x4c9edd5852cd905f086c759e8383e09bff1e68b3", // USDe
            "0x9d39a5de30e57443bff2a8307a4256c8797a3497", // sUSDe
            "0xbe9895146f7af43049ca1c1ae358b0541ea49704", // cbETH
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // wETH
            "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // wstETH
            "0x35fA164735182de50811E8e2E824cFb9B6118ac2", // eETH
            "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110", // ezETH
            "0xd9a442856c234a39a81a089c06451ebaa4306a72"  // puffETH
        ],
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    ]
  );

  return { Maximizer };
});