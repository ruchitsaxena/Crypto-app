import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    
    const socket = new WebSocket('wss://fawss.pi42.com/socket.io/?EIO=4&transport=websocket');

    // open connection
    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Send exactly "40" to the server
      socket.send('40');
    };

    
    socket.onmessage = (event) => {
      console.log('Received:', event.data);
    };

    // for errors
    socket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    // closure
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>Test</h1>
      <p>Check WebSocket server</p>
    </div>
  );
}

export default App;
