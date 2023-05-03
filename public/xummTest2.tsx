import React, { useState } from "react";

const {XummSdk} = require('xumm-sdk');
const Sdk = new XummSdk('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26', '433b70d4-35b9-473f-abf8-30f37ccdca40');

//bs from chat-gpt
//import XUMMWallet from "xumm-wallet-connector";

const ConnectXUMMWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = () => {
    const xummWallet = new XUMMWallet();
    xummWallet
      .connect()
      .then(wallet => {
        setWallet(wallet);
      })
      .catch(err => {
        setError(err);
      });
  };

  return (
    <div>
      {wallet ? (
        <div>
          <h2>You have successfully connected your XUMM wallet!</h2>
        </div>
      ) : (
        <div>
          <h2>Connect your XUMM wallet</h2>
          <button onClick={connectWallet}>Connect wallet</button>
          {error ? <div>{error.message}</div> : null}
        </div>
      )}
    </div>
  );
};

export default ConnectXUMMWallet;