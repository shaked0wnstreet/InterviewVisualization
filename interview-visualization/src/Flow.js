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
import { Button, Popover } from "@material-ui/core";

let newNodes = {
  "links":[],
  "nodes":[]
}

// Dynamically generate the entire graph
function visualize(questions) {

  // Loop through every node that is dynamically fetched
  for (let i=0; i < questions.length; i++) {
    let currentId, previousNode;
    const nextProps = ["NextDialogID", "NextPositiveID", "NextNegativeID"];
  
    // Current question being indexed
    currentId = questions[i]["id"];
  
    // Begin filling in the node with the respective properties
    newNodes["nodes"][i] = {};
    newNodes["nodes"][i]["data"] = {};
    newNodes["nodes"][i]["id"] = currentId;
    newNodes["nodes"][i]["data"]["label"] = questions[i]["DialogText"];
  
    // Fill in the corresponding property for each node, whether the property is 
    // 'NextDialogID', 'NextPositiveID', or 'NextNegativeID'
    nextProps.forEach((nextProp) => {
      if (nextProp in questions[i]) {
        newNodes["nodes"][i][nextProp] = questions[i][nextProp];
      }
    });
  
    // If it's the first node, add it to the center of the graph
    if (i == 0) { 
      newNodes["nodes"][i]["type"] = "input";
      newNodes["nodes"][i]["position"] = { x: 200, y: 200};
      
    // Otherwise, dynamically add every other node
    } else {
      nextProps.forEach((nextProp) => {

        // If there is a previous node that is connected to the current node, whether 
        // it's connected through NextDialogID, NextPositiveID, or NextNegativeID, store 
        // it in a variable and then add the current node based off the position of the 
        // previous node, as well as connect the edge

        // There are nodes that only have the NextDialogID property, and others that
        // only have both the NextPositiveID and NextNegativeID properties; if the
        // current node doesn't have a particular property, the previousNode variable
        // will be equal to undefined, and then the loop will continue to the next node,
        // or property
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
  
          // Add the current node using the previous node's position
          newNodes["nodes"][i]["position"] = { x: xPos, y: previousNode["position"].y + 200 };

          // Create different edge ids to prevent two edges from having 
          // same id, so they'll look like 1dia, 3pos, or 5neg, for example
          let edgeId = i + nextProp.slice(4, 7).toLowerCase();

          // Build the current edge, then add it to the array
          let currentEdge = { 
            id: `${edgeId}`,
            source: `${previousNode["id"]}`,
            target: `${currentId}`,
            label: sentiment ? `sentiment: "${sentiment}"` : '',
            labelStyle: { fontSize: 12 },
            markerEnd: {
                  type: "arrowclosed",
                  strokeWidth: 2
                }
          };
          newNodes["links"].push(currentEdge);
        }
      });
    }
  
    // Handle case for the node being a whiteboard question
    if (questions[i]["whiteboardType"]) {
      newNodes["nodes"][i]["data"]["label"] = "Whiteboard";
      newNodes["nodes"][i]["style"] = { padding: 50 };
    }
  }
}

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = (props) => {
    visualize(props.questions);

    const [nodes, setNodes, onNodesChange] = useNodesState(newNodes["nodes"]);
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
              timeoutId = setTimeout(handlePopoverClose, 1000);
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
                  vertical: "center",
                  horizontal: "left"
              }}
              transformOrigin={{
                  vertical: "center",
                  horizontal: "right"
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
                        console.log(event.target.value);
                        console.log(nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id")));
                    }}
                    style={{display: "block"}}
                >
                    EDIT
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Add button clicked");
                    }}
                    style={{display: "block"}}
                >
                    ADD
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Delete button clicked");
                    }}
                    style={{display: "block"}}
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
