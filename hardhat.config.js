require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = [process.env.PRIVATE_KEY];
const RPC_URL = process.env.RPC_URL;
const MUMBAI = process.env.MUMBAI;

module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: MUMBAI,
      accounts:
        process.env.PRIVATE_KEY !== undefined &&
        process.env.PRIVATE_KEY1 != undefined &&
        process.env.PRIVATE_KEY2 != undefined &&
        process.env.PRIVATE_KEY3 != undefined
          ? [
              process.env.PRIVATE_KEY,
              process.env.PRIVATE_KEY1,
              process.env.PRIVATE_KEY2,
              process.env.PRIVATE_KEY3,
            ]
          : [],
    },
  },
};
