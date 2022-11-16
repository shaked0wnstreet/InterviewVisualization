import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
//import { Text } from "@fluentui/react";
import { Button, Popover } from "@material-ui/core";
//import Typography from '@mui/material/Typography';
//import Dialogue from "./components/Dialogue";
//import styled from "styled-components";
//import CirvrStudio from "./App";
import PopUpForm from "./PopUpForm";

var jsonArray = {
  "links":[],
  "nodes":[
    {
        "id": "000",
        "DialogText": "Good {{greetingTime}}, {{personName}}! Thank you so much for coming in. My name is {{interviewerName}}, and I am the supervisor for this department. I will be conducting this interview for the position of a Game Developer. ",
        "dynamicParams": [],
        "staticParams": [
            "interviewerName",
            "greetingTime",
            "personName"
        ],
        "alternates": [
            "My name is {{interviewerName}}, and I am the supervisor for this department.",
            "My name is {{interviewerName}}, and I am the department supervisor."
        ],
        "NextDialogID": "001",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "requireResponse": false,
        "userInterruptionEnabled": false,
        "section": "Greeting"
    },
    {
        "id": "001",
        "DialogText": "Today, I am going to find out if your experience and interests will mesh well with our company, and in the process, you can learn more about our organization and the job. ",
        "dynamicParams": [],
        "staticParams": [],
        "alternates": [
            "I'd like to learn more about your background. Then I want to share information about our organization and the job. Shall we begin?",
            "I want to learn more about you and talk about what we do here at our organization. Does that sound good?"
        ],
        "NextDialogID": "PastWork001",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 10,
        "requireResponse": true,
        "userInterruptionEnabled": false,
        "section": "Greeting"
    },
    {
        "id": "PastWork001",
        "DialogText": "Before getting into some questions about the position, tell me, do you have any past work experience?",
        "dynamicParams": [],
        "staticParams": [],
        "alternates": [
            "Have you had any other jobs before this interview?",
            "What other jobs have you worked before?"
        ],
        "filterType": "SentimentFilter",
        "NextPositiveID": "PastWork002",
        "NextNegativeID": "005",
        "timeLimit": 30,
        "requireResponse": true,
        "nextTopicId": "005",
        "section": "PreviousWorkExperience"
    },
    {
        "id": "PastWork002",
        "DialogText": "Great. What did you best like about the job?",
        "dynamicParams": [],
        "staticParams": [],
        "alternates": [
            "What did you learn from this experience?",
            "What was one thing you learned from this job experience?"
        ],
        "NextDialogID": "PastWork003",
        "timeLimit": 60,
        "requiredParams": [],
        "requireResponse": true,
        "section": "PreviousWorkExperience"
    },
    {
      "id": "PastWork003",
      "DialogText": "What challenges did you face?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "What do you think was challenging about the job?",
          "Did you find this job to be challenging?"
      ],
      "requiredParams": [],
      "timeLimit": 60,
      "NextDialogID": "005",
      "requireResponse": true,
      "section": "PreviousWorkExperience"
    },
    {
      "id": "005",
      "DialogText": "Let's start with some technical questions about the position that you are interviewing for. Do you have any experience using a game engine such as Unity or Unreal?",
      "dynamicParams": [],
      "staticParams": [],
      "requiredParams": [
          "developmentTool"
      ],
      "alternates": [
          "This position will have you working with a game engine such as Unity or Unreal, do you have experience with engines such as these? If so, which one?",
          "To begin with, we use game engines found on the market to create our games, do you have any experience with these, if so which ones?"
      ],
      "filterType": "SentimentFilter",
      "NextNegativeID": "006",
      "NextPositiveID": "007",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 60,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Technical"
    },
    {
      "id": "006",
      "DialogText": "That's okay. We can provide training in these tools.",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "We can provide training in that area.",
          "We can help bring you up to speed."
      ],
      "NextDialogID": "009",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "requireResponse": false,
      "userInterruptionEnabled": false,
      "section": "Technical"
    },
    {
      "id": "007",
      "DialogText": "Excellent. How would you rate your skill with {{developmentTool}}?",
      "dynamicParams": [
          "developmentTool"
      ],
      "staticParams": [],
      "alternates": [
          "What would you say your skill level using {{developmentTool}} is?",
          "How proficient are you using {{developmentTool}}?"
      ],
      "NextDialogID": "008",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Technical"
    },
    {
      "id": "008",
      "DialogText": "And how many hours per week do you spend developing?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "How many hours per week do you spend developing on average?",
          "About how many hours do you spend on game development each week?"
      ],
      "NextDialogID": "009",
      "unrecognizedResponse": "I'm sorry I didn't hear you",
      "timeLimit": 15,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Technical"
    },
    {
        "id": "009",
        "DialogText": "Do you have experience with object-oriented programming languages such as C++, C#, or Java? If so, which ones have you used?",
        "dynamicParams": [],
        "staticParams": [],
        "requiredParams": [
            "ProgrammingLanguage"
        ],
        "alternates": [
            "Have you previously worked with object-oriented programming languages, and if so, which ones?",
            "Have you previously used object-oriented programming languages, and if so, which ones?"
        ],
        "filterType": "SentimentFilter",
        "NextNegativeID": "010",
        "NextPositiveID": "011",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 30,
        "requireResponse": true,
        "userInterruptionEnabled": true,
        "section": "Technical"
    },
    {
        "id": "011",
        "DialogText": "That's great, and how proficient are you with {{ProgrammingLanguage}}?",
        "dynamicParams": [
            "ProgrammingLanguage"
        ],
        "staticParams": [],
        "alternates": [
            "How proficient are you at programming in {{ProgrammingLanguage}}?",
            "How skilled are you at programming in {{ProgrammingLanguage}}?"
        ],
        "NextDialogID": "016",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 30,
        "requireResponse": true,
        "userInterruptionEnabled": true,
        "section": "Technical"
    },
    {
        "id": "010",
        "DialogText": "That’s okay. We can provide training in these tools.",
        "dynamicParams": [],
        "staticParams": [],
        "alternates": [
            "We can provide training in that area.",
            "We can help bring you up to speed."
        ],
        "NextDialogID": "016",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "requireResponse": false,
        "userInterruptionEnabled": false,
        "section": "Technical"
    },
    {
      "id": "016",
      "DialogText": "Please tell me about a project that you effectively worked on with a team of other people. What skills did you learn from this experience?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "Tell me about a team-based project that you worked on and about the skills you developed based on that experience.",
          "Please tell me about a team project that you worked on and tell me about skills that you acquired as a result."
      ],
      "NextDialogID": "017",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "Interruptee": "interviewee",
      "section": "Technical"
    },
    {
      "id": "017",
      "DialogText": "Alright, lets test your knowledge with a technical quiz. Are you ready?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "Are you ready to start your quiz?",
          "Are you prepared to begin the whiteboard quiz?"
      ],
      "NextDialogID": "018",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 6,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Technical"
    },
    {
      "id": "018",
      "whiteboardType": "technical",
      "count": 5,
      "NextDialogID": "023",
      "userInterruptionEnabled": false
    },
    {
      "id": "023",
      "DialogText": "Now let's move on to questions about your educational background.",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "Let's now talk about your educational background.",
          "We'll now move on to a discussion of your educational background."
      ],
      "NextDialogID": "024",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "requireResponse": false,
      "userInterruptionEnabled": true,
      "section": "Education"
    },
    {
      "id": "024",
      "DialogText": "What subject did you most enjoy in school?",
      "dynamicParams": [],
      "staticParams": [],
      "requiredParams": [
          "subject"
      ],
      "alternates": [
          "What was your favorite class in school?",
          "What course did you most enjoy in school?"
      ],
      "NextDialogID": "025",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Education"
    },
    {
        "id": "025",
        "DialogText": "Could you tell me a bit more about why {{subject}} was your favorite subject?",
        "dynamicParams": [
            "subject"
        ],
        "staticParams": [],
        "alternates": [
            "Why was {{subject}} your favorite subject?",
            "Could you please tell me more about why {{subject}} was your favorite?"
        ],
        "NextDialogID": "027",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 30,
        "requireResponse": true,
        "userInterruptionEnabled": true,
        "section": "Education"
    },
    {
      "id": "027",
      "DialogText": "Did you participate in extracurricular activities in school? If so, which activities?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "In school, did you participate in extracurricular activities? And if so, which activities?",
          "Were there extracurricular activities that you participated in? And if so, which activities?"
      ],
      "NextDialogID": "028",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Education"
    },
    {
        "id": "028",
        "DialogText": "I would like to quiz you now on your general knowledge, are you ready?",
        "dynamicParams": [],
        "staticParams": [],
        "alternates": [
            "Are you ready to look at some general questions?",
            "look at the board, ready?"
        ],
        "NextDialogID": "029",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 6,
        "requireResponse": true,
        "userInterruptionEnabled": true,
        "section": "Education"
    },
    {
        "id": "029",
        "whiteboardType": "education",
        "count": 3,
        "NextDialogID": "039",
        "userInterruptionEnabled": false
    },
    {
        "id": "039",
        "DialogText": "Good job, lets move on. Just a few more questions. What would you say is your greatest personal attribute?",
        "dynamicParams": [],
        "staticParams": [
            "personName"
        ],
        "alternates": [
            "In your opinion, what is your single greatest strength?",
            "What do you believe is your greatest personal attribute?"
        ],
        "NextDialogID": "040",
        "unrecognizedResponse": "I'm sorry, I don't understand.",
        "timeLimit": 30,
        "requireResponse": true,
        "userInterruptionEnabled": true,
        "section": "Personal"
    },
    {
      "id": "040",
      "DialogText": "Great, thank you. Next, what attribute about yourself do you think could be most improved?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "In your opinion, what attribute about yourself could be most improved?",
          "What attribute of yourself do you believe is could be most improved?"
      ],
      "NextDialogID": "042",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Personal"
    },
    {
      "id": "042",
      "DialogText": "How well do you think you're performing in this interview right now?",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "How do you feel this interview is going?",
          "Do you think you are performing well in this interview?"
      ],
      "NextDialogID": "055",
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 30,
      "requireResponse": true,
      "userInterruptionEnabled": true,
      "section": "Personal"
    },
    {
      "id": "055",
      "DialogText": "Alright that was the last question. Do you have any questions for me?",
      "filterType": "SentimentFilter",
      "NextPositiveID": "056",
      "questionSection": true,
      "requireResponse": true,
      "timeLimit": 10,
      "NextDialogID": "056",
      "section": "Question"
    },
    {
      "id": "056",
      "DialogText": " thank you for coming in today, please have a great day!",
      "dynamicParams": [],
      "staticParams": [],
      "alternates": [
          "Thanks for coming in. Enjoy the rest of the day!",
          "It was great meeting you today. Thank you for coming in."
      ],
      "unrecognizedResponse": "I'm sorry, I don't understand.",
      "timeLimit": 10,
      "finalQuestion": true,
      "requireResponse": false,
      "userInterruptionEnabled": false,
      "section": "Closing"
    },
  ]
}

// var newNodes = {
//     "links": [],
//     "nodes": [
//       {
//         "DialogText": "Hello",
//         "NextDialogueID": "",
//         "id": "000",
//         "section": "Greeting"
//       }
//     ]
// }

let newNodes = {
  "links":[],
  "nodes":[]
}

function visualize(jsonArray) {
  for (let i=0; i < jsonArray["nodes"].length; i++) {
    let currentId, previousNode;
    const nextProps = ["NextDialogID", "NextPositiveID", "NextNegativeID"];
  
    currentId = jsonArray["nodes"][i]["id"];
  
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
      newNodes["nodes"][i]["position"] = { x: 200, y: 200};
      
    // Otherwise, dynamically add every other node  
    } else { 
      nextProps.forEach((nextProp) => {
        if (previousNode = newNodes["nodes"].find(node => node[nextProp] == currentId)) {
          let xPos = previousNode["position"].x;
          let sentiment = "";
  
          if (nextProp == "NextPositiveID") {
            xPos -= 200; // subtract 200 in order to place it on the left side
            sentiment = "yes";
  
          } else if (nextProp == "NextNegativeID") {
            xPos += 200; // add 200 in order to place it on the right side
            sentiment = "no";
          }
  
          newNodes["nodes"][i]["position"] = { x: xPos, y: previousNode["position"].y + 200 };
          newNodes["links"][i] = { 
            id: `${i}`,
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
    if (jsonArray["nodes"][i]["whiteboardType"]) {
      newNodes["nodes"][i]["data"]["label"] = "Whiteboard";
      newNodes["nodes"][i]["style"] = { padding: 50 };
    }
  }
}


    
console.log(newNodes["nodes"]);

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = (props) => {
    visualize(props.jsonArray);
    const [nodes, setNodes, onNodesChange] = useNodesState(newNodes["nodes"]);
    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(newNodes["links"]);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    let timeoutId = null;

    //For form modal popup
const [isModalOpen, setIsModalOpen] = useState(false);
/* const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
`;
const Dialog = styled.div`
    background: white;
    border-radius: 5px;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 600px;
`; */

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeMouseEnter={handlePopoverOpen}
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
                  timeoutId = setTimeout(handlePopoverClose, 1000);
                }}
              >

{isModalOpen && (
                <div>
                    {/* <Overlay>
                        <Dialog>
                            <Dialogue
                                handleDialogueChange= {props.handleDialogueChange}
                                dialogueObject = {props.questions[0]}
                                id = {props.questions[0].DialogueID}
                                key = {props.questions[0].DialogueID}
                            />
                            <button onClick={() => setIsModalOpen(false)}>SUBMIT</button>
                        </Dialog>
                    </Overlay> */}
                    <PopUpForm setTrigger={setIsModalOpen}></PopUpForm>
                </div> 
            )}
                <Button
                
                    onClick={(event) => {
                        setIsModalOpen(true)
                        console.log("Edit button clicked");
                        console.log(event.id);
                    }}
                >
                    EDIT
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Add button clicked");
                    }}
                >
                    ADD
                </Button>
                <Button
                    onClick={(event) => {
                        console.log("Delete button clicked");
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
    );
};

export default OverviewFlow;