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
    // eslint-disable-next-line
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleHover = (event) => {
        //console.log("handleHover: ", event.currentTarget);
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
                //console.log("onNodeMouseEnter:", event.currentTarget);
                handleHover(event);
            }}
            // onNodeMouseLeave={() => {
            //     console.log("onNodeMouseLeave activated");
            // }}
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
