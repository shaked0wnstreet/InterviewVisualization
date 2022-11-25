import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge
} from "reactflow";
import "reactflow/dist/style.css";
import './PopUp.css';
//import { Text } from "@fluentui/react";
import { Button, Popover } from "@material-ui/core";
//import Typography from '@mui/material/Typography';
//import Dialogue from "./components/Dialogue";
//import styled from "styled-components";
//import CirvrStudio from "./App";
import PopUpForm from "./PopUpForm";
import { AssignmentRounded, DeleteOutlineRounded, OndemandVideoTwoTone } from "@mui/icons-material";

let newNodes = {
  "links": [],
  "nodes": []
}

function visualize(jsonArray) {

  console.log('in visualiize');
  console.log(jsonArray);
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

  console.log("newNodes: ", newNodes["nodes"]);
}



const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

let aNode = {};
let index = -1;
const OverviewFlow = (props) => {

  //const [aNode, setANode] = useState('');


  const [dialogText, setDialogText] = useState('')

  // Begin: These state object will be passed into the PopUpForm 
  const onDialogTextChange = (e) => {
    setDialogText(e.target.value);
  }

  const [dialogID, setDialogID] = useState('')

  const onDialogIDChange = (e) => {
    setDialogID(e.target.value);
  }

  const [timeLimit, setTimeLimit] = useState('')
  // need to validate the value between 10-120 second
  const onTimeLimitChange = (e) => {
    setTimeLimit(e.target.value);
  }

  const [section, setSection] = useState('');

  const onSectionChange = (event) => {
    setSection(event.target.value);
  };

  const [nextID, setNextID] = useState('');

  const onNextDialogIDChange = (event) => {
    setNextID(event.target.value);
  };

  const [nextPositiveID, setNextPositiveID] = useState('');

  const onNextPositiveIDChange = (event) => {
    setNextPositiveID(event.target.value);
  };

  const [nextNegativeID, setNextNegativeID] = useState('');

  const onNextNegativeIDChange = (event) => {
    setNextNegativeID(event.target.value);
  };

  const [dynamicEntity, setDynamicEntity] = useState('');

  const onDynamicEntityChange = (event) => {
    event.preventDefault();
    setDynamicEntity(event.target.value);
  };

  const [entities, setEntities] = useState('');

  const onEntitiesChange = (event) => {
    event.preventDefault();
    setEntities(event.target.value);
  };

  const [responseType, setResponseType] = useState();

  const onResponseTypeChange = (event) => {
    setResponseType(event.target.value);
  };

  //For Required Response checkbox
  const [requiredResponse, setRequiredResponse] = useState(true);

  const onRequiredResponseChange = () => {
    setRequiredResponse(!requiredResponse);
  };

  //For Interruption checkbox
  const [interruption, setInterruption] = useState('');

  const onInterruptionChange = (event) => {
    setInterruption(event.target.checked);
  };

  const [interruptionType, setInterruptionType] = useState('');

  const onInterruptionTypeChange = (event) => {
    setInterruptionType(event.target.value);
  };

  //For adding an alternate dialog text box
  const [alternateValues, setAlternateValues] = useState([{ alternate: "" }])

  // End of Pop Up Form props

  // flag to trigger the action for on Save btn clicked in Pop Up Form.
  const [onEdit, setOnEdit] = useState(false);
  const [onAdd, setOnAdd] = useState(false);

  function onSubmitBtn() {
    // create the node obj from the states
    console.log(index);
    let newNode = createNewNodeObj();
    console.log(newNode);

    // if it's on editting mode replace the node in the array
    if (onEdit) {
      setOnEdit(false);
      let dialogues = props.questions;
      dialogues[index] = newNode;
      props.onSubmit();
    }
    else { // if it's on adding mode replace the node in the array
      setOnAdd(false);
      props.jsonArray.nodes.push(newNode);
    }

  }

  function DeleteNode(index) {
    props.jsonArray.remove(1);
    props.onSubmit();
  }



  // combine the new infomation from the state container and pass it to 
  function createNewNodeObj() {
    let newNode = {
      "id": dialogID,
      'DialogText': dialogText,
      "dynamicParams": [dynamicEntity],
      "alternates": alternateValues,
      "NextDialogID": nextID,
      'NextNegativeID': nextNegativeID,
      "NextPositiveID": nextPositiveID,
      'requireResponse': requiredResponse,
      'userInterruptionEnabled': interruption,
      'interruptee': interruptionType,
      'section': section,
      'timeLimit': timeLimit,
    }

    return newNode;
  }

  visualize(props.jsonArray);
  const [nodes, setNodes, onNodesChange] = useNodesState(newNodes["nodes"]);
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(newNodes["links"]);
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let i = props.jsonArray["nodes"].findIndex((outsideNode) => node.id == outsideNode["id"]);
        node.data = {
          ...node.data,
          label: props.jsonArray["nodes"][i]["DialogText"],
        };
        return node;
      })
    );
  }, [JSON.stringify(props.jsonArray), setNodes]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const onDblClick = (event) => {
    //console.log("double click");
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    //console.log('handlePopoverClose')
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  let timeoutId = null;

  //For form modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  //function to assign attribute in aNode to the state container
  function assignNode(aNode) {
    // change the flag of onEdit so it activate the right action on submit
    if (aNode['DialogText']) { setDialogText(aNode['DialogText']) };
    if (aNode['id']) { setDialogID(aNode['id']) };
    if (aNode['timeLimit']) { setTimeLimit(aNode['timeLimit']) };
    if (aNode['section']) { setSection(aNode['section']) };
    if (aNode['NextDialogID']) { setNextID(aNode['NextDialogID']) };
    if (aNode['NextPositiveID']) { setNextPositiveID(aNode['NextPositiveID']) };
    if (aNode['nextNegativeID']) { setNextNegativeID(aNode['nextNegativeID']) };
    if (aNode['dynamicParams']) { setDynamicEntity(aNode['dynamicParams']) };
    if (aNode['entities']) { setEntities(aNode['entities']) };
    if (aNode['filterType']) { setResponseType(aNode['filterType']) };
    if (aNode['requireResponse']) { setRequiredResponse(aNode['requireResponse']) };
    if (aNode['userInterruptionEnabled']) { setInterruption(aNode['userInterruptionEnabled']) };
    if (aNode['interruptee']) { setInterruptionType(aNode['interruptee']) };
    if (aNode['alternates']) { setAlternateValues(aNode['alternates']) };
    if (aNode['timeLimit']) { setTimeLimit(aNode['timeLimit']) };
  }

  //function to assign attribute in aNode to the state container
  function assignNewNode() {

    setDialogText('');
    setDialogID('');
    setTimeLimit('');
    setSection('');
    setNextID('');
    setNextPositiveID('');
    setNextNegativeID('');
    setDynamicEntity('');
    setEntities('');
    setResponseType('');
    setRequiredResponse('');
    setInterruption('');
    setInterruptionType('');
    setAlternateValues([]);
    setTimeLimit('');
  }

  console.log('in Flow component');
  console.log(props.jsonArray);
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
        onNodeDoubleClick={onDblClick}
        //onNodeMouseEnter={handlePopoverOpen}
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
                console.log("Edit button clicked");
                setOnEdit(!onEdit);
                index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));
                //setANode(props.questions[index]);
                aNode = props.questions[index];
                console.log(aNode);
                // create a function to set the value of node info to the container and call it here
                assignNode(aNode);
                console.log(onEdit);
                setIsModalOpen(true);
              }}
            >
              EDIT
            </Button>
            <Button
              onClick={(event) => {
                console.log("Add button clicked");
                setOnAdd(!onAdd);
                index = props.jsonArray.nodes.length;
                console.log(index);
                assignNewNode();
                console.log(onEdit);
                setIsModalOpen(true);
              }}
            >
              ADD
            </Button>
            <Button
              onClick={(event) => {
                console.log("Delete button clicked");
                index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));

                DeleteNode(index);
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
        <div className="pop-up-form">
          <PopUpForm
            //node = {aNode}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            dialogID={dialogID}
            onDialogIDChange={onDialogIDChange}
            section={section}
            onSectionChange={onSectionChange}
            dialogText={dialogText}
            onDialogTextChange={onDialogTextChange}
            dynamicEntity={dynamicEntity}
            onDynamicEntityChange={onDynamicEntityChange}
            alternateValues={alternateValues}
            setAlternateValues={setAlternateValues}
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