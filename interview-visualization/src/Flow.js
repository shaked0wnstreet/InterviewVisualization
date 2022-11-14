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

var newNodes = {
    "links":[],
    "nodes":[
        {
            id: "1",
            type: "input",
            data: {
              label: (
                <>
                  {` Good {{greetingTime}}, {{personName}}! Thank you so much for coming in. My name is {{interviewerName}}, and I am the supervisor for this department. I will be conducting this interview for the position of a Game Developer.  `}
                </>
              ),
              
            },
            position: { x: 200, y: 0 },
            tooltip: {
              showTooltip: true,
              text: 'this is the tooltip for node1',
            },
          },
          {
            id: "2",
            data: {
              label: (
                <>
                  Today, I am going to find out if your experience and interests will mesh well with our company, and in the process, you can learn more about our organization and the job.
                </>
              )
            },
            position: { x: 375, y: 0 },
            
          },
          {
            id: "3",
            data: {
              label: (
                <>
                  Before getting into some questions about the position, tell me, do you have any past work experience?
                </>
              )
            },
            position: { x: -50, y: 225 },
            // style: {
            //   background: "#D6D5E6",
            //   color: "#333",
            //   border: "1px solid #222138",
            //   width: 180
            // }
          },
          {
            id: "4",
            position: { x: -200, y: 350 },
            data: {
              label: "Great. What did you best like about the job?"
            }
          },
          {
            id: "5",
            data: {
              label: "What challenges did you face?"
            },
            position: { x: -250, y: 425 }
          },
          // {
          //   id: "5",
          //   data: {
          //     label: "Let's start with some technical questions about the position that you are interviewing for. Do you have any experience using a game engine such as Unity or Unreal?"
          //   },
          //   position: { x: 250, y: 325 }
          // },
          {
            id: "6",
            data: {
              label: (
                <>
                  Let's start with some technical questions about the position that you are interviewing for. Do you have any experience using a game engine such as Unity or Unreal?
                </>
              )
            },
            position: { x: 250, y: 325 }
          },
          {
            id: "7",
            data: { label: "That's okay. We can provide training in these tools." },
            position: { x: 150, y: 500 }
          },
          {
            id: "8",
            data: { label: "Do you have experience with object-oriented programming languages such as C++, C#, or Java? If so, which ones have you used?" },
            position: { x: 250, y: 725 }
          },
          {
            id: "9",
            data: { label: `Excellent. How would you rate your skill with \{\{developmentTool\}\}?` },
            position: { x: 350, y: 500 }
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

// for (var i=0; i < newNodes["nodes"].length; i++) {
//         newNodes["nodes"][i]["position"] = { x: 200, y: 0 + (i * 50) };
//         console.log(newNodes["nodes"][i]);
// }
    
// console.log(newNodes["nodes"]);

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
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleHover = (event) => {
        // console.log("handleHover: ", event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    // const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeMouseEnter={(event, element) => {
                // console.log("onNodeMouseEnter:", element.id);
                handleHover(event);
            }}
            onNodeMouseLeave={() => {
                // console.log("onNodeMouseLeave activated");
                // handlePopoverClose();
            }}
            fitView
            attributionPosition="top-right"
        >
            <Popover
                class="pointer-events-auto"
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
            >

                <Button
                    onClick={(event) => {
                        console.log("Edit button clicked");
                        console.log(event.id);
                        //setAnchorEl(event.currentTarget);
                    }}
                >
                    EDIT
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Add button clicked");
                        //setAnchorEl(event.currentTarget);
                    }}
                >
                    ADD
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Delete button clicked");
                        //setAnchorEl(event.currentTarget);
                    }}
                >
                    DELETE
                </Button>

                {/* <Typography sx={{ p: 2, border: 1, width: 400 }}>[DIALOGTEXT]</Typography> */}

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
