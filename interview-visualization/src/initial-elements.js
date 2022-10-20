import React from "react";
import { MarkerType } from "reactflow";

export const nodes = [
    {
        id: "1",
        type: "input",
        data: {
            label: (
                <>
                    <strong>001</strong>
                </>
            ),

        },
        position: { x: 250, y: 0 },
        tooltip: {
            showTooltip: true,
            text: 'this is the tooltip for node1',
        },
    },
    {
        id: "2",
        data: {
            label: (
                <>
                    <strong>002</strong>
                </>
            )
        },
        position: { x: 100, y: 100 },

    },
    {
        id: "3",
        data: {
            label: (
                <>
                    <strong>003</strong>
                </>
            )
        },
        position: { x: 400, y: 100 },
        style: {
            border: "1px solid #222138",
            width: 180
        }
    },
    {
        id: "4",
        position: { x: 190, y: 200 },
        data: {
            label: (
                <>
                    <strong>004</strong>
                </>
            )
        }
    },
    {
        id: "5",
        data: {
            label: (
                <>
                    <strong>005</strong>
                </>
            )
        },
        position: { x: 20, y: 200 }
    },
    {
        id: "6",
        type: "output",
        data: {
            label: (
                <>
                    <strong>006</strong>
                </>
            )
        },
        position: { x: 400, y: 450 }
    },
    {
        id: "7",
        type: "output",
        data: { label: "007" },
        position: { x: 200, y: 450 }
    },
    {
        id: "8",
        data: {
            label: (
                <>
                    <strong>008</strong>
                </>
            )
        },
        position: { x: 600, y: 250 }
    }
];

export const edges = [
    { id: "e1-2", source: "1", target: "2", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: NO" },
    { id: "e1-3", source: "1", target: "3", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: YES" },
    // { id: "e2-3", source: "2", target: "3", label: "this is an edge label" },
    // { id: "e2-3", source: "2", target: "3", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: YES" },
    { id: "e2-4", source: "2", target: "4", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    // { id: "e2-5", source: "2", target: "5", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e5-7", source: "5", target: "7", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },

    { id: "e3-8", source: "3", target: "8", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e8-6", source: "8", target: "6", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: HIGH" }


    // {
    //   id: "e4-5",
    //   source: "4",
    //   target: "5",
    //   label: "edge with arrow head",
    //   markerEnd: {
    //     type: MarkerType.ArrowClosed
    //   }
    // },
    // {
    //   id: "e5-6",
    //   source: "5",
    //   target: "6",
    //   type: "smoothstep",
    //   label: "smooth step edge"
    // },
    // {
    //   id: "e5-7",
    //   source: "5",
    //   target: "7",
    //   type: "step",
    //   style: { stroke: "#f6ab6c" },
    //   label: "a step edge",
    //   animated: true,
    //   labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
    // }
];
