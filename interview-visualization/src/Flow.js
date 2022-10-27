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
import { Text } from "@fluentui/react";
import { Typography, Popover } from "@material-ui/core";

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const onNodeClick = () => {
    return (
      <Text>This is a tool tip for node 1</Text> // doesn't do anything, for a reason that is unknown
      // console.log("clicked");
    )
  }
  const onNodeMouseEnter = () => {
    return (
      <Text>Lorem ipsum dolor sit amet</Text>
      // console.log("entered")
    )
  }
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      onNodeClick={onNodeClick}
      onNodeMouseEnter={onNodeMouseEnter}
      fitView
      attributionPosition="top-right"
    >
      <Popover
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
        <Typography>The content of the Popover.</Typography>
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
