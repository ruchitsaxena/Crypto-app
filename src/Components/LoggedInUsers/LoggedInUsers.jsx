import React, { useState, useEffect, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
  Button, Typography, Avatar, Dialog, DialogContent, DialogActions
} from '@mui/material';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'changePercent', direction: 'desc' });

  useEffect(() => {
    const socket = new WebSocket('wss://fawss.pi42.com/socket.io/?EIO=4&transport=websocket');
    socket.onopen = () => socket.send('40');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data.slice(2))[1];
      setCryptos(Object.entries(data).map(([key, value]) => ({
        symbol: key,
        iconUrl: renderSymbolImage(key),
        lastPrice: value.lastPrice,
        changePercent: parseFloat(value.priceChangePercent),
        volume: value.baseAssetVolume,
        high: value.marketPrice,
        low: value.lastPrice
      })));
    };
    socket.onerror = error => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket connection closed');
    return () => socket.close();
  }, []);

  const renderSymbolImage = symbolName => symbolName ? `https://pi42.com/_next/image?url=https://storage.googleapis.com/pi42-dev-static/contract-icons/${symbolName.replace(/INR/g, '').toLowerCase()}.png&w=16&q=75` : '/crypto.png';

  const requestSort = key => {
    setSortConfig(prevSortConfig => ({
      key,
      direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  const getComparator = (key, direction) => direction === 'desc' ? (a, b) => a[key] < b[key] ? 1 : -1 : (a, b) => a[key] > b[key] ? 1 : -1;
  
  const sortedCryptos = useMemo(() => {
    if (!sortConfig.key) return cryptos;
    return [...cryptos].sort(getComparator(sortConfig.key, sortConfig.direction));
  }, [cryptos, sortConfig]);


  const formatCurrency = value => `₹${value !== undefined && value !== null ? value.toLocaleString('en-IN') : '0'}`;
  const formatVolume = value => value >= 1e7 ? `${(value / 1e7).toFixed(2)} Cr` : value >= 1e5 ? `${(value / 1e5).toFixed(2)} L` : value.toString();
  const handleRowClick = (crypto) => {
    setSelectedCrypto(crypto);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }; 
  return (
    <>
      <TableContainer component={Paper} sx={{
        bgcolor: '#100022', width: 'full', border: '1px solid #007FFF',  borderRadius: '45px', border: '5px solid grey',
        fontFamily: '"Ubuntu", sans-serif', fontWeight: 400, fontStyle: 'normal', '& th, & td': { fontFamily: '"Ubuntu", sans-serif', fontWeight: 400, fontStyle: 'normal' },
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'purple', '& th': { border: 0 } }}>
              <TableCell sx={{ color: 'white' }}>Symbol</TableCell>
              <TableCell sx={{ color: 'white' }}>Symbol name</TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => requestSort('lastPrice')}>
                Last price {sortConfig.key === 'lastPrice' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => requestSort('changePercent')}>
                24 hour change % {sortConfig.key === 'changePercent' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>24 hour volume</TableCell>
              <TableCell sx={{ color: 'white' }}>24 hour high</TableCell>
              <TableCell sx={{ color: 'white' }}>24 hour low</TableCell>
              <TableCell sx={{ color: 'white' }}>Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCryptos.map((crypto, index) => (
              <TableRow onClick={() => handleRowClick(crypto)} key={index} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }, '& td, & th': { borderBottom: 'none' } }}>
                <TableCell><Avatar src={crypto.iconUrl} alt={crypto.symbol} sx={{ width: 20, height: 20 }} /></TableCell>
                <TableCell sx={{ color: 'white' }}>{crypto.symbol}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.lastPrice)}</TableCell>
                <TableCell sx={{ color: crypto.changePercent >= 0 ? '#32CD32' : '#fc3434' }}>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>{crypto.changePercent.toFixed(2)}%</Typography>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{formatVolume(crypto.volume)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.high)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.low)}</TableCell>
                <TableCell><Button variant="outlined" color="secondary" onClick={() => handleShare(crypto)}>Share</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCrypto && (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(15px) saturate(180%)', WebkitBackdropFilter: 'blur(8px) saturate(180%)', color: '#fff', width: '80%', maxWidth: '600px' } }}>
          <DialogContent>
        
            <Typography variant="h6" gutterBottom align="center" color="common.white">Welcome to Pi42! Today's update on {selectedCrypto?.symbol}.</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6} sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" color="common.white"><strong>Symbol name:</strong> {selectedCrypto?.symbol}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>Last price:</strong> ₹{selectedCrypto?.lastPrice}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24 hour change percentage:</strong> {selectedCrypto?.changePercent.toFixed(2)}%</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24 hour volume:</strong> {selectedCrypto?.volume}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24h hour high:</strong> ₹{selectedCrypto?.high}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24h hour low:</strong> ₹{selectedCrypto?.low}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions><Button onClick={handleClose} color="primary" variant="outlined">Close</Button></DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CryptoTable;
