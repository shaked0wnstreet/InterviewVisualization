import './App.css';
import PopUpForm  from './component/PopUpForm';
import Button from '@mui/material/Button';
import { useState } from 'react';
import OverviewFlow from './component/Flow';
import json from './GameDev.json'
import APIService from './APIService';
//import {InitGraph, InsertNode, RelabelNode, UpdateNode, UpdateGraph, DeleteNode} from './APIService';


function App() {
  // const [onPopUp, setOnPopUp] = useState(false); 
  const [jsonArray, setJsonArray] = useState({
    "links":[],
    "nodes":[
      // {
      //     "id": "000",
      //     "DialogText": "Good {{greetingTime}}, {{personName}}! Thank you so much for coming in. My name is {{interviewerName}}, and I am the supervisor for this department. I will be conducting this interview for the position of a Game Developer. ",
      //     "dynamicParams": [],
      //     "staticParams": [
      //         "interviewerName",
      //         "greetingTime",
      //         "personName"
      //     ],
      //     "alternates": [
      //         "My name is {{interviewerName}}, and I am the supervisor for this department.",
      //         "My name is {{interviewerName}}, and I am the department supervisor."
      //     ],
      //     "NextDialogID": "001",
      //     "unrecognizedResponse": "I'm sorry, I don't understand.",
      //     "requireResponse": false,
      //     "userInterruptionEnabled": false,
      //     "section": "Greeting"
      // },
    ]
  })

  function start() {
    // graph already initialized
    if (jsonArray.nodes.length > 0) {
      // return graph from APIService
      // setJsonArray(GetGraph());
    }
    // new graph
    else {
      // call API function InitGraph to initialize first node
      // setJsonArray(InitGraph(newNode));
    }

  }
  const [interviewerDialogs, setInterviewerDialogs] = useState(jsonArray['nodes']);

  function onAddSubmit(nodeID, newNode) {

    // call the API to InsertNode(nodeID, newNode)
    // setJsonArray(InsertNode(nodeID, newNode));

    // call the API to RelabelNode("new_question", newNode.id)
    // setJsonArray(RelabelNode("new_question", newNode.id)); ?

  }

  function onEditSubmit(newNode) {
    // call the API to UpdateNode(newNode)
    // setJsonArray(UpdateNode(newNode)); ?
  }

  start();

  return (
    <div className="App">
      <main style={{ height: 800 }}>
        {/* <h1>React popups</h1>
        <br></br>
        <Button variant="contained" onClick={() => setOnPopUp(true)}>Open PopUp</Button>
        {onPopUp ? <PopUpForm setTrigger={setOnPopUp}/> : ''} */}
        <APIService />
        <OverviewFlow
        onAddSubmit={onAddSubmit}
        onEditSubmit={onEditSubmit}
        jsonArray={jsonArray} 
        questions={interviewerDialogs}
        setInterviewerDialogs={setInterviewerDialogs}
        />
      </main>
    </div>
  );
}
export default App;