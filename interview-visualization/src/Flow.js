import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
//import { Text } from "@fluentui/react";
import { Button, Popover } from "@material-ui/core";
//import Typography from '@mui/material/Typography';
import {
  nodes as initialNodes,
  edges as initialEdges
} from "./initial-elements";

// import json from './GameDev.json';

// var newNodes = [];

console.log(initialNodes);

var originalNodes = {
    "links":[],
    "nodes":[
        {
          "id": "000",
          "DialogText": "Good {{greetingTime}}, {{personName}}! Thank you so much for coming in. My name is {{interviewerName}}, and I am the supervisor for this department. I will be conducting this interview for the position of a Game Developer. ",
          "dynamicParams": [],
          "staticParams": [
              "interviewerName",
              "greetingTime",
              "personName"
          ],
          "alternates": [
              "My name is {{interviewerName}}, and I am the supervisor for this department.",
              "My name is {{interviewerName}}, and I am the department supervisor."
          ],
          "NextDialogID": "001",
          "unrecognizedResponse": "I'm sorry, I don't understand.",
          "requireResponse": false,
          "userInterruptionEnabled": false,
          "section": "Greeting"
      },
      {
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
          "section": "Greeting"
      },
      {
          "id": "PastWork001",
          "DialogText": "Before getting into some questions about the position, tell me, do you have any past work experience?",
          "dynamicParams": [],
          "staticParams": [],
          "alternates": [
              "Have you had any other jobs before this interview?",
              "What other jobs have you worked before?"
          ],
          "filterType": "SentimentFilter",
          "NextPostiveID": "PastWork002",
          "NextNegativeID": "005",
          "timeLimit": 30,
          "requireResponse": true,
          "nextTopicId": "005",
          "section": "PreviousWorkExperience"
      },
      {
          "id": "PastWork002",
          "DialogText": "Great. What did you best like about the job?",
          "dynamicParams": [],
          "staticParams": [],
          "alternates": [
              "What did you learn from this experience?",
              "What was one thing you learned from this job experience?"
          ],
          "NextDialogID": "PastWork003",
          "timeLimit": 60,
          "requiredParams": [],
          "requireResponse": true,
          "section": "PreviousWorkExperience"
      },
    ]
}

// var newNodes = {
//     "links": [],
//     "nodes": [
//       {
//         "DialogText": "Hello",
//         "NextDialogueID": "",
//         "id": "000",
//         "section": "Greeting"
//       }
//     ]
// }

var newNodes = {
  "links":[],
  "nodes":[]
}

var source, destination;

for (var i=0; i < originalNodes["nodes"].length; i++) {
  source = originalNodes["nodes"][i]["id"];
  if ("NextDialogID" in originalNodes["nodes"][i]) {
    destination = originalNodes["nodes"][i]["NextDialogID"];
  }

  newNodes["nodes"][i] = {};
  newNodes["nodes"][i]["data"] = {};
  newNodes["nodes"][i]["id"] = source;
  //newNodes["nodes"][i]["id"] = `"${i}"`;
  newNodes["nodes"][i]["data"]["label"] = originalNodes["nodes"][i]["DialogText"];
  newNodes["nodes"][i]["position"] = { x: 200, y: (i * 200) };

  if ("NextDialogID" in originalNodes["nodes"][i]) {
    newNodes["links"][i] = {};
    newNodes["links"][i] = { id: `${i}`, source: `${source}`, target: `${destination}`};
    // { id: "e1-2", source: "1", target: "2", label: "" },
  }
  
  // console.log(newNodes["nodes"][i]);
}
    
console.log(newNodes["nodes"]);
console.log(newNodes["links"]);

// for (var i=0; i < json["interviewerDialogs"].length; i++) {
//   var obj = {};
//   var position = {};
//   var data = {};

//   obj.id = String(Number(json["interviewerDialogs"][i]["id"].slice(-3)) + 1);
//   obj.type = "input";
//   obj.label = "Testing";
//   data.label = "Today, I am going to find out if your experience and interests will mesh well with our company, and in the process, you can learn more about our organization and the job.";
//   obj.data = data;
//   position.x =  "200";
//   position.y =  (i+1)*20;
//   obj.position = position;

//   newNodes.push(obj);
// }

// console.log(newNodes);

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(newNodes["nodes"]);
    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(newNodes["links"]);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    let timeoutId = null;

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeMouseEnter={handlePopoverOpen}
            onMouseLeave={() => {
              //disable this event (it will be trigger as soon at the popover opens) or use it for autoHide
              // timeoutId = setTimeout(handlePopoverClose, 5000);
            }}
            fitView
            attributionPosition="top-right"
        >
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}

              anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
              }}
              transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
              }}
              disableRestoreFocus={true}
            >
              <div
                onMouseEnter={() => clearTimeout(timeoutId)} // cancels any autohide timeouts
                onMouseLeave={() => {
                  //autoHide is set to one second
                  timeoutId = setTimeout(handlePopoverClose, 1000);
                }}
              >
                <Button
                
                    onClick={(event) => {
                        console.log("Edit button clicked");
                        console.log(event.id);
                    }}
                >
                    EDIT
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Add button clicked");
                    }}
                >
                    ADD
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Delete button clicked");
                    }}
                >
                    DELETE
                </Button>
                </div>
            </Popover>
            <MiniMap
                nodeStrokeColor={(n) => {
                    if (n.style?.background) return n.style.background;
                    if (n.type === "input") return "#0041d0";
                    if (n.type === "output") return "#ff0072";
                    if (n.type === "default") return "#1a192b";

  const handleClick = (event) => {
    console.log("event.currentTarget: " + event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

                    return "#fff";
                }}
                nodeBorderRadius={2}
            />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow >
    );
};

export default OverviewFlow;
