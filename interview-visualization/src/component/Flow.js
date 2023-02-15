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
import { getStepLabelUtilityClass, TextField } from "@mui/material";
import { amber } from "@mui/material/colors";
import { json } from "d3";
import BasicModal from "./Modal";
import HelpIcon from '@mui/icons-material/Help';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import TextUpdaterNode from './TextUpdaterNode.js';

import './text-updater-node.css';
import PopUpForm2 from "./PopUpForm2";

let newNodes = {
  "links": [],
  "nodes": []
}

let currentSelectedNode = {}
let currentSelectedEdge = {}

//let aNode = {};
//let index = -1;
//let nodeID = -1; 
//const nodeTypes = { textUpdater: TextUpdaterNode };


const OverviewFlow = (props) => {
  

  const [nodes, setNodes] = useNodesState(props.jsonArray["nodes"]);

  const [edges, setEdges] = useEdgesState(props.jsonArray["links"]);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => {
      console.log("onConnect", params)

      props.onCreateEdge(params['source'], params['target'], '')

      return addEdge(params, eds)}), [setEdges]
   
  );
  const onConnectEnd = useCallback(
    (params) => {
      console.log("onConnectEnd", params)    
    }
  );

  const onNodesChange = useCallback(
    
    
    (changes) => setNodes((nds) => 
    {
      
      //temporarily removed this for now. 
    /* if (changes[0].type=='position' && changes[0]['dragging']==true){
      fetch('http://localhost:5000/on_position_change', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_update": changes[0]})
      })
      .then((response) => response.json())
      .then((data) => {
        //this.setState({graph: data});
        props.setJsonArray(data)
        props.setInterviewerDialogs(data['nodes'])
  
      })
      .catch(error => console.log(error));
     }*/
    
     //console.log(changes)
     return applyNodeChanges(changes, nds)
    }),
    [setNodes]

    //#todo: Update the position of the node in the JSON array backend
  
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => {
    console.log("Edges", changes)
    return applyEdgeChanges(changes, eds)
    }),
    [setEdges]
  );
 
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

  /*const onDblClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;
   
    setAnchorEl(event.currentTarget);
  };*/

  const onNodeClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;

    //setAnchorEl(event.currentTarget);
  }

  const onNodeMouseUp=(event, node)=>{
    console.log(node.position)
  }

  const handlePopoverClose = () => {
    console.log('handlePopoverClose') 
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  //const [open, setOpen] = useState(false)
  const id = open ? "simple-popover" : undefined;
  let timeoutId = null;

  //For form modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  function onContextMenu(event, node){
    event.preventDefault()
    currentSelectedNode=node;
    //console.log(event, node)
    //setOpen(true)
    setAnchorEl(event.currentTarget)
  }
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
      let updatedEdges = formatEdges()
    //console.log("updatedEdges", updatedEdges)
      //setEdges(updatedEdges)
      //setNodes(props.jsonArray['nodes'])
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
       let updatedEdges = formatEdges()
    //console.log("updatedEdges", updatedEdges)
      //setEdges(updatedEdges)
      //setNodes(props.jsonArray['nodes']) //This does not seem to be updating outside of useEffect
      

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

  const [position, setPosition] = useState({})
  const onPositionChange = (event) => {
    setPosition(event.target.value);
  };
  //const [isDraggable, setIsDraggable] = useState(false);
  //const [isConnectable, setIsConnectable] = useState(false);

  
 useEffect(()=>{

    let updatedEdges = formatEdges()
    //console.log("updatedEdges", updatedEdges)
    setEdges(updatedEdges)
    setNodes(props.jsonArray['nodes'])
    

  }, [edges, nodes, props.jsonArray]);

  function downloadTxtFile () {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(props.jsonArray, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "graph"+".json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }


  //************************Edge functions********************************** */

  const [edgeAnchorEl, setEdgeAnchorEl] = React.useState(null);
  const openEdgeMenu = Boolean(edgeAnchorEl)
 
  function onEdgeContextMenu(event, edge){
    event.preventDefault() 
    currentSelectedEdge = edge;
    currentSelectedEdge['type']==''
    //console.log(event.currentTarget)
    console.log("edge", edge)
    setEdgeAnchorEl(event.currentTarget)
  }
 
  /*const defaultEdgeOptions = {
    style: { strokeWidth: 5, stroke: 'black' },
    labelStyle: {fontSize: 12},
    markerEnd: {
      type: 'arrowClosed',
      color: 'black',
      strokeWidth:2
    },
  };*/

  const [editLabel, setEditLabel] = useState(false);
 
  //const [errorMessage, setErrorMessage] = useState('')
  //console.log('in Flow component');
  //console.log(JSON.stringify(props.jsonArray['nodes'].length));*/

  //************************************************************ */

  return (
    <>
    
      {/*<Button 
      style={{zIndex: 2}}
      variant="contained" 
      color= "primary"
      startIcon={<FileDownloadIcon/>}
      onClick={downloadTxtFile}> 
      Download 
  </Button>*/}

      <div>{JSON.stringify(currentSelectedNode['position'])}</div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(event)=>onNodesChange(event)}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        //defaultEdgeOptions={defaultEdgeOptions}
        onNodeContextMenu={onContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        //onConnectEnd= {onConnectEnd}
        fitView
        attributionPosition="top-right"
        minZoom={0.5}
        

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
                
                setAnchorEl(false);
                setIsModalOpen(true);
                

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
                setNextID('')
                setSection('')
                setAlternateValues([''])
                setAnchorEl(false);
                setIsModalOpen(true);
                
              }}
            >
              ADD
            </Button>
            {currentSelectedNode['id']!='000'?

              <Button
                onClick={(event) => {
                  console.log("Delete button clicked");
                  setAnchorEl(false);
                  


                }}
              >
                DELETE
              </Button>: null}
          </div>
        </Popover>
        <Popover
          id={id}
          open={openEdgeMenu}
          anchorEl={edgeAnchorEl}
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
                  console.log("ADD LABEL button clicked");
                  setEdgeAnchorEl(null);
                  setEditLabel(true);

                  
                 // props.onEdgeDelete(currentSelectedEdge['source'], currentSelectedEdge['target']);
                  //let updatedEdges = formatEdges()
                  //setEdges(updatedEdges)
                }
                }
                color={"default"}

              >
                ADD LABEL
              </Button>
              <Button
                onClick={(event) => {
                  console.log("Delete button clicked");
                  setEdgeAnchorEl(false);
                  props.onEdgeDelete(currentSelectedEdge['source'], currentSelectedEdge['target']);
                  //let updatedEdges = formatEdges()
                  //setEdges(updatedEdges)
                }
                }
                color={"default"}

              >
                DELETE EDGE
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
       {isModalOpen ? /*<div><PopUpForm2/></div>: "No"*/
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
        : null
      }
      
      <Popover 
      open={editLabel}
      anchorEl={edgeAnchorEl}
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
      <TextField
      variant="outlined"
      label="Edge Condition"
      placeholder="Type edge condition here"
      onKeyDown={(e)=>{
        console.log(e.code)
        if (e.code=="Enter"){
          setEdgeAnchorEl(false);
          setEditLabel(false)

          //editLabel=false;

        }
      }}
      value={currentSelectedEdge['type']}
      onChange={(event)=>{
        console.log("edge condition", event.target.value)
        currentSelectedEdge['type'] = event.target.value
        console.log(currentSelectedEdge)

        
      }}> </TextField> 
      <HelpIcon />
      
      </Popover>
    </>
  );
};

export default OverviewFlow;