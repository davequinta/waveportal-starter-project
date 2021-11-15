const main = async () => {
  const animeContractFactory = await hre.ethers.getContractFactory('AnimePortal');
  const animeContract = await animeContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await animeContract.deployed();
  console.log('Contract addy:', animeContract.address);

  let animeCount;
  animeCount = await animeContract.getTotalAnimes();
  console.log(animeCount.toNumber());
  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    animeContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  /**
   * Let's send a few animes!
   */
  let animeTxn = await animeContract.subAnime('Gintama');
  await animeTxn.wait(); // Wait for the transaction to be mined

  let animeTxn2 = await animeContract.subAnime('Naruto');
  await animeTxn2.wait(); // Wait for the transaction to be mined


  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(animeContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await animeContract.getAllAnimes();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();