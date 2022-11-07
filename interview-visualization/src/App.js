//import './App.css';
//import { useEffect } from 'react';
import React from "react";
import APIService from './APIService';
//import OverviewFlow from './Flow';

function App() {

  // useEffect(() => {
  //   fetch('http://localhost:5000/init', {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ "init_node" : {
  //       'id': '000',
  //       'DialogText': 'Hello', 'NextDialogueID': '', 'section': 'Greeting' }
  //        })
  //   })
  //     .then((response) => response.json())
  //     .then((data) => console.log(data));
  // }, []);


  return (
    <div className="App">
      <APIService />
    </div>
  );
}

export default App;
