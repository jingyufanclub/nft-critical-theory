import React from 'react';
import XUMM from 'xumm-sdk';

class XUMMWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
  }

  componentDidMount() {
    XUMM.createWallet({
      success: (address) => {
        this.setState({
          address: address
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  render() {
    return (
      <div>
        <h1>XUMM Wallet Integration</h1>
        <p>Your wallet address is: {this.state.address}</p>
      </div>
    );
  }
}

export default XUMMWallet;