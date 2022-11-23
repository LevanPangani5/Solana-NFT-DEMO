import React, { useEffect, useState } from "react";

// We are loading thee gids for our project
const TEST_GIF = [
  "https://media.giphy.com/media/WJ1fD3sUvJcIb8nfdE/giphy.gif",
  "https://media.giphy.com/media/g96QRNjWUvdKw/giphy.gif",
  "https://media.giphy.com/media/VAkJTA16wGopjslhaA/giphy.gif",
];
const Index = () => {
  //state
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("null");
  const [gifList, setGifList] = useState([]);

  //actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom Wallet found");
          const response = await solana.connect({ onlyIfTrysted: true });
          console.log("connected with public key", response.public?.toString());
          setWalletAddress(response.public.toString());
        }
      } else {
        alert("Solana object not found Phantom wallet is not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key", response.public?.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif Link", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue(" ");
    } else {
      console.log("empty input");
    }
  };

  const renderNotConnectContainer = () => {
    return <button onClick={connectWallet}>Connect to Wallet</button>;
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const renderConnectedContainer = () => {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendGif();
          }}
        >
          <input value={inputValue} onChange={onInputChange} />
          <button type="submit">Submit</button>
          <div>
            {gifList.map((gif) => (
              <div key={gif}>
                <img src={gif} alt={gif} />
              </div>
            ))}
          </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("fetching Gif list");
      setGifList(TEST_GIF);
    }
  }, [walletAddress]);

  return (
    <div>
      <p>View your GIF collection</p>
      {!walletAddress && renderNotConnectContainer()}
      {walletAddress && renderConnectedContainer()}
    </div>
  );
};

export default Index;