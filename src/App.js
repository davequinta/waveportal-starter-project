import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/AnimePortal.json'

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const contractAddress = "0xfEA762fcFfF6f05Bc1A0806F9bc1B2bF82fFeD0E";
  const contractABI = abi.abi

  const [currentAccount, setCurrentAccount] = useState("");
  
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
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

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
      </div>
    </div>
  );
}
