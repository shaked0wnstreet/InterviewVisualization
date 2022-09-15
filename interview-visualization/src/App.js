import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [flaskData, setFlaskData] = useState();

  useEffect(() => {
    fetch('/message').then(res => res.json()).then(data => {
      setFlaskData(data.message);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {flaskData}
        </p>
      </header>
    </div>
  );
}

export default App;
