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
import {
    nodes as initialNodes,
    edges as initialEdges
} from "./initial-elements";
//import { useState } from 'react';
import json from './GameDev.json';
import Dialogue from "./components/Dialogue";
//import Modal from 'react-bootstrap/Modal';
import styled from "styled-components";

var newNodes = [];
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

const onInit = (reactFlowInstance) =>
    console.log("flow loaded:", reactFlowInstance);

       

const OverviewFlow = () => {
    //question = json["interviewerDialogs"];
    //question = {jsonObject}
    /*
    <OverviewFlow question = {jsonObject}/>

    var jsonObject = {
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
    }
    */

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

    //For form modal popup
    const [isModalOpen, setIsModalOpen] = useState(false);
    const Overlay = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
    `;
    const Dialog = styled.div`
        background: white;
        border-radius: 5px;
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    `;

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

        {/*Start Jess trying to get form to pop up*/}

            {isModalOpen && (
                <div>
                    <Overlay>
                        <Dialog>
                            <p>
                                It's a modal{" "}
                                <span role="img" aria-label="tada">
                                🎉
                                </span>
                            </p>
                            <button onClick={() => setIsModalOpen(false)}>CLOSE MODAL</button>
                        </Dialog>
                    </Overlay>
                </div>
            )}
            
            {/*
            {isModalOpen && (
                
                   <Dialogue
                        dialogueObject = {question}
                        id = {(question.DialogID)}
                   />
                
            )}
             */}

                <Button
                    onClick={() => {
                        setIsModalOpen(true)
                        console.log("Edit button clicked");
                        //setAnchorEl(event.currentTarget);
                    }}
                >
                    EDIT
                </Button>
        {/*End Jess trying to get form to pop up*/}

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
        </ReactFlow >
    );
};

export default OverviewFlow;