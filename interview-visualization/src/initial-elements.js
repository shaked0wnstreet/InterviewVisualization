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
        position: { x: 250, y: 15 },
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
        position: { x: 250, y: 115 },

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
        position: { x: 500, y: 300 },
        style: {
            border: "1px solid #222138",
            width: 180
        }
    },
    {
        id: "4",
        position: { x: 25, y: 225 },
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
        position: { x: 250, y: 400 }
    },
    {
        id: "6",
        data: {
            label: (
                <>
                    <strong>006</strong>
                </>
            )
        },
        position: { x: 250, y: 625 }
    },
    {
        id: "7",
        data: { label: "007" },
        position: { x: 25, y: 550 }
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
        position: { x: 500, y: 550 }
    },
    {
        id: "9",
        data: {
            label: (
                <>
                    <strong>009</strong>
                </>
            )
        },
        position: { x: 500, y: 850 }
    },
    {
        id: "10",
        data: {
            label: (
                <>
                    <strong>010</strong>
                </>
            )
        },
        position: { x: 20, y: 850 }
    },
    {
        id: "11",
        data: {
            label: (
                <>
                    <strong>011</strong>
                </>
            )
        },
        position: { x: 250, y: 925 }
    },
    {
        id: "12",
        data: {
            label: (
                <>
                    <strong>012</strong>
                </>
            )
        },
        position: { x: 250, y: 1150 }
    }
];

export const edges = [
    { id: "e1-2", source: "1", target: "2", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    //{ id: "e1-3", source: "1", target: "3", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: YES" },
    { id: "e2-4", source: "2", target: "4", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e4-3", source: "4", target: "3", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: YES" },
    { id: "e3-5", source: "3", target: "5", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e4-5", source: "4", target: "5", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Sentiment: NO" },
    { id: "e5-7", source: "5", target: "7", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e5-6", source: "5", target: "6", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e5-8", source: "5", target: "8", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e6-10", source: "6", target: "10", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e6-11", source: "6", target: "11", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e6-9", source: "6", target: "9", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e7-10", source: "7", target: "10", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: HIGH" },
    { id: "e7-11", source: "7", target: "11", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: HIGH" },
    { id: "e7-9", source: "7", target: "9", type: 'straight', markerEnd: { type: MarkerType.Arrow } },

    { id: "e8-10", source: "8", target: "10", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e8-11", source: "8", target: "11", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: HIGH" },
    { id: "e8-9", source: "8", target: "9", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: LOW" },
    { id: "e10-12", source: "10", target: "12", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e9-12", source: "9", target: "12", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    { id: "e11-12", source: "11", target: "12", type: 'straight', markerEnd: { type: MarkerType.Arrow } }


    //{ id: "e3-8", source: "3", target: "8", type: 'straight', markerEnd: { type: MarkerType.Arrow } },
    //{ id: "e8-6", source: "8", target: "6", type: 'straight', markerEnd: { type: MarkerType.Arrow }, label: "Stress: HIGH" }
];
