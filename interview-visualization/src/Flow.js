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

import {
    nodes as initialNodes,
    edges as initialEdges
} from "./initial-elements";

import json from './GameDev.json';

for (var i = 0; i < json["interviewerDialogs"].length; i++) {

    var obj = json["interviewerDialogs"][i];
    console.log(obj);
}

// const graphArray = [];

// for (const key in json["interviewerDialogs"]) {
//   if (json["interviewerDialogs"].hasOwnProperty(key)) {
//     graphArray.push(key);
//   }
// }

// console.log(graphArray);

// graphArray.forEach(function(obj) {
//   console.log(obj.id);
// });



// console.log(json);

const onInit = (reactFlowInstance) =>
    console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = () => {
        return (
            <Text>This is a tool tip for node 1</Text>
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
            fitView
            attributionPosition="top-right"
        >
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
// import React, { useCallback } from "react";
// import ReactFlow, {
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { Text } from "@fluentui/react";

// import {
//   nodes as initialNodes,
//   edges as initialEdges
// } from "./initial-elements";

// const onInit = (reactFlowInstance) =>
//   console.log("flow loaded:", reactFlowInstance);

// const OverviewFlow = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick = () => {
//     return (
//       <Text>This is a tool tip for node 1</Text>
//     )
//   }
//   return (
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       onNodesChange={onNodesChange}
//       onEdgesChange={onEdgesChange}
//       onConnect={onConnect}
//       onInit={onInit}
//       onNodeClick={onNodeClick}
//       fitView
//       attributionPosition="top-right"
//     >
//       <MiniMap
//         nodeStrokeColor={(n) => {
//           if (n.style?.background) return n.style.background;
//           if (n.type === "input") return "#0041d0";
//           if (n.type === "output") return "#ff0072";
//           if (n.type === "default") return "#1a192b";

//           return "#eee";
//         }}
//         nodeColor={(n) => {
//           if (n.style?.background) return n.style.background;

//           return "#fff";
//         }}
//         nodeBorderRadius={2}
//       />
//       <Controls />
//       <Background color="#aaa" gap={16} />
//     </ReactFlow>
//   );
// };

// export default OverviewFlow;

