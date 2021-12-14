import React, { useState, useEffect } from 'react';

import { CssBaseline, Box, TextField, Button, Container, Stack } from '@mui/material';

import { ethers } from 'ethers';

import erc20abi from './erc20abi.json';


function App() {
  const [user, setUser] = useState('');

  const handleConnect = async () => {
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

  const trade = (event) => {
    const hexValue = ethers.utils.parseEther('0.01','eth');
    console.log(hexValue._hex);
    event.preventDefault();
    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: user,
            to: '0xEc6AC176057cB44e382f14004aE2B4271aeFfdF2',
            value: hexValue._hex,
          },
        ],
      })
      .then((txHash) => {
        console.log(txHash)
        window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: user,
            to: '0xEc6AC176057cB44e382f14004aE2B4271aeFfdF2',
            value: hexValue._hex,
            data: '0x884DD532D8ff99926F757Dec11F460F3e7414954',
          },
        ],
      })
      })
      .catch((error) => console.error);
  }

  const handleTranfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log(signer);
    const erc20 = new ethers.Contract('0x884DD532D8ff99926F757Dec11F460F3e7414954' , erc20abi, signer);
    await erc20.transfer('0x6B733BDCdcB04EE6Cc21a3c32B0E9AF9D2D9Cc71', ethers.utils.parseUnits('30', 18));
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
          <Button onClick={handleTranfer} variant='contained' size='large'>Send Token</Button>
          <Button variant='outlined' size='large'>disconnect</Button>
        </Stack>
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
