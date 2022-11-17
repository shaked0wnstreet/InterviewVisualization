import React, { useCallback, useState } from "react";
import ReactFlow, {
    addEdge,
    updateEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import './PopUp.css';
//import { Text } from "@fluentui/react";
// eslint-disable-next-line
import { Button, Popover } from "@material-ui/core";
//import Typography from '@mui/material/Typography';
//import Dialogue from "./components/Dialogue";
//import styled from "styled-components";
//import CirvrStudio from "./App";
import PopUpForm from "./PopUpForm";

import { OndemandVideoTwoTone } from "@mui/icons-material";
import ButtonEdge from './ButtonEdge.js';


let newNodes = {
    "links": [],
    "nodes": []
}

function visualize(jsonArray) {
    for (let i = 0; i < jsonArray["nodes"].length; i++) {
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
            newNodes["nodes"][i]["position"] = { x: 200, y: 200 };

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
                        type: 'buttonedge',
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
const OVERLAY_STYLE = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0, .8)",
    zIndex: "1000",
    overflowY: "auto"
};

const MODAL_STYLES = {
    position: "absolute",
    backgroundColor: "#FFF",
    padding: "15px",
    zIndex: "1000",
    width: "35%",
    borderRadius: ".5em",
    overflowY: "scroll"
};

console.log(newNodes["nodes"]);

const onInit = (reactFlowInstance) =>
    console.log("flow loaded:", reactFlowInstance);


const OverviewFlow = (props) => {

    const [aNode, setANode] = useState('')

    const [dialogText, setDialogText] = useState(() => { if (aNode['DialogText']) { return aNode['DialogText']; } })

    // Begin: These state object will be passed into the PopUpForm 
    const onDialogTextChange = (e) => {
        setDialogText(e.target.value);
    }

    const [dialogID, setDialogID] = useState(() => { if (aNode['id']) { return aNode['id']; } })

    const onDialogIDChange = (e) => {
        setDialogID(e.target.value);
    }

    const [timeLimit, setTimeLimit] = useState(() => { if (aNode['timeLimit']) { return aNode['timeLimit']; } })

    // need to validate the value between 10-120 second
    const onTimeLimitChange = (e) => {
        setTimeLimit(e.target.value);
    }

    const [section, setSection] = useState(() => { if (aNode['section']) { return aNode['section']; } });

    const onSectionChange = (event) => {
        setSection(event.target.value);
    };

    const [nextID, setNextID] = useState(() => { if (aNode['NextDialogID']) { return aNode['NextDialogID']; } });

    const onNextDialogIDChange = (event) => {
        setNextID(event.target.value);
    };

    const [nextPositiveID, setNextPositiveID] = useState(() => { if (aNode['NextPositiveID']) { return aNode['NextPositiveID']; } });

    const onNextPositiveIDChange = (event) => {
        setNextPositiveID(event.target.value);
    };

    const [nextNegativeID, setNextNegativeID] = useState(() => { if (aNode['nextNegativeID']) { return aNode['nextNegativeID']; } });

    const onNextNegativeIDChange = (event) => {
        setNextNegativeID(event.target.value);
    };

    const [dynamicEntity, setDynamicEntity] = useState(() => { if (aNode['dynamicParams']) { return aNode['dynamicParams']; } });

    const onDynamicEntityChange = (event) => {
        event.preventDefault();
        setDynamicEntity(event.target.value);
    };

    const [entities, setEntities] = useState(() => { if (aNode['timeLimit']) { return aNode['timeLimit']; } });

    const onEntitiesChange = (event) => {
        event.preventDefault();
        setEntities(event.target.value);
    };

    const [responseType, setResponseType] = useState(() => { if (aNode['timeLimit']) { return aNode['timeLimit']; } });

    const onResponseTypeChange = (event) => {
        setResponseType(event.target.value);
    };

    //For Required Response checkbox
    const [requiredResponse, setRequiredResponse] = useState(true);

    const onRequiredResponseChange = () => {
        setRequiredResponse(!requiredResponse);
    };

    //For Interruption checkbox
    const [interruption, setInterruption] = useState(() => { if (aNode['timeLimit']) { return aNode['timeLimit']; } });

    const onInterruptionChange = (event) => {
        setInterruption(event.target.checked);
    };

    const [interruptionType, setInterruptionType] = useState(() => { if (aNode['timeLimit']) { return aNode['timeLimit']; } });

    const onInterruptionTypeChange = (event) => {
        setInterruptionType(event.target.value);
    };

    //For adding an alternate dialog text box
    const [alternateValues, setAlternateValues] = useState(() => { if (aNode['alternates']) { return aNode['alternates']; } })

    let handleAlternateChange = (i, e) => {
        let newAlternateValues = [...alternateValues];
        newAlternateValues[i][e.target.name] = e.target.value;
        setAlternateValues(newAlternateValues);
    }

    let addAlternateFields = () => {
        setAlternateValues([...alternateValues, { alternate: "" }])
    }

    let removeAlternateFields = (i) => {
        let newAlternateValues = [...alternateValues];
        newAlternateValues.splice(i, 1);
        setAlternateValues(newAlternateValues)
    }

    function onSubmitBtn(newArray) {
        // create the node obj from the states
        // append/ replace the node in the array
        props.setInterviewerDialogs(newArray);
        console.log(props.jsonArray);
    }

    // End of Pop Up Form props
    visualize(props.jsonArray);
    const [nodes, setNodes, onNodesChange] = useNodesState(newNodes["nodes"]);
    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(newNodes["links"]);
    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
        []
    );
    // const onConnect = useCallback(
    //     (params) => setEdges((eds) => addEdge(params, eds)),
    //     [setEdges]
    // );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)),
        []
    );
    const edgeTypes = {
        buttonedge: ButtonEdge,
    };

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
                onEdgeUpdate={onEdgeUpdate}
                onConnect={onConnect}
                onInit={onInit}
                edgeTypes={edgeTypes}
                onNodeMouseEnter={handlePopoverOpen}
                onMouseLeave={() => {
                    //disable this event (it will be trigger as soon at the popover opens) or use it for autoHide
                    // timeoutId = setTimeout(handlePopoverClose, 5000);
                }}
                fitView
                attributionPosition="top-right"
            >
                {/* <Popover
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
                            timeoutId = setTimeout(handlePopoverClose, 100);
                        }}
                    >
                        <Button

                            onClick={(event) => {
                                setANode(props.questions[0]);
                                setIsModalOpen(true);
                                console.log("Edit button clicked");
                                console.log(event.target.value);
                            }}
                            style={{ display: "block" }}

                        >
                            EDIT
                        </Button>
                        <Button
                            onClick={(event) => {
                                console.log("Add button clicked");
                            }}
                            style={{ display: "block" }}
                        >
                            ADD
                        </Button>
                        <Button
                            onClick={(event) => {
                                console.log("Delete button clicked");
                            }}
                            style={{ display: "block" }}
                        >
                            DELETE
                        </Button>
                    </div>
                </Popover> */}
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
                <div className="pop-up-form">
                    <PopUpForm
                        setTrigger={setIsModalOpen}
                        dialogID={dialogID}
                        onDialogIDChange={onDialogIDChange}
                        section={section}
                        onSectionChange={onSectionChange}
                        dialogText={dialogText}
                        onDialogTextChange={onDialogTextChange}
                        dynamicEntity={dynamicEntity}
                        onDynamicEntityChange={onDynamicEntityChange}
                        alternateValues={alternateValues}
                        handleAlternateChange={handleAlternateChange}
                        removeAlternateFields={removeAlternateFields}
                        addAlternateFields={addAlternateFields}
                        requiredResponse={requiredResponse}
                        onRequiredResponseChange={onRequiredResponseChange}
                        onTimeLimitChange={onTimeLimitChange}
                        timeLimit={timeLimit}
                        interruption={interruption}
                        interruptionType={interruptionType}
                        onInterruptionChange={onInterruptionChange}
                        onInterruptionTypeChange={onInterruptionTypeChange}
                        responseType={responseType}
                        onResponseTypeChange={onResponseTypeChange}
                        onNextDialogIDChange={onNextDialogIDChange}
                        nextID={nextID}
                        nextPositiveID={nextPositiveID}
                        onNextPositiveIDChange={onNextPositiveIDChange}
                        nextNegativeID={nextNegativeID}
                        onNextNegativeIDChange={onNextNegativeIDChange}
                        entities={entities}
                        onEntitiesChange={onEntitiesChange}
                        onSubmit={onSubmitBtn}

                    />
                </div>
                : null}
        </>
    );
};

export default OverviewFlow;