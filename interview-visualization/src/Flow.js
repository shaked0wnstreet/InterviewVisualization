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

import {
    nodes as initialNodes,
    edges as initialEdges
} from "./initial-elements";

//import json from './GameDev.json';

// var newNodes = [];

// for (var i=0; i < json["interviewerDialogs"].length; i++) {
//   var obj = {};

//     // obj.id = String(Number(json["interviewerDialogs"][i]["id"].slice(-3)) + 1);
//     obj.id = json["interviewerDialogs"][i].id;
//     obj.DialogText = json["interviewerDialogs"][i].DialogText;
//     obj.staticParams = json["interviewerDialogs"][i].staticParams;
//     obj.dynamicParms = json["interviewerDialogs"][i].dynamicParms;
//     obj.alternates = json["interviewerDialogs"][i].alternates;
//     obj.NextDialogID = json["interviewerDialogs"][i].NextDialogID;
//     obj.unrecognizedResponse = json["interviewerDialogs"][i].unrecognizedResponse;
//     obj.requireResponse = json["interviewerDialogs"][i].requireResponse;
//     obj.userInterruptionEnabled = json["interviewerDialogs"][i].userInterruptionEnabled;
//     obj.section = json["interviewerDialogs"][i].section;

//   newNodes.push(obj);
// }
// console.log(newNodes);

const onInit = (reactFlowInstance) =>
    console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // const onNodeClick = () => {
    //   return (
    //     <Text>This is a tool tip for node 1</Text> // doesn't do anything, for a reason that is unknown
    //     // console.log("clicked");
    //   )
    // }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        console.log("event.currentTarget: " + event.currentTarget);
        setAnchorEl(event.currentTarget);
    };

    const onNodeMouseEnter = (event) => {
        // return (
        setAnchorEl(event.currentTarget);
        // <Text>Lorem ipsum dolor sit amet</Text>
        // console.log("entered")
        // )
    }

    const handleClose = () => {
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
                handleClick(event);
            }}
            // onNodeClick={(event, element) => {
            //   console.log("click", element);
            //   handleClick(event);
            // }}
            // onNodeClick={onNodeClick}
            // onNodeMouseEnter={onNodeMouseEnter}
            fitView
            attributionPosition="top-right"
        >
            <Popover
                class="pointer-events-auto"
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Button>EDIT</Button>

            </Popover>
            <MiniMap
                nodeStrokeColor={(n) => {
                    if (n.style?.background) return n.style.background;
                    if (n.type === "input") return "#0041d0";
                    if (n.type === "output") return "#ff0072";
                    if (n.type === "default") return "#1a192b";

                    return "#eee";
                }}
                nodeColor={(n) => {
                    if (n.style?.background) return n.style.background;

                    return "#fff";
                }}
                nodeBorderRadius={2}
            />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
};

export default OverviewFlow;