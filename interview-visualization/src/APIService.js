import React from "react";
import { Component } from "react";
import json from './GameDev.json';

var newNodes = [];
//var nodeList = [];
for (var i = 0; i < json["interviewerDialogs"].length; i++) {
  var obj = {};
  // obj.id = String(Number(json["interviewerDialogs"][i]["id"].slice(-3)) + 1);
  obj.id = json["interviewerDialogs"][i].id;
  obj.DialogText = json["interviewerDialogs"][i].DialogText;
  obj.staticParams = json["interviewerDialogs"][i].staticParams;
  obj.dynamicParms = json["interviewerDialogs"][i].dynamicParms;
  obj.alternates = json["interviewerDialogs"][i].alternates;
  obj.NextDialogID = json["interviewerDialogs"][i].NextDialogID;
  obj.unrecognizedResponse = json["interviewerDialogs"][i].unrecognizedResponse;
  obj.requireResponse = json["interviewerDialogs"][i].requireResponse;
  obj.userInterruptionEnabled = json["interviewerDialogs"][i].userInterruptionEnabled;
  obj.section = json["interviewerDialogs"][i].section;

  newNodes.push(obj);
}

export default class APIService extends Component{

    constructor(props){
        super(props);
        this.testVar=true;
        this.nodeList=[];
        this.state={
            graph: "",
            node_exists: false
        }
    }

    InitGraph(nodeInfo){
      fetch('http://localhost:5000/init', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': true,
          'Access-Control-Allow-Methods': 'GET, POST, PUT'},
        body: JSON.stringify({"init_node": nodeInfo}),
       })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
        this.nodeList.push(nodeInfo.id);
      })
      .catch(error => console.log(error));
    };

    InsertNode(currNode,nodeInfo){
      fetch('http://localhost:5000/insert_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT'},
        body: JSON.stringify({"current_node": currNode, "node_to_add": nodeInfo}),
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
        this.nodeList.push(nodeInfo.id);
      })
      .catch(error => console.log(error));
    };
    
    InsertYesNo(currNode,nodeInfo){
      fetch('http://localhost:5000/insert_yes_or_no', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"current_node": currNode, "yes_dialogue":nodeInfo})
      })
        .then((response) => response.json())
        .then((data) => {
         this.setState({node_exists: data})
     });
    };

    CreateEdge(sourceNode,targetNode,type){
      fetch('http://localhost:5000/create_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": sourceNode, "target_node": targetNode, "type": type})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data})
      });
    };

    DeleteNode(nodeID){
      fetch('http://localhost:5000/delete_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_delete": nodeID})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
        this.nodeList.splice(this.nodeList.indexOf(nodeID),1);
      });
    };

    RemoveEdge(sourceNode,targetNode){
      fetch('http://localhost:5000/remove_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": sourceNode, "target": targetNode})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data})
      });
    };

    ExistsNode(nodeName){
      fetch('http://localhost:5000/exists_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_check": nodeName})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({node_exists: data})
      });
    };

    RelabelNode(oldID, newID){
      fetch('http://localhost:5000/relabel_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_relabel": oldID, "relabel_to": newID})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data})
      });
    };

    UpdateNode(nodeInfo){
      fetch('http://localhost:5000/update_node_attrs', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_update":nodeInfo})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data})
      });
    };

     ResetGraph() {
        fetch('http://localhost:5000/reset', {
             method: 'GET',
             headers: {'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': true,
            }
         })
         .then((response) => response.json())
         .then((data) => {
            this.setState({graph: data})
         });
     };

    render() {
      if (this.testVar) {
        // initializes the first 6 nodes from GameDev.json
        for (var i = 0; i < 6; i++) {
          if (!this.nodeList.includes(newNodes[0].id)) {
            if (i===0)
              this.InitGraph(newNodes[i]);
            else {
              this.InsertNode(newNodes[i-1].id,newNodes[i]);
              this.RelabelNode("new_question",newNodes[i].id);
            }
          }
        }
        console.log(this.nodeList);
        this.testVar = false;
      }  

      return (
        <div>
          {JSON.stringify(this.state.graph)}
        </div>)
    }
}