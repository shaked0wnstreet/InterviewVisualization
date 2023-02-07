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

let newNodes = {
  "links": [],
  "nodes": []
}

let currentSelectedNode = {}

function visualize(jsonArray) {

  //console.log('in visualiize');
  if( jsonArray!={}){
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
          console.log("nextProp", nextProp)
          //console.log("Inside foreach", newNodes["nodes"].find(node=> {return node['NextDialogID']==currentId}))
          
          if (newNodes["nodes"].find(node => node[nextProp] == currentId)) {
            //console.log
            previousNode = newNodes["nodes"].find(node => node[nextProp] == currentId)
            console.log("previousNode", previousNode)
            let xPos = previousNode["position"].x;
            console.log("xpos", xPos)
            let sentiment = "";
  
            /*if (nextProp == "NextPositiveID") {
              xPos -= 200; // subtract 200 in order to place it on the left side
              sentiment = "yes";
  
            } else if (nextProp == "NextNegativeID") {
              xPos += 200; // add 200 in order to place it on the right side
              sentiment = "no";
            }*/
  
            newNodes["nodes"][i]["position"] = { x: xPos, y: previousNode["position"].y + 200 };
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
      }*/
    }
  }
  
  console.log("newNodes: ", newNodes["nodes"]);

}


const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

let aNode = {};
let index = -1;
let nodeID = -1; 


const OverviewFlow = (props) => {
  
  //const [aNode, setANode] = useState('');
  if (props.jsonArray!={}){
    //console.log("Overviewflow", JSON.stringify(props.jsonArray['nodes'] ))
    visualize(props.jsonArray)

  }


  //const [graph, setGraph] = useState('')
  //visualize(props.jsonArray)
  const [dialogText, setDialogText] = useState('')

  // Begin: These state object will be passed into the PopUpForm 
  const onDialogTextChange = (e) => {
    setDialogText(e.target.value);
  }

  const [dialogID, setDialogID] = useState('new_question')

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
  //const [alternateValues, setAlternateValues] = useState([{ alternate: "" }])
  const [alternateValues, setAlternateValues] = useState([""])

  // End of Pop Up Form props

  // flag to trigger the action for on Save btn clicked in Pop Up Form.
  const [onEdit, setOnEdit] = useState(false);
  const [onAdd, setOnAdd] = useState(false);

  function onSubmitBtn() {
    // create the node obj from the states
    let newNode = createNewNodeObj();
    //console.log("new node on submit:", newNode)
    //console.log(newNode);
    // if it's on editting mode replace the node in the array
    if (onEdit) {
      let dialogues = props.questions;
      dialogues[index] = newNode;
      
      // call the function on Edit passed from props
      //sprint("Edit submit newnode", newNode)
      props.onEditSubmit(newNode);
    }
    else { // if it's on adding mode append the node into the array
      //props.jsonArray.nodes.push(newNode);
      props.onAddSubmit(currentSelectedNode, newNode);

      currentSelectedNode = {}
    }

  }

  function DeleteNode(index) {
    //props.jsonArray.remove(1);
    //The delete node here should call the function 
    //The FETCH FUNCTION FOR DELETE NODE NEEDS TO BE CALLED HERE.
    
    props.onSubmit();
  }



  // combine the new infomation from the state container and pass it to 
  function createNewNodeObj() {
    let newNode = {
      "id": dialogID,
      'DialogText': dialogText,
      "alternates": alternateValues,
      "NextDialogID": nextID,
     // 'requireResponse': requiredResponse,
      'section': section,
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

  const onDblClick = (event, node) => {
    console.log("double click current node", node.id);
    currentSelectedNode = node;
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
    if (aNode['section']) { setSection(aNode['section']) };
    if (aNode['NextDialogID']) { setNextID(aNode['NextDialogID']) };
    if (aNode['alternates']) { setAlternateValues(aNode['alternates']) };
  }

  //function to assign attribute in aNode to the state container
  function assignNewNode() {

    setDialogText('');
    setDialogID('');
    setSection('');
    setNextID('');
    setAlternateValues([]);
  }

  //console.log('in Flow component');
  //console.log(JSON.stringify(props.jsonArray['nodes'].length));
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
                setOnEdit(true);
                setOnAdd(false);
                index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));
                //setANode(props.questions[index]);
                aNode = props.questions[index];
                console.log(aNode);
                // create a function to set the value of node info to the container and call it here
                assignNode(aNode);
                console.log("onEdit", onEdit);
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
                index = props.jsonArray.nodes.length;
                console.log(index);
                assignNewNode();
                console.log(onAdd);
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