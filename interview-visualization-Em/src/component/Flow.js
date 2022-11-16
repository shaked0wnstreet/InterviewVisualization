import React, { useCallback, useState } from "react";
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
//import Dialogue from "./components/Dialogue";
//import styled from "styled-components";
//import CirvrStudio from "./App";
import PopUpForm from "./PopUpForm";

let newNodes = {
  "links":[],
  "nodes":[]
}

function visualize(jsonArray) {
  for (let i=0; i < jsonArray["nodes"].length; i++) {
    let currentId, previousNode;
    const nextProps = ["NextDialogID", "NextPositiveID", "NextNegativeID"];
  
    currentId = jsonArray["nodes"][i]["id"];
  
    // Begin filling in the node with the respective properties
    newNodes["nodes"][i] = {};
    newNodes["links"][i] = {};
    newNodes["nodes"][i]["data"] = {};
    newNodes["nodes"][i]["id"] = currentId;
    newNodes["nodes"][i]["data"]["label"] = jsonArray["nodes"][i]["DialogText"];
  
    // Fill in the corresponding property for each node, whether the property is 
    // 'NextDialogID', 'NextPositiveID', or 'NextNegativeID'
    nextProps.forEach((nextProp) => {
      if (nextProp in jsonArray["nodes"][i]) {
        newNodes["nodes"][i][nextProp] = jsonArray["nodes"][i][nextProp];
      }
    });
  
    // If it's the first node, add it to the center of the graph
    if (i == 0) { 
      newNodes["nodes"][i]["type"] = "input";
      newNodes["nodes"][i]["position"] = { x: 200, y: 200};
      
    // Otherwise, dynamically add every other node  
    } else { 
      nextProps.forEach((nextProp) => {
        if (previousNode = newNodes["nodes"].find(node => node[nextProp] == currentId)) {
          let xPos = previousNode["position"].x;
          let sentiment = "";
  
          if (nextProp == "NextPositiveID") {
            xPos -= 200; // subtract 200 in order to place it on the left side
            sentiment = "yes";
  
          } else if (nextProp == "NextNegativeID") {
            xPos += 200; // add 200 in order to place it on the right side
            sentiment = "no";
          }
  
          newNodes["nodes"][i]["position"] = { x: xPos, y: previousNode["position"].y + 200 };
          newNodes["links"][i] = { 
            id: `${i}`,
            source: `${previousNode["id"]}`,
            target: `${currentId}`,
            label: sentiment ? `sentiment: "${sentiment}"` : '',
            labelStyle: { fontSize: 12 },
            markerEnd: {
                  type: "arrowclosed",
                  strokeWidth: 2
                }
          };
        }
      })
    }
  
    // Handle case for the node being a whiteboard question
    if (jsonArray["nodes"][i]["whiteboardType"]) {
      newNodes["nodes"][i]["data"]["label"] = "Whiteboard";
      newNodes["nodes"][i]["style"] = { padding: 50 };
    }
  }
}
   
console.log(newNodes["nodes"]);

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = (props) => {
    visualize(props.jsonArray);
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

    //For form modal popup
const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <>
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
                     // timeoutId = setTimeout(handlePopoverClose, 1000);
                   }}
                    >
                    <Button
                    
                        onClick={(event) => {
                            setIsModalOpen(true)
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
          {isModalOpen ?
          <PopUpForm setTrigger={setIsModalOpen}/>: null}
      </>
    );
};

export default OverviewFlow;