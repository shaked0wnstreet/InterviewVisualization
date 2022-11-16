import React from "react";
import { Component } from "react";

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
    // nodeInfo - JSON dialogue object
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

    // currNode - string DialogueID of the node you are connecting the new node from
    // nodeInfo - JSON dialogue object
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
    
    // currNode - string DialogueID of the node you are connecting the new node from
    // yesNode - JSON dialogue object for yes_dialogue
    // noNode - JSON dialogue object for no_dialogue
    InsertYesNo(currNode,yesNode, noNode){
      fetch('http://localhost:5000/insert_yes_or_no', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"current_node": currNode, "yes_dialogue": { yesNode, "no_dialogue": noNode }})
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({graph: data});
     });
    };

    // sourceNode - string DialogueID of the node you are creating the new edge from
    // targetNode - string DialogueID of the node you are connecting the new edge to
    // type - string to specify the type of dialogue edge (followup/positive/negative) 
    CreateEdge(sourceNode,targetNode,type){
      fetch('http://localhost:5000/create_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": sourceNode, "target_node": targetNode, "type": type})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
      });
    };

    // nodeID - string DialogueID of the node that is to be deleted
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
        // removes nodeID (DialogueID) from the running list of nodes
        this.nodeList.splice(this.nodeList.indexOf(nodeID),1);
      });
    };

    // sourceNode - string DialogueID of the node where the edge begins
    // targetNode - string DialogueID of the node where the edge ends
    RemoveEdge(sourceNode,targetNode){
      fetch('http://localhost:5000/remove_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": sourceNode, "target_node": targetNode})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
      });
    };

    // nodeName - string DialogueID of the node you are querying
    // returns true if node exists, false if node does not exist
    ExistsNode(nodeName){
      fetch('http://localhost:5000/exists_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_check": nodeName})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({node_exists: data});
      });
    };

    // oldID - string DialogueID of the node you want to relabel
    // newID - string DialogueID of the id you want to relabel oldID to
    RelabelNode(oldID, newID){
      fetch('http://localhost:5000/relabel_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_relabel": oldID, "relabel_to": newID})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
      });
    };

    // nodeInfo - JSON dialogue object of the node that is to be updated
    UpdateNode(nodeInfo){
      fetch('http://localhost:5000/update_node_attrs', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_update":nodeInfo})
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({graph: data});
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
        this.setState({graph: data});
        // resets list of nodes to an empty array
        this.nodeList= [];
      });
    };

    render() { 
      return (
        <div>
          {JSON.stringify(this.state.graph)}
        </div>)
    }
}