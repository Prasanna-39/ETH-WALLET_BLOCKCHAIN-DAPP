import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const daiTokenAddress = "0x7232e51A9C2dA779DF815139FCCfac94Cf2a1042" // Replace DAI Address Here
    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({ daiTokenMock: daiTokenMock })
    const balance = await daiTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  transfer(recipient, amount) {
    this.state.daiTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      daiTokenMock: null,
      balance: 0,
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div>
        
        {/* <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow" >
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crypto Wallet
          </a>
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            About us
          </a>
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="trade.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trade Crypto
          </a>
        </nav> */}
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={daiLogo} width="150" />
                </a>
                <h1 style={{color:'white'}}>{this.state.balance} DAI</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                  this.transfer(recipient, amount)
                }}>
                  <div className="form-group mr-sm-2" style={{
                     width:'auto',
                     height:'auto',margin:'auto'
                  }}>
                    <input
                      id="recipient"
                      style={{ 
                        border: '3px solid black',
                        borderRadius: '30px'
                       }}
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <h1></h1>
                  <div className="form-group mr-sm-2">
                    <input
                    
                      id="amount"
                      style={{ 
                        border: '3px solid black',
                        borderRadius: '30px'
                       }}
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-block" style={{ 
                        border: '3px solid black',
                        borderRadius: '30px',
                        width:'121px',
                        marginLeft:'35%',
                        marginRight:'25%',
                       }}>Send</button>
                </form>
                <h1></h1>
                <h1></h1>
                <h1 style={{color:'white'}} className="glow">Crypto Transaction Volume</h1>
                <h1></h1>
                <h1></h1>
                <br></br>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{color:'white'}} scope="col">Recipient Public Address</th>
                      <th style={{color:'white'}} scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody style={{color:'white'}}>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
          
                </table>
                <h1></h1>
                <h1></h1>
              </div>
            </main>
          </div>
        </div>
        <h1></h1>
        

                       
        
      </div>
    );
  }
}

export default App;