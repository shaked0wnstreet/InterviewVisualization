import './App.css';
import PopUpForm  from './component/PopUpForm';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
//import OverviewFlow from './component/Flow3'; - this is the final one
import OverviewFlow from './component/Flow';

import json from './GameDev.json'
import APIService from './APIService';
import Grid from '@mui/material/Grid';
 
//import {InitGraph, InsertNode, RelabelNode, UpdateNode, UpdateGraph, DeleteNode} from './APIService';


const  App=()=> {
  // const [onPopUp, setOnPopUp] = useState(false); 
  const [jsonArray, setJsonArray] = useState('')
  const [interviewerDialogs, setInterviewerDialogs] = useState('');


  useEffect(() => {

    let init_node = {
      id: "000",
      DialogText: "Hello, nice to meet you?",
      alternates: ['Hi there', "Hello, my name is..."],
      data: {label: "Hello, nice to meet you?"},
      NextDialogID: '',
      position: {x: 200, y: 0},
      type: 'input',
      section: "Greetings"
    }
   
    fetch('http://localhost:5000/init', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT'},
    body: JSON.stringify({"init_node": init_node}),
    })
    .then((response) => response.json())
    .then((data) => {
   
      setJsonArray(data)
      setInterviewerDialogs(data['nodes'])
    })
    .catch(error => console.log(error));

  

    
  }, []);
  

  function onAddSubmit(currNode, newNode) {

    console.log("Current Selected Node", currNode)

    fetch('http://localhost:5000/insert_node', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT'},
      body: JSON.stringify({"current_node": currNode, "node_to_add": newNode}),
    })
    .then((response) => response.json())
    .then((data) => {
      //console.log("On add data", JSON.stringify(data))
      setJsonArray(data)
      setInterviewerDialogs(data['nodes'])

    })
    .catch(error => console.log(error));

  }

  function onEditSubmit(newNode) {
    // call the API to UpdateNode(newNode)
    //setJsonArray(UpdateNode(newNode));
    console.log("OnEditSubmit", JSON.stringify(newNode))
    fetch('http://localhost:5000/update_node_attrs', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({"node_to_update": newNode})
    })
    .then((response) => response.json())
    .then((data) => {
      //this.setState({graph: data});
      setJsonArray(data)
      setInterviewerDialogs(data['nodes'])

    })
    .catch(error => console.log(error));
  }

  function onDelete(nodeID){
    fetch('http://localhost:5000/delete_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_delete": nodeID})
      })
      .then((response) => response.json())
      .then((data) => {
        //this.setState({graph: data});
        // removes nodeID (DialogueID) from the running list of nodes
        //this.nodeList.splice(this.nodeList.indexOf(nodeID),1);
        setJsonArray(data)
        //@todo: get rid of the next dialog id on the previous node
        setInterviewerDialogs(data['nodes'])
      });

  }
  
  function onEdgeDelete(source, target){
    fetch('http://localhost:5000/remove_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": source, "target_node": target})
      })
      .then((response) => response.json())
      .then((data) => {
        setJsonArray(data);
      });
    }

  function onCreateEdge(source, target, label){
    fetch('http://localhost:5000/create_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": source, "target_node": target, "type": label})
      })
      .then((response) => response.json())
      .then((data) => {
        setJsonArray(data);
      });
  }
  
  


  return (
    <div className="App">

      {JSON.stringify(jsonArray)}
      <main style={{ height: window.innerHeight-50}}>
        {/* <h1>React popups</h1>
        <br></br>
        <Button variant="contained" onClick={() => setOnPopUp(true)}>Open PopUp</Button>
        {onPopUp ? <PopUpForm setTrigger={setOnPopUp}/> : ''} */}
      {jsonArray!=''?
       <OverviewFlow
        onAddSubmit={onAddSubmit}
        onEditSubmit={onEditSubmit}
        onDelete = {onDelete}
        onEdgeDelete = {onEdgeDelete}
        onCreateEdge = {onCreateEdge}
        jsonArray={jsonArray} 
        setJsonArray={setJsonArray}
        questions={interviewerDialogs}
        setInterviewerDialogs={setInterviewerDialogs}
      />: "BACKEND NOT CONNECTED"}
     </main>
    </div>
  );
}
export default App;