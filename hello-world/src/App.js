import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [flaskMessage, setFlaskMessage] = useState();

  useEffect(() => {
    fetch('/text').then(res => res.json()).then(data => {
      setFlaskMessage(data.text);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {flaskMessage}
        </p>
      </header>
    </div>
  );
}

export default App;
