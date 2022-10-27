import React from "react";
import { MarkerType } from "reactflow";

export const nodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: (
        <>
          {` Good {{greetingTime}}, {{personName}}! Thank you so much for coming in. My name is {{interviewerName}}, and I am the supervisor for this department. I will be conducting this interview for the position of a Game Developer.  `}
        </>
      ),
      
    },
    position: { x: 200, y: 0 },
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
          Today, I am going to find out if your experience and interests will mesh well with our company, and in the process, you can learn more about our organization and the job.
        </>
      )
    },
    position: { x: 375, y: 0 },
    
  },
  {
    id: "3",
    data: {
      label: (
        <>
          Before getting into some questions about the position, tell me, do you have any past work experience?
        </>
      )
    },
    position: { x: -50, y: 225 },
    // style: {
    //   background: "#D6D5E6",
    //   color: "#333",
    //   border: "1px solid #222138",
    //   width: 180
    // }
  },
  {
    id: "4",
    position: { x: -200, y: 350 },
    data: {
      label: "Great. What did you best like about the job?"
    }
  },
  {
    id: "5",
    data: {
      label: "What challenges did you face?"
    },
    position: { x: -250, y: 425 }
  },
  // {
  //   id: "5",
  //   data: {
  //     label: "Let's start with some technical questions about the position that you are interviewing for. Do you have any experience using a game engine such as Unity or Unreal?"
  //   },
  //   position: { x: 250, y: 325 }
  // },
  {
    id: "6",
    data: {
      label: (
        <>
          Let's start with some technical questions about the position that you are interviewing for. Do you have any experience using a game engine such as Unity or Unreal?
        </>
      )
    },
    position: { x: 250, y: 325 }
  },
  {
    id: "7",
    data: { label: "That's okay. We can provide training in these tools." },
    position: { x: 150, y: 500 }
  },
  {
    id: "8",
    data: { label: "Do you have experience with object-oriented programming languages such as C++, C#, or Java? If so, which ones have you used?" },
    position: { x: 250, y: 725 }
  },
  {
    id: "9",
    data: { label: `Excellent. How would you rate your skill with \{\{developmentTool\}\}?` },
    position: { x: 350, y: 500 }
  },
  {
    id: "10",
    data: { label: "And how many hours per week do you spend developing?" },
    position: { x: 350, y: 600 }
  }
];

export const edges = [
  { id: "e1-2", source: "1", target: "2", label: "" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "3", target: "4" },
  { id: "e1-5", source: "4", target: "5" },
  { id: "e1-6", source: "5", target: "6" },
  { id: "e1-7", source: "3", target: "6" },
  { id: "e1-8", source: "6", target: "7" },
  { id: "e1-9", source: "7", target: "8" },
  { id: "e1-10", source: "6", target: "9" },
  { id: "e1-11", source: "9", target: "10" },
  { id: "e1-12", source: "10", target: "8" },
  // {
  //   id: "e3-4",
  //   source: "3",
  //   target: "4",
  //   animated: true,
  //   label: "animated edge"
  // },
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
