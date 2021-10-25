const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const animeContractFactory = await hre.ethers.getContractFactory('AnimePortal');
    const animeContract = await animeContractFactory.deploy();
    await animeContract.deployed();
  
    console.log('Contract deployed to:', animeContract.address);
    console.log('Contract deployed by:', owner.address);
  
    let animeCount;
    animeCount = await animeContract.getTotalAnimes();
  
    let animeTxn = await animeContract.subAnime();
    await animeTxn.wait();
  
    animeCount = await animeContract.getTotalAnimes();
  
    animeTxn = await animeContract.connect(randomPerson).subAnime();
    await animeTxn.wait();
  
    animeCount = await animeContract.getTotalAnimes();
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