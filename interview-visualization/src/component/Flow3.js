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
import { Button, Popover } from "@material-ui/core";
import PopUpForm from "./PopUpForm";
import { AssignmentRounded, DeleteOutlineRounded, OndemandVideoTwoTone } from "@mui/icons-material";
import { getStepLabelUtilityClass } from "@mui/material";
import { amber } from "@mui/material/colors";
import { json } from "d3";

let newNodes = {
  "links": [],
  "nodes": []
}

let currentSelectedNode = {}

/*function visualize(jsonArray) {

  //console.log('in visualiize');
  if( jsonArray!=''){
    //console.log(jsonArray['nodes'].length);

    for (let i = 0; i < jsonArray["nodes"].length; i++) {
      let currentId, previousNode;
      const nextProps = ["NextDialogID"];

      //const nextProps = ["NextDialogID", "NextNegativeID", "NextNegativeID"];
  
      //var currentId = jsonArray["nodes"][i]["id"];
      currentId = jsonArray['nodes'][i]['id']
     // console.log(currentId)
    
  
      // Begin filling in the node with the respective properties
      newNodes["nodes"][i] = {};
      newNodes["links"][i] = {};
      newNodes["nodes"][i]["data"] = {};
      newNodes["nodes"][i]["id"] = currentId;
      newNodes["nodes"][i]["data"]["label"] = jsonArray["nodes"][i]["DialogText"];
      newNodes["nodes"][i]['position'] = jsonArray['nodes'][i]['position'];
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
        //newNodes["nodes"][i]["position"] = { x: 200, y: 100 };
  
        // Otherwise, dynamically add every other node  
      } else {
        nextProps.forEach((nextProp) => {
          //console.log("nextProp", nextProp)
          //console.log("Inside foreach", newNodes["nodes"].find(node=> {return node['NextDialogID']==currentId}))
          
          if (newNodes["nodes"].find(node => node[nextProp] == currentId)) {
            previousNode = newNodes["nodes"].find(node => node[nextProp] == currentId)
            let xPos = previousNode["position"].x;
            let sentiment = "";
  
            /*if (nextProp == "NextPositiveID") {
              xPos -= 200; // subtract 200 in order to place it on the left side
              sentiment = "yes";
  
            } else if (nextProp == "NextNegativeID") {
              xPos += 200; // add 200 in order to place it on the right side
              sentiment = "no";
            }
  
            newNodes["nodes"][i]["position"] = { x: xPos, y: previousNode["position"].y + 100 };
            newNodes["links"][i] = {
              //id: `${i}`,
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
      /*if (jsonArray["nodes"][i]["whiteboardType"]) {
        newNodes["nodes"][i]["data"]["label"] = "Whiteboard";
        newNodes["nodes"][i]["style"] = { padding: 50 };
      }
    }
  }
  
  console.log("newNodes: ", newNodes);
  //props.setNodes(newNodes['nodes'])
  //props.setEdges(newNodes['links'])

}
*/


const onInit = (reactFlowInstance) =>{
  //console.log("flow loaded:", reactFlowInstance);
}

//let aNode = {};
//let index = -1;
//let nodeID = -1; 


const OverviewFlow = (props) => {
  
  //console.log("questions: ",props.questions)
  //const [aNode, setANode] = useState('');
  /*if (props.jsonArray!=''){
    //console.log("Overviewflow", JSON.stringify(props.jsonArray['nodes'] ))
    visualize(props.jsonArray)

  }*/
  //visualize(props.jsonArray)
  const [nodes, setNodes, onNodesChange] = useNodesState(props.jsonArray["nodes"]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.jsonArray["links"]);



  const [dialogText, setDialogText] = useState('')
  const [data, setLabel] = useState({label: dialogText})

  // Begin: These state object will be passed into the PopUpForm 
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
    //setAlternativeValues
  }

  // End of Pop Up Form props

  // flag to trigger the action for on Save btn clicked in Pop Up Form.
  const [onEdit, setOnEdit] = useState(false);
  const [onAdd, setOnAdd] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const onDblClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;
    setDialogID(node['id'])
    setDialogText(node['DialogText'])
    setNextID(node['NextDialogID'])
    setSection(node['section'])
    //@todo: add alternates and and the others

    setAnchorEl(event.currentTarget);
  };

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
        strokeWidth: 2
      }
      updatedEdges.push(link)
      //console.log("Link", link)
    }
    //console.log("updateedges", updatedEdges)

    return updatedEdges

  }

  function onSubmitBtn() {
    // create the node obj from the states
    //console.log("new node on submit:", newNode)
    //console.log(newNode);
    // if it's on editting mode replace the node in the array
    if (onEdit) {
      let newNode = createEditNodeObj(currentSelectedNode);

      //let dialogues = props.questions;
      //dialogues[index] = newNode;
      
      // call the function on Edit passed from props
      //console.log("Edit submit newnode", newNode)
      props.onEditSubmit(newNode);
      currentSelectedNode={}
      setDialogText('');
      setDialogID('');
      setSection('');
      setNextID('');
      //setAlternateValues([]);
      setPosition({})
      setLabel({'label': ''})
      //visualize(props.jsonArray)*/
    }
    else { // if it's on adding mode append the node into the array
      //props.jsonArray.nodes.push(newNode);
      //visualize(props.jsonArray)
      setDialogText('');
      setDialogID('');
      setSection('');
      setNextID('');
      //setAlternateValues([]);
      setPosition({})
      setLabel({'label': ''})
      let newNode = createNewNodeObj(currentSelectedNode);
      props.onAddSubmit(currentSelectedNode, newNode);
      setNodes(props.jsonArray['nodes']);
       //formatEdges()
      

      currentSelectedNode = {}
    }

  }

  
/*
  function DeleteNode(index) {
    //props.jsonArray.remove(1);
    //The delete node here should call the function 
    //The FETCH FUNCTION FOR DELETE NODE NEEDS TO BE CALLED HERE.
    
    props.onSubmit();
  }


*/
  // combine the new infomation from the state container and pass it to 
  function createEditNodeObj(currentNode) {
    console.log("currentNode", currentNode)
    let newNode = {
      "id": dialogID,
      'DialogText': dialogText,
      "alternates": alternateValues,
      "NextDialogID": nextID,
     // 'requireResponse': requiredResponse,
      'section': section,
      'position': {'x': currentNode['position']['x'],
                    'y': currentNode['position']['y']},
      'data': {label: dialogText}
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

  //visualize(props.jsonArray);
 /* const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );*/

  const [position, setPosition] = useState({})
  
  const onPositionChange = (event) => {
    setPosition(event.target.value);
  };

  useEffect(()=>{

    let updatedEdges = formatEdges()
    //console.log("updatedEdges", updatedEdges)
    setEdges(updatedEdges)

  }, [edges]);
/*
  useEffect(() => {
    console.log("INSIDE USEEFFECT")
    /*setNodes((nds) => {
      //console.log("NOdes in Useffect", JSON.stringify(nds))
      nds.map((node) => {
        //console.log("Set nodes", node)

      //let i = props.jsonArray["nodes"].findIndex((outsideNode) => node.id == outsideNode["id"]);
       // console.log("i in useeffect", i)
       let i = newNodes["nodes"].findIndex((outsideNode) => node.id == outsideNode["id"]);
 
       node.data = {
          ...node.data,
          label: newNodes["nodes"][i]["DialogText"],
        };
        return node;
      })
      //console.log("nds new", nds_new)
      //return nds_new
    }
    );*/
   /* visualize(props.jsonArray)
    setNodes(newNodes['nodes'])
    setEdges(newNodes['links'])

  }, [props.jsonArray,newNodes/*, setNodes]);*/

  

  
  /*


  //function to assign attribute in aNode to the state container
  function assignNode(aNode) {
    // change the flag of onEdit so it activate the right action on submit
    if (aNode['DialogText']) { setDialogText(aNode['DialogText']) };
    if (aNode['id']) { setDialogID(aNode['id']) };
    if (aNode['section']) { setSection(aNode['section']) };
    if (aNode['NextDialogID']) { setNextID(aNode['NextDialogID']) };
    if (aNode['alternates']) { setAlternateValues(aNode['alternates']) };
    if (aNode['position']) {setPosition(aNode['position'])}
    if (aNode['data']){setLabel(aNode['data'])}
  }

  //function to assign attribute in aNode to the state container
  function assignNewNode() {

    setDialogText('');
    setDialogID('');
    setSection('');
    setNextID('');
    setAlternateValues([]);
    setPosition({})
    setLabel({'label': ''})
    //visualize(jsonArray)
  }
*/
  //console.log('in Flow component');
  //console.log(JSON.stringify(props.jsonArray['nodes'].length));
  return (
    <>
      <ReactFlow
        nodes={props.jsonArray['nodes']}
        edges={edges}
        onNodesChange={onNodesChange}
       // onEdgesChange={onEdgesChange}
       // onEdgeUpdate={onEdgeUpdate}
       // onConnect={onConnect}
        
        onInit={onInit}
        onNodeDoubleClick={onDblClick}
        //onNodeMouseEnter={handlePopoverOpen}
       //</> onMouseLeave={() => {
          //disable this event (it will be trigger as soon at the popover opens) or use it for autoHide
          // timeoutId = setTimeout(handlePopoverClose, 5000);
       // }}
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
                console.log("Edit button clicked", currentSelectedNode);
                setOnEdit(true);
                setOnAdd(false);
                //console.log(anchorEl, anchorEl.getAttribute("data-id"))
                /*index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));
                //console.log("index", index)
                setANode(props.questions[index]);
                let aNode = props.questions[index];
                //console.log("aNode", aNode);
                // create a function to set the value of node info to the container and call it here
                assignNode(aNode);
                console.log("onEdit", onEdit);*/
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
                //index = props.jsonArray.nodes.length;
                //console.log(index);
                //assignNewNode();
                //console.log(onAdd);*/
                setIsModalOpen(true);
              }}
            >
              ADD
            </Button>
            <Button
              onClick={(event) => {
               console.log("Delete button clicked");
               // index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));

               // DeleteNode(index);
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
            //node={currentSelectedNode}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            dialogID={dialogID}
            onDialogIDChange={onDialogIDChange}
            //section={section}
            //onSectionChange={onSectionChange}
            dialogText={dialogText}
            onDialogTextChange={onDialogTextChange}
            //alternateValues={alternateValues}
            //setAlternateValues={setAlternateValues}
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