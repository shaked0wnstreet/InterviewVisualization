//import { useState } from "react";
import React from "react";
import { Component } from "react";

export default class APIService extends Component{

    constructor(props){
        super(props);
        this.state={
            graph: ""
        }
    }

    InitGraph(){
             fetch('http://localhost:5000/init', {
               method: 'GET',
               headers: {'Content-Type': 'application/json', 
               'Access-Control-Allow-Origin': true},
             })
               .then((response) => response.json())
               .then((data) => {
                this.setState({graph: data})
            });
     };

    InsertNode() {
         fetch('http://localhost:5000/insert_node', {
             method: 'PUT',
             headers: {'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true},
            // need to provide current_node along with node_to_add
             body: JSON.stringify({ "current_node": "000", "node_to_add": {
                "id": "001",
                "DialogText": "Today, I am going to find out if your experience and interests will mesh well with our company, and in the process, you can learn more about our organization and the job. ",
                "dynamicParams": [],
                "staticParams": [],
                "alternates": [
                  "I'd like to learn more about your background. Then I want to share information about our organization and the job. Shall we begin?",
                  "I want to learn more about you and talk about what we do here at our organization. Does that sound good?"
                ],
                "NextDialogID": "PastWork001",
                "unrecognizedResponse": "I'm sorry, I don't understand.",
                "timeLimit": 10,
                "requireResponse": true,
                "userInterruptionEnabled": false,
                "section": "Greeting" }
                    })
         })
         .then((response) => response.json())
         .then((data) => {
            this.setState({graph: data})
         });
     };

     DeleteNode(){
        fetch('http://localhost:5000/delete_node', {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': true},
        // provide node_to_delete
          body: {"node_to_delete": "000"}
        })
          .then((response) => response.json())
          .then((data) => {
           this.setState({graph: data})
       });
};

     // never ending recursion?
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
        this.InitGraph();
        //this.InsertNode();
        //this.DeleteNode();
        //this.ResetGraph();

        return (<div>
            {JSON.stringify(this.state.graph)}
        </div>)
     }
}