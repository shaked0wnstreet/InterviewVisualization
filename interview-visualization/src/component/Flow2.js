import React, { useCallback, useEffect, useState,Component } from "react";
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

class Flow2 extends Component{

  constructor(props){
    super(props);
    this.state={
      graphObj: props.graphObj,
      dialogText: '',
      dialogID: '',
      section:'',
      nextID:'',
      alternateValues:[],
      onEdit:false,
      onAdd:false
    }
  }

  render(){
    

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
                console.log(onEdit);
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
        : null
      }
      
    

    </>);
  }
}

export default Flow2;