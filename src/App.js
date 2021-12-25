import React, { useState } from 'react';

import { CssBaseline, Box, TextField, Button, Container, Stack, Typography } from '@mui/material';

import { ethers, providers } from 'ethers';

import erc20abi from './erc20abi.json';

import WalletConnectProvider from "@walletconnect/web3-provider";

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  infuraId: process.env.REACT_APP_INFURA_ID,
});

const web3Provider = new providers.Web3Provider(provider);

const connectWallet = async () => {
  //  Enable session (triggers QR Code modal)
  await provider.enable();
}

const disconnectWallet = async () => {
  //  Enable session (triggers QR Code modal)
  await provider.disconnect();
}


function App() {
  const [user, setUser] = useState('');
  const [wallet, setWallet] = useState('');
  const [isDisconnect, setIsDisconnect] = useState(
    localStorage.getItem("IS_DISCONNECT") || 'isDisconnect'
  );


  provider.on("accountsChanged", (accounts) => {
    setWallet(accounts[0]);
  });

  provider.on("disconnect", (code, reason) => {
    setWallet('account disconnected')
  });

  const handleConnect = async () => {
    setIsDisconnect('isDisconnect')
    localStorage.setItem('IS_DISCONNECT', 'isDisconnect')
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setUser(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDisconnect = () => {
    setIsDisconnect('!isDisconnect')
    localStorage.setItem('IS_DISCONNECT', '!isDisconnect')
  }

  const trade = (event) => {
    const hexValue = ethers.utils.parseEther('0.01', 'eth');
    console.log(hexValue._hex);
    event.preventDefault();
    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: user,
            to: process.env.REACT_APP_ETH_ORIGINAL_ACCOUNT,
            value: hexValue._hex,
          },
        ],
      })
      .catch((error) => console.error);
  }

  const handleTranfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log(signer);
    const erc20 = new ethers.Contract(process.env.REACT_APP_CONTRACT_URL, erc20abi, signer);
    await erc20.transfer(process.env.REACT_APP_ETH_RECEIVER, ethers.utils.parseUnits('30', 18));
  }

  return (
    <div className="App">
      <CssBaseline />
      <Container sx={{ marginTop: 2 }} maxWidth='lg'>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="flex-start"
        >
          <Button onClick={handleConnect} variant='contained' size='large'>Connect</Button>
          <Button onClick={connectWallet} variant='outlined' size='large'>Connect Wallet</Button>
          <Button onClick={handleTranfer} variant='contained' size='large'>Send Token</Button>
          <Button onClick={handleDisconnect} variant='outlined' size='large'>{localStorage.getItem("IS_DISCONNECT") === '!isDisconnect'?'connect':'disconnect'}</Button>
          <Button onClick={disconnectWallet} variant='outlined' color='error' size='large'>disconnect wallet</Button>
        </Stack>
        <Typography variant='h6' color='text.secondary' textAlign='center'>{wallet}</Typography>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={trade} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Ethereum"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Token"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Hit to trade!!
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;
