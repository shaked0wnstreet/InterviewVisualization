import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";
import './PopUp.css';
import { Button, Popover } from "@material-ui/core";
import PopUpForm from "./PopUpForm";
import { AssignmentRounded, DeleteOutlineRounded, OndemandVideoTwoTone } from "@mui/icons-material";
import { getStepLabelUtilityClass } from "@mui/material";
import { amber } from "@mui/material/colors";
import { json } from "d3";
import BasicModal from "./Modal";

import TextUpdaterNode from './TextUpdaterNode.js';

import './text-updater-node.css';

let newNodes = {
  "links": [],
  "nodes": []
}

let currentSelectedNode = {}

//let aNode = {};
//let index = -1;
//let nodeID = -1; 
//const nodeTypes = { textUpdater: TextUpdaterNode };


const OverviewFlow = (props) => {
  


  const [nodes, setNodes,onNodesChange] = useNodesState(props.jsonArray["nodes"]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(props.jsonArray["links"]);
  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

 /* const onNodesChange  = useCallback(
    
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]

  
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );*/
  function onNodeDragStart(event, node){
    console.log("position", JSON.stringify({x: event.screenX, y: event.screenY }))
    console.log("position", JSON.stringify({x: event.screenX, y: event.screenY } ))
    let new_node = node
    console.log("DragStop", node)
    new_node['position'] = {x: event.screenX, y: event.screenY}
   // new_node['positionAbsolute'] = {x: event.screenX}
    props.onEditSubmit(new_node);


  }

  function onNodeDragStop(event, node){
    console.log("position", JSON.stringify({x: event.screenX, y: event.screenY } ))
    let new_node = node
    console.log("DragStop", node)
    new_node['position'] = {x: event.screenX, y: event.screenY}
    props.onEditSubmit(new_node);


  }
  function onDrag(event, node){
    console.log(event)
    let new_node = node
    console.log("DragStop", node)
    new_node['position'] = {x: event.screenX, y: event.screenY}
    props.onEditSubmit(new_node);


  }
  
 
  const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

  const [dialogText, setDialogText] = useState('')
  const [data, setLabel] = useState({label: dialogText})

  const onDialogTextChange = (e) => {
    setDialogText(e.target.value);
    setLabel({label:e.target.value})
  }

  const [dialogID, setDialogID] = useState('')
  const onDialogIDChange = (e) => {
    setDialogID(e.target.value);
  }

  const [section, setSection] = useState('');
  const onSectionChange = (event) => {
    console.log("Section", event.target.value)
    setSection(event.target.value);
  };

  const [nextID, setNextID] = useState('');
  const onNextDialogIDChange = (event) => {
    setNextID(event.target.value);
  };


  //For adding an alternate dialog text box
  const [alternateValues, setAlternateValues] = useState([""])
  const onAlternativeValuesChange = (event) =>{
    console.log("Alternative values", event.target.value);
    //setAlternativeValues(even)
  }

  // flag to trigger the action for on Save btn clicked in Pop Up Form.
  const [onEdit, setOnEdit] = useState(false);
  const [onAdd, setOnAdd] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const onDblClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;
   
    setAnchorEl(event.currentTarget);
  };

  const onNodeClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;

    setAnchorEl(event.currentTarget);
  }

  const handlePopoverClose = () => {
    console.log('handlePopoverClose') 
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  let timeoutId = null;

  //For form modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  function formatEdges()
  {
    let updatedEdges = []
    for(var i=0; i<props.jsonArray["links"].length;i++){
      let link = props.jsonArray["links"][i]
      link ['labelStyle']=  { fontSize: 12 },
      link['markerEnd']= {
        type: "arrowclosed",
        strokeWidth: 5
      }
      updatedEdges.push(link)
      //console.log("Link", link)
    }
    //console.log("updateedges", updatedEdges)

    return updatedEdges

  }

  function onSubmitBtn() {

    // if it's on editting mode replace the node in the array
    if (onEdit) {
      let newNode = createEditNodeObj(currentSelectedNode);
      //@todo: add alternates and and the others
     
      props.onEditSubmit(newNode);
      currentSelectedNode={}
      setDialogText('');
      setDialogID('');
      setSection('');
      setNextID('');
      setAlternateValues(['']);
      setPosition({})
      setLabel({'label': ''})
    }
    else { // if it's on adding mode append the node into the array
      //props.jsonArray.nodes.push(newNode);
      //visualize(props.jsonArray)
      setDialogText('');
      setDialogID('');
      setSection('');
      setNextID('');
      setAlternateValues(['']);
      setPosition({})
      setLabel({'label': ''})
      let newNode = createNewNodeObj(currentSelectedNode);
      props.onAddSubmit(currentSelectedNode, newNode);
      setNodes(props.jsonArray['nodes']);
       //formatEdges()
      

      currentSelectedNode = {}
    }

  }

  

  // combine the new infomation from the state container and pass it to 
  function createEditNodeObj(currentNode) {
    console.log("currentNode", currentNode)
    console.log("alternames", currentNode['alternates'])

    let newNode = {
      "id": dialogID,
      'DialogText': dialogText,
      "alternates": alternateValues,
      "NextDialogID": nextID,
     // 'requireResponse': requiredResponse,
      'section': section,
      'position': {'x': currentNode['position']['x'],
                    'y': currentNode['position']['y']},
      'data': {label: dialogText},
      'type': dialogID=='000'? 'input': 'default'
     }

    return newNode;
  }

  function createNewNodeObj(currentNode) {
    console.log("currentNode", currentNode)
    let newNode = {
      "id": dialogID,
      'DialogText': dialogText,
      "alternates": alternateValues,
      "NextDialogID": nextID,
     // 'requireResponse': requiredResponse,
      'section': section,
      'position': {'x': currentNode['position']['x'],
                    'y': currentNode['position']['y']+100},
      'data': {label: dialogText}
     }

    return newNode;
  }

  //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const [position, setPosition] = useState({})
  const onPositionChange = (event) => {
    setPosition(event.target.value);
  };
  const [isDraggable, setIsDraggable] = useState(false);
  const [isConnectable, setIsConnectable] = useState(false);

  
  useEffect(()=>{

    let updatedEdges = formatEdges()
    //console.log("updatedEdges", updatedEdges)
    setEdges(updatedEdges)
    setNodes(props.jsonArray['nodes'])

  }, [edges, props.jsonArray]);

  function downloadTxtFile () {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(props.jsonArray, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "graph"+".json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

 
 
  const [errorMessage, setErrorMessage] = useState('')
  //console.log('in Flow component');
  //console.log(JSON.stringify(props.jsonArray['nodes'].length));
  return (
    <>
    <div style={{zIndex: 1, color: "lightblue"}}>
      <Button variant="contained" onClick={downloadTxtFile}> Download </Button>

    </div>
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        //onNodeDrag={onDrag}
        //on
        onInit={onInit}
        //onNodeDoubleClick={onDblClick}
        onNodeClick={onNodeClick}
        
        //onNodeDragStart={onNodeDragStart}
        //onNodeDragStop={onNodeDragStop}
        /*onNodeMouseEnter={(event)=>{
          console.log(event.screenX, event.screenY)
        }}*/
       //</> onMouseLeave={() => {
          //disable this event (it will be trigger as soon at the popover opens) or use it for autoHide
          // timeoutId = setTimeout(handlePopoverClose, 5000);
       // }}
        fitView
        attributionPosition="top-right"
        minZoom={0.2}
        //nodeTypes={nodeTypes}

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
                setOnEdit(true);
                setDialogID(currentSelectedNode['id'])
                setDialogText(currentSelectedNode['DialogText'])
                setNextID()
                setSection(currentSelectedNode['section'])
                setOnAdd(false);
                setAlternateValues(currentSelectedNode['alternates'])
                setIsModalOpen(true);
                setAnchorEl(false)

              }}
            >
              EDIT
            </Button>
            <Button
              onClick={(event) => {
                console.log("Add button clicked");
                setOnEdit(false);
                setOnAdd(true);
                setDialogID('')
                setDialogText('')
                setNextID({})
                setSection('')
                setAlternateValues([''])
                setIsModalOpen(true);
                setAnchorEl(false)
              }}
            >
              ADD
            </Button>
            {currentSelectedNode['id']!='000'?

              <Button
                onClick={(event) => {
                  console.log("Delete button clicked");
                  props.onDelete(currentSelectedNode['id'])
                  setAnchorEl(false)


                }}
              >
                DELETE
              </Button>: null}
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
      </ReactFlowProvider>
      {isModalOpen ?
        <div className="pop-up-form">
          <PopUpForm
            //node = {aNode}
            //node={currentSelectedNode}
            onEdit={onEdit}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            dialogID={dialogID}
            onDialogIDChange={onDialogIDChange}
            section={section}
            onSectionChange={onSectionChange}
            dialogText={dialogText}
            onDialogTextChange={onDialogTextChange}
            alternateValues={alternateValues}
            setAlternateValues={setAlternateValues}
            onNextDialogIDChange={onNextDialogIDChange}
            nextID={nextID}
            onSubmit={onSubmitBtn}

          />
        </div>
      : null}
    </>
  );
};

export default OverviewFlow;