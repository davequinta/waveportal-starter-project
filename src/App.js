import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/AnimePortal.json'

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const contractAddress = "0x96b6373f2CD673D859B57B1831928D670b787599";
  const contractABI = abi.abi

  const [currentAccount, setCurrentAccount] = useState("");
  const [animeCount, setAnimeCount] = useState("");

  const [allAnimes, setAllAnimes] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllAnimes();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      
    } catch (error) {
      console.log(error)
    }
  }
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalAnimes();
        console.log("Retrieved total animes count...", count.toNumber());
        
        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.subAnime('Gintama',{ gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalAnimes();
        setAnimeCount(count)
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}


  /*
   * Create a method that gets all waves from your contract
   */
  const getAllAnimes = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllAnimes();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            anime: wave.anime,
          };
        });

        /*
         * Store our data in React State
         */
        setAllAnimes(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    let wavePortalContract;
  
    const onNewAnime = (from, timestamp, anime) => {
      console.log('NewWave', from, timestamp, anime);
      setAllAnimes(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          anime: anime,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewAnime);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewAnime);
      }
    };
  }, []);
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
         <h1> Hey there! <span role="img" aria-label="cool">😎</span> </h1>
        </div>

        <div className="bio" >
        <h3> I'm Dave, a developer from El Salvador! 
        Connect your Ethereum wallet and tell me your fav anime!</h3>
        </div>

        <button className="button-36" onClick={wave}>
          Drop your fav anime! <span role="img" aria-label="below">👇</span>
        </button>
         {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="button-38" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {allAnimes.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Anime: {wave.anime}</div>
            </div>)
        })}      </div>
    </div>
  );
}
