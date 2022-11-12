import React from "react";

import './bootstrap.min.css'
import { Component, Fragment } from "react";
import './questionStyle.css';
//import {Link, Redirect} from 'react-router-dom';
import {Navigate} from 'react-router-dom';
//import Module from "../components/Module"
import Dialogue from "./components/Dialogue"
import JsonView from "./components/JsonView"
import NavBar from "./components/navbar"
//import Links from "../components/Links"
import { Layout, Popover } from 'antd';
import {Paper} from "@material-ui/core"
//import defaultJson from '../JSON/default.json'
//import Database from '../Database';
import Axios from 'axios'
import { Row, Col , Collapse, Space, Divider, PageHeader, Button, BackTop} from 'antd';
import { CaretRightOutlined, AudioOutlined, UpOutlined, DownOutlined, PlusOutlined , FormOutlined, RightOutlined, EditOutlined,DotChartOutlined, LeftOutlined, CopyOutlined, DownloadOutlined, DeleteOutlined, SaveOutlined, BoldOutlined} from '@ant-design/icons';
//import temp_graph from "../JSON/graph.json"
//import "../style/cirvrstudio-style.css"
import temp_graph from "./JSON/DemoScript-MTSU.json"
import './Database.css';
//import Navbar from "../components/navbar"
import OverviewFlow from "./Flow.js"
import { MultiSelectUnstyled } from "@mui/base";
import json from './GameDev.json'



//document.body.style ="background: #212F3C";
document.body.style ="background: 'white'";
const { Header, Footer, Sider, Content } = Layout;
const {Panel} = Collapse;

class CirvrStudio extends Component{

    constructor(props){
        super(props)
        this.state={
            count: 0,
            stringModel:"",
            jsonOpen: false,
            graphView: false,
            selectedNode:{},
            formSize:12,
            model:"",
            graph:{},
            wb_ids:[],
            jsonData:null,
            allDialogIDs:[],
            selectedInterruptionScriptName:"",
            selectedInterruptionScript:"",
            selectedWbScriptName:"", 
            selectedWbScript:{},
            dateCreated:"",
            dateModified:"",
            whiteboardQuizCount:0,
            existing_ids:[],    //This will keep track of all the ids in script for validation and to check if NextDialogID is valid
                                //And that there are no breaks in the graph links. 

            //model: this.props.location.state.data,
            //questionOpenDict: {"000": false}, //for which question is open
            redirect: false,
            finalQuestionid:"", //keep updating this if questions are added in personal module
            requiredParamsDict: {}
            //@todo: Figure out how to display the dialogue id in 000
        };
        //this.state.jsonData = this.props.location.state.jsonItem
        //this.state.count = this.props.location.state.jsonItem.numQuestions
        this.state.count = temp_graph["interviewerDialogs"].length
        //this.state.model = this.props.location.state.data; // loading data passed on by the interview-list
        this.state.model = temp_graph;
        //this.state.count = this.state.model["interviewerDialogs"].length
        //this.state.dateCreated= this.state.jsonData.dateCreated;
        //this.state.dateModified = this.state.jsonData.dateModified;

        //console.log("date created:", this.state.dateCreated);
        //console.log("date modified:", this.state.dateModified);
        //this.state.graph = this.props.location.state.graph;
        //this.state.graph = temp_graph
        //console.log("temp_graph", this.state.graph)
        //Assigning string version of model to the stringModel state variable
        this.state.stringModel = JSON.stringify(this.state.model, null,2)
        //console.log("Stringmodel: "+ this.state.stringModel)
        //Have to bind the function
        //1. Dialogue Text Change 
        this.handleDialogueChange=this.handleDialogueChange.bind(this);
        //2. Alternates Change 
        this.handleAlternatesChange=this.handleAlternatesChange.bind(this);
        //3. add alternated function
        this.addAlternates = this.addAlternates.bind(this);
        //4. Delete Alternate
        this.deleteAlternate = this.deleteAlternate.bind(this);
        //5. NextDialogID
        this.handleNextDialogIDChange=this.handleNextDialogIDChange.bind(this);
        //6. unrecognizedResponse
        this.handleErrorResponseChange = this.handleErrorResponseChange.bind(this);
        //7. handle Response Change 
        this.handleRequireResponseCheckboxChange=this.handleRequireResponseCheckboxChange.bind(this);
        this.updateDialogue = this.updateDialogue.bind(this);
        //8. Time limit
        this.handleTimeLimitChange=this.handleTimeLimitChange.bind(this)
        //9. Interruption changed enable/disable
        this.handleUserInterruptionChange = this.handleUserInterruptionChange.bind(this);
        //10. filter change 
        this.handleChangeFilter = this.handleChangeFilter.bind(this)
        //11. dynamic Params
        this.handleDynamicParamsChange = this.handleDynamicParamsChange.bind(this)
        //12. required Params
        this.handleRequiredParamsChange = this.handleRequiredParamsChange.bind(this)

        this.handleDialogIDChange=this.handleDialogIDChange.bind(this);

        this.downloadTxtFile = this.downloadTxtFile.bind(this);
        this.downloadQuestionsFile = this.downloadQuestionsFile.bind(this);
        this.wbChooseScriptChange = this.wbChooseScriptChange.bind(this);
        this.handleSectionChange = this.handleSectionChange.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
        this.handleJsonChange = this.handleJsonChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.togglePanel = this.togglePanel.bind(this)
        this.graphViewToggle=this.graphViewToggle.bind(this)
        this.questionsToggle = this.questionsToggle.bind(this)
        this.handleRedirect = this.handleRedirect.bind(this)
        this.handleChangeLessThan = this.handleChangeLessThan.bind(this);
        this.handleChangePivot = this.handleChangePivot.bind(this)
        this.updateQDict = this.updateQDict.bind(this);
        this.state.finalQuestionid = this.getStringId(this.state.count)
        this.interruptionChooseScriptChange = this.interruptionChooseScriptChange.bind(this);
        this.handleUpdateRequiredParamsDict = this.handleUpdateRequiredParamsDict.bind(this);
        this.handleInterruptionRadioGroupChange = this.handleInterruptionRadioGroupChange.bind(this);
        this.handleWbTypeChange = this.handleWbTypeChange.bind(this)

        //I forgot what this does. 
        this.state.model["interviewerDialogs"].map((question, index)=> { 

            this.handleUpdateRequiredParamsDict(question.DialogID, question.requiredParams)
            
        })
        this.createQueries()

        //this.state.selectedInterruptionScriptName = this.state.model["interviewerDialogs"].slice(-3,-2)[0].script

       /*this.state.whiteboardQuizCount = this.state.model["interviewerDialogs"].filter(item=>{

        if (item.whiteboardType!=null){
            return item
        }
       }).length;*/
       //console.log("wb count:", this.state.whiteboardQuizCount)

       this.state.existing_ids = this.state.model['interviewerDialogs'].map(item=> item.DialogID)
       console.log("Existing Ids:", this.state.existing_ids);
    
    }

    async createQueries() {
        await Axios({
          method: "GET",
          url: "http://localhost:5000/api/getJSONFiles",
          headers: {
            "Content-Type": "application/json"
          },
        }).then(res => {
          console.log(res.data);
          //var existing_ids = res.data.map(item => item.InterviewID);
         // console.log("existing_ids:", existing_ids)
         // this.setState({existing_ids});
          this.fetchDBResults(res.data);
        });
      }
      async fetchDBResults(jsonQuery) {

        const interviewData = jsonQuery
        //console.log("Interviewdata", interviewData)
        var wb_items = []
        var interruption_items = []
        
        //interviewData.map((item) => { return parseInt(item.InterviewID.slice(1)); });
        //console.log("idslist=", ids)
        //var type = ""
        for (var i=0; i<interviewData.length; i++){
          if (interviewData[i].InterviewID.slice(0, 1) === "W") {
            wb_items.push(interviewData[i])
          }
          else if (interviewData[i].InterviewID.slice(0, 1) === "I") {
            interruption_items.push(interviewData[i])
          }
         
        }
    
        /*this.setState({wb_ids:wb_items,
                        interruption_ids: interruption_items});
        console.log("interruption_ids", this.state.interruption_ids)
        for (var i=0; i< this.state.interruption_ids.length;i++){
            if (this.state.interruption_ids[i].title == this.state.selectedInterruptionScriptName){
                 this.setState({selectedInterruptionScript: this.state.interruption_ids[i].script["interruption"]})
                 break;
            }
        }*/

        console.log("interruption script", this.state.selectedInterruptionScript)
      }

    downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(this.state.model, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = this.state.jsonData.title+".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
       //this.downloadQuestionsFile();
      }

      downloadQuestionsFile = () => {
        const element = document.createElement("a");
        var text = ""
        for(var i=0; i<this.state.selectedInterruptionScript.length;i++){
            text+= this.state.selectedInterruptionScript[i].questionText + '\n'
            text+=this.state.selectedInterruptionScript[i].answerText +'\n'
        }
        
        console.log("text interruptions file:", text)
        
        const file = new Blob([text], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = this.state.selectedInterruptionScriptName+".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }
    //**************************************************************************SELECTED INTERRUPTION SCRIPT*****/
    interruptionChooseScriptChange(item){
        var model = this.state.model
         /*if (model["interviewerDialogs"].slice(-3,-2).script==null){
            model["interviewerDialogs"].slice(-3,-2)[0].push({"script":item})
         }
         else{*/
            model["interviewerDialogs"].slice(-3,-2)[0].script = item;

         //}
        var questions ={}
        for (var i=0; i< this.state.interruption_ids.length;i++){
            if (this.state.interruption_ids[i].title == item){
                questions = this.state.interruption_ids[i]
                break;
            }
        }
        console.log("questions script:", questions)
       

        
        console.log(model["interviewerDialogs"].slice(-3,-2)[0].script)
        var updatedStringModel = JSON.stringify(model,null,2)

        console.log("interruption Script Value", item)
        this.setState({selectedInterruptionScriptName:item,
            selectedInterruptionScript:questions.script["interruption"],
                    model, 
                    stringModel: updatedStringModel})

    }
    /////////////////////////WHITEBOARD SCRIPT CHANGE////////////////////////////////////
    wbChooseScriptChange(item, dialogIndex){
        var model = this.state.model
         
        model["interviewerDialogs"][dialogIndex].script = item;
        var questions ={}
        for (var i=0; i< this.state.wb_ids.length;i++){
            if (this.state.wb_ids[i].title == item){
                questions = this.state.wb_ids[i]
                break;
            }
        }
        console.log("wb script:", questions)
        console.log(model["interviewerDialogs"][dialogIndex].script)
        var updatedStringModel = JSON.stringify(model,null,2)

        console.log("wb Script Value", item)
        this.setState({selectedWbScriptName:item,
            selectedWbScript:questions.script["whiteboardQuestions"],
                    model, 
                    stringModel: updatedStringModel})

    }
    //////////////CHANGE WB TYPE ///////////////////////////
    handleWbTypeChange(event, dialogIndex){
        var model = this.state.model
         
        model["interviewerDialogs"][dialogIndex].whiteboardType = event.target.value;
       
        console.log(model["interviewerDialogs"][dialogIndex].whiteboardType)
        var updatedStringModel = JSON.stringify(model,null,2)

        this.setState({
                    model, 
                    stringModel: updatedStringModel})
    }
    /////////////////////////DATABASE CONNECTION @ToDo Switch to express///////////////////

    getStringId(intId){
        if(intId.length===1){
            return "00"+intId.toString()
        }
        else if(intId.length ===2){
            return "0"+ intId.toString()
        }
        else{
            return intId.toString()
        } 
    }
  
    //For deleting a dialogue. Takes the dialogue id as parameter
    handleDelete(event,id, moduleName, subId){
        //Update ids from the removed i
        this.setState({
            count: this.state.count-1,
            });
    }
    //***********************************************************************************************************************1.*DIALOGUE TEXT CHANGE */
    //Form input 1: Handler that updates the DialogText as the user is typing 
    handleDialogueChange(event, i, index){
        //console.log("moduleName: "+ moduleName);
        //console.log("subId:"+ subId)
        //console.log("id:"+ i)
        const newModel = this.state.model
        //console.log("pos:"+ id.toString())
        newModel["interviewerDialogs"][index].DialogText = event.target.value;
        const updatedStringModel = JSON.stringify(newModel,null,2)
        //console.log("stringmodel:"+ updatedStringModel)
        this.setState({
            model:newModel,
            stringModel: updatedStringModel
        });
    }
    //**********************************************************************************************************************2.*ALTERNATES ARRAY CHANGE */
    //Handler for Alternates text update as teh user types 
    handleAlternatesChange(event,i, dialogIndex,altIndex){
        const updateModel = this.state.model
        updateModel["interviewerDialogs"][dialogIndex].alternates[altIndex]=event.target.value;
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });

    }
    //*******************************************************************************************************************************3. ADD ALTERNATES */
    //For the button to add an alternate dialogue to the list
    addAlternates(i, dialogIndex)
    {
        const updateModel = this.state.model

        updateModel["interviewerDialogs"][dialogIndex].alternates.push([""]);
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
     //*****************************************************************************************************************************4. DELETE ALTERNATES */
    //For the button to add an alternate dialogue to the list
    deleteAlternate(i, dialogIndex, altIndex)
    {
        const updateModel = this.state.model

        updateModel["interviewerDialogs"][dialogIndex].alternates = [...this.state.model["interviewerDialogs"][dialogIndex].alternates.slice(0,altIndex), ...this.state.model["interviewerDialogs"][dialogIndex].alternates.slice(altIndex+1)];
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    //***********************************************************To Change Dialog ID
    //For the button to add an alternate dialogue to the list
    handleDialogIDChange(event,i, dialogIndex)
    {
        event.stopPropagation();
        const updateModel = this.state.model
        var existing_ids = this.state.existing_ids

       /* if(existing_ids.includes(event.target.value)){
            alert

        }*/
        updateModel["interviewerDialogs"][dialogIndex].DialogID= event.target.value;
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        //var allDialogIDs = updateModel.map((item)=> item.DialogID)
        
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel,
            //allDialogIDs
        });
    }
    //*****************************************************************************************************************************5. NEXT DIALOGUE ID CHANGE */
    //For the button to add an alternate dialogue to the list
    handleNextDialogIDChange(event,mode,dialogIndex)
    {
        const updateModel = this.state.model



        switch(mode){

            case "regular":
                updateModel["interviewerDialogs"][dialogIndex].NextDialogID= event.target.value;
                break;
            case "left":
                updateModel["interviewerDialogs"][dialogIndex].childMap.LESS_THAN= event.target.value;
                break;
            case "right":
                updateModel["interviewerDialogs"][dialogIndex].childMap.GREATER_THAN= event.target.value;
                updateModel["interviewerDialogs"][dialogIndex].childMap.EQUAL_TO= event.target.value;
                break;
        }
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    //*****************************************************************************************************************************6. ERROR RESPONSE CHANGE */
    //For the button to add an alternate dialogue to the list
    handleErrorResponseChange(event,i, dialogIndex)
    {
        const updateModel = this.state.model

        updateModel["interviewerDialogs"][dialogIndex].unrecognizedResponse= event.target.value; // remove this from the ones that don't require a response
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    //***********************************************************************************************************************7. REQUIRE RESPONSE CHECKBOX */
    //Handler for the requireResponse checkbox
    //Changes chekbox to checked or unchecked
    //Of checked, then the entire question is updated. 
   
    //************************************************************************************************************************************8. TIME LIMIT */
    //Handler for time Limit changes as the user changes 
    handleTimeLimitChange(val,i, dialogIndex){
        //storing the dialogues array in another array
        const updateTimeLimit = this.state.model
        //updating the value
        updateTimeLimit["interviewerDialogs"][dialogIndex].timeLimit=val;
        //passing the whole array to the state 
        const updatedStringModel = JSON.stringify(updateTimeLimit,null,2)

        this.setState({
            model: updateTimeLimit,
            stringModel: updatedStringModel
        });
        
    }
    //****************************************************************************************************************** 9. USER INTERRUPTION BOOL CHECKBOX */
    //Handler for userInterruption Variable 
    handleUserInterruptionChange(event,i,dialogIndex){
        const updateModel = this.state.model

        updateModel["interviewerDialogs"][dialogIndex].userInterruptionEnabled=event.target.checked;
        const updatedStringModel = JSON.stringify(updateModel,null,2)

        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    
    //******************************************************************************************************************10.* FILTERS CHANGE */
    //Sentiment or number filter
    async handleChangeFilter(val, id, dialogIndex){

        console.log("Filter Value:", val)
        const updateModel = this.state.model
        var curVal ="" //current Value 
        const question = updateModel["interviewerDialogs"][dialogIndex]
        if (question.filterType!=null){
            curVal=question.filterType
        }
        if (curVal==val){
            //Do nothing
        }
        console.log("current Value:", curVal)


        var newObj = {}
        if(curVal == "NumberEntityFilter" && val == "SentimentFilter"){
                newObj ={
                    "DialogID": question.DialogID,
                    "DialogText": question.DialogText,
                    "dynamicParams": question.dynamicParams,
                    "staticParams": question.staticParams,
                    "alternates": question.alternates,
                    "requiredParams": question.requiredParams!==null? question.requiredParams:null,
                    "filterType": val,
                    "childMap": {
                    "LESS_THAN": question.childMap.LESS_THAN,
                    "GREATER_THAN": question.childMap.GREATER_THAN,
                    "EQUAL_TO": question.childMap.EQUAL_TO
                    },
                    "timeLimit": question.timeLimit,
                    "requireResponse": question.requireResponse,
                    "section": question.section
                }
                updateModel["interviewerDialogs"] [dialogIndex]= newObj;

        }
        else if (curVal=="SentimentFilter" &&  val=="NumberEntityFilter"){
            newObj ={
                "DialogID": question.DialogID,
                "DialogText": question.DialogText,
                "dynamicParams": question.dynamicParams,
                "staticParams": question.staticParams,
                "alternates": question.alternates,
                "requiredParams": question.requiredParams!==null? question.requiredParams:null,
                "filterType": val,
                "numberEntityPivot": 0,
                "childMap": {
                    "LESS_THAN": question.childMap.LESS_THAN,
                    "GREATER_THAN": question.childMap.GREATER_THAN,
                    "EQUAL_TO": question.childMap.EQUAL_TO
                },
                "timeLimit": question.timeLimit,
                "requireResponse": question.requireResponse,
                "section": question.section
            }
            curVal=""
            updateModel["interviewerDialogs"] [dialogIndex]= newObj;

        }
        else if (curVal=="SentimentFilter" && val=="null" || (curVal=="NumberEntityFilter" && val=="null")){
            newObj ={
                "DialogID": question.DialogID,
                "DialogText": question.DialogText,
                "dynamicParams": question.dynamicParams,
                "staticParams": question.staticParams,
                "alternates": question.alternates,
                "requiredParams": question.requiredParams!==null? question.requiredParams:null,
                "timeLimit": question.timeLimit,
                "NextDialogID": "",
                "requireResponse": question.requireResponse,
                "section":question.section
            }
            curVal=""
            updateModel["interviewerDialogs"] [dialogIndex]= newObj;

        }
        else if (curVal=="" && val=="NumberEntityFilter"){
            newObj ={
                "DialogID": question.DialogID,
                "DialogText": question.DialogText,
                "dynamicParams": question.dynamicParams,
                "staticParams": question.staticParams,
                "alternates": question.alternates,
                "requiredParams": question.requiredParams!==null? question.requiredParams:null,
                "filterType": val,
                "numberEntityPivot": 0,
                "childMap": {
                    "LESS_THAN": question.NextDialogID,
                    "GREATER_THAN": "",
                    "EQUAL_TO": ""
                },
                "timeLimit": question.timeLimit,
                "requireResponse": question.requireResponse,
                "section": question.section
            }
            curVal=""
            updateModel["interviewerDialogs"] [dialogIndex]= newObj;
        }
        else if (curVal=="" && val==="SentimentFilter") {
            newObj ={
                "DialogID": question.DialogID,
                "DialogText": question.DialogText,
                "dynamicParams": question.dynamicParams,
                "staticParams": question.staticParams,
                "alternates": question.alternates,
                "requiredParams": question.requiredParams!==null? question.requiredParams:null,
                "filterType": val,
                "childMap": {
                    "LESS_THAN": question.NextDialogID,
                    "GREATER_THAN": "",
                    "EQUAL_TO": ""
                    },
                "timeLimit": question.timeLimit,
                "requireResponse": question.requireResponse,
                "section": question.section
            }
            curVal=""
            updateModel["interviewerDialogs"] [dialogIndex]= newObj;
          
        }
        
        const updatedStringModel = JSON.stringify(updateModel,null,2)

        this.setState({
            model: updateModel,
            stringModel: updatedStringModel
        })
        console.log("model after filter change:", this.state.model["interviewerDialogs"][dialogIndex])

    }
    
    //***************************************************************************************************************UPDATE JSON VIEW */
    handleJsonChange(event){
        //Make this so that the user cannot modify everything 
        const newstringModel = event.target.value;
        var json = JSON.parse(newstringModel)
        this.setState({
           stringModel: newstringModel, 
           model:json 
        });
    }
        
    handleChangeLessThan(event, i, moduleName, subId){
        
    }
    //****************************************************************************************************************PIVOT VALUE */
    handleChangePivot(event,dialogIndex){

        console.log("pivot:"+ event.target.value.type)

        const updateModel = this.state.model
        updateModel["interviewerDialogs"][dialogIndex].numberEntityPivot= parseInt(event.target.value);
        const updatedStringModel = JSON.stringify(updateModel,null,2)

        this.setState({
            model: updateModel,
            stringModel: updatedStringModel
        })

    }

    //***************************************************************************************************************SAVE TO DATABASE */
    handleSubmit(){
        console.log("jsonData: "+ this.state.jsonData.toString())
        var today = new Date();

        const item = this.state.jsonData;
        item.script = this.state.model;
        item.numQuestions = this.state.model["interviewerDialogs"].length;
        item.dateModified = today.toDateString("YYYY-MM-dd") + " "+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
        //Before saving - first check if all keys in nextDialogId exist
        this.setState({jsonData:item})
        console.log(this.state.jsonData)
        this.updateDB(this.state.jsonData)
    }
    async updateDB(item){
        var item = item
        var today = new Date();
        item.dateModified=today.toDateString("YYYY-MM-dd") + " "+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
        await Axios({
            method: "PUT",
            url: "http://localhost:5000/api/updateJSONFile",
            headers: {
              "Content-Type": "application/json"
            },
            data: item
          }).then(res => {
            //console.log("update Item:"+ item.title.toString());
          });
        
    }
    //*************************************************************************************************************JSON VIEW TOGGLE PANEL */
    //To collapse and open the JSON panel
    togglePanel(){
        this.setState({jsonOpen: !this.state.jsonOpen});
    }
    //*************************************************************************************************************GRAPH VIEW TOGGLE */
    graphViewToggle(){
        this.setState({graphView: !this.state.graphView});
    }

    //**************************************************************************************************************OPENING THE DRAWER */
    questionsToggle(id){
        const updateDict= this.state.questionOpenDict

        updateDict[id] = !this.state.questionOpenDict[id]
        this.setState({questionOpenDict: updateDict})
        console.log("Inside questionsToggle:", this.state.questionOpenDict)

    }
    //11.*************************************************************************************************************Changing Dynamic Params */
    handleDynamicParamsChange(value, dialogIndex){
        const model = this.state.model
        model["interviewerDialogs"][dialogIndex].dynamicParams = value
        const updatedStringModel = JSON.stringify(model,null,2)
        console.log("value: ", value)
        this.setState({
            model,
            stringModel: updatedStringModel
        })
        
    }
    //***************************************************************************Handle Required Params Change */
    handleRequiredParamsChange(tags, i, dialogIndex){
        const model = this.state.model
        console.log("model: ", model)
        model["interviewerDialogs"][dialogIndex].requiredParams = tags
        console.log("Event value: "+ model["interviewerDialogs"][dialogIndex].requiredParams)
        const updatedStringModel = JSON.stringify(model,null,2)
        this.handleUpdateRequiredParamsDict(i, tags);
        this.setState({
            model,
            stringModel: updatedStringModel
        })
    }
    /*****************************************************************************Update required params list*/
    handleUpdateRequiredParamsDict(id, params)
    {
        var requiredParamsDict = this.state.requiredParamsDict
        requiredParamsDict[id]= params;
        this.setState({requiredParamsDict})
        //console.log("Required Params Dictionary: "+ JSON.stringify(this.state.requiredParamsDict))
    }
    //*********************************************************************Require response change */
    handleRequireResponseCheckboxChange(e, dialogIndex){
        const updateModel = this.state.model
        console.log("checked box", e)

        updateModel["interviewerDialogs"][dialogIndex].requireResponse= e; // remove this from the ones that don't require a response
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    //****************************************************************************************************/
    handleInterruptionRadioGroupChange(e, dialogIndex){
        const updateModel = this.state.model

        if(e.target.value==="null"){
            updateModel["interviewerDialogs"][dialogIndex].Interruptee= null; // remove this from the ones that don't require a response

        }
        else{
            updateModel["interviewerDialogs"][dialogIndex].Interruptee= e.target.value; // remove this from the ones that don't require a response

        }
        const updatedStringModel = JSON.stringify(updateModel,null,2);
        this.setState({
            
            model: updateModel,
            stringModel: updatedStringModel
        });
    }
    //*************************************************************************************************************FOR THE REDIRECT BACK BUTTON */
    handleRedirect(){

        //@TODO: Add a modal to see if the old model==updatedmodel, 
        //Ask user to save changes
        this.setState({redirect:true})
        
    }

    componentDidMount(){
       // this.setState({model: this.props.location.state.data});
    }
    //****************************UPDATE for GRAPH */
    updateQDict(id){
        const questionOpenDict=this.state.questionOpenDict
        questionOpenDict[id] = false
        this.setState({questionOpenDict})
        console.log("updateQDict:", this.state.questionOpenDict)


    }
    getIndexOfDialog(id)
    {
        for(var i=0; i< this.state.model["interviewerDialogs"].length;i++){
            if(this.state.model["interviewerDialogs"][i].DialogID===id){
                return i
            }
        }
    }
    
    updateDialogue(dobj, dialogIndex){
        const model = this.state.model
        model["interviewerDialogs"][dialogIndex] = dobj;
        const updatedStringModel = JSON.stringify(model,null,2)
        this.setState({
            
            model,
            stringModel: updatedStringModel,
       })
        console.log("updateModel after section change", this.state.model["interviewerDialogs"][dialogIndex]);

    }
    //@todo: For some reason this does not work for PreviousWorkExperience and Personal
    handleSectionChange(value, dialogIndex){
        console.log("Selected:", value)
        var model = this.state.model

        model["interviewerDialogs"][dialogIndex]["section"] = value;
        console.log("updateModel after section change", model["interviewerDialogs"][dialogIndex].section);
        const updatedStringModel = JSON.stringify(model,null,2)

        this.setState({
            model,
            stringModel: updatedStringModel}, ()=> {        
            //The setState method is asynchronous and might not show the updated value in the JSON just yet. 
            //you can make sure it really changed, by adding the print statement in the callback method. 
            console.log(this.state.model["interviewerDialogs"][dialogIndex]["section"])
        });
    }
    

    addExtra(i, question){

        const popContent = (
            <div>
                <Button  onClick={event=>{
                event.stopPropagation() //this prevents the trigger for collapse using this button
                this.addNewQuestion(i, "before", null)} }>Interview Question</Button>
                <Button onClick={event=>{
                event.stopPropagation() //this prevents the trigger for collapse using this button
                this.addNewQuestion(i, "before", "wb")}} 
                disabled={this.state.whiteboardQuizCount==3}>Whiteboard Quiz</Button>
            </div>
        )
        const popContentAfter = (
            <div>
                <Button  onClick={event=>{
                event.stopPropagation() //this prevents the trigger for collapse using this button
                this.addNewQuestion(i, "after", null)

                } }>Interview Question</Button>
                <Button onClick={event=>{
                event.stopPropagation() //this prevents the trigger for collapse using this button
                this.addNewQuestion(i, "after", "wb")

                } }disabled={this.state.whiteboardQuizCount==3}>Whiteboard Quiz</Button>
            </div>
        )
        return(
        <Space size="large">
            <Popover content={popContent}>
                <Button
                disabled={question.DialogID=="ending001"|| question.DialogID=="UserResponseTooLong"|| question.DialogID=="survey001"|| question.DialogID=="survey002" || question.DialogID=="question001"}

               
                ><UpOutlined/>Add Before</Button>
            </Popover>
            
            <Popover content={popContentAfter}>
                <Button
                disabled={question.DialogID=="ending001"|| question.DialogID=="UserResponseTooLong"|| question.DialogID=="survey001"|| question.DialogID=="survey002" || question.DialogID=="question001"}
                ><DownOutlined/>Add After </Button> 
            </Popover>
            
            <Button
            disabled={question.DialogID=="ending001"|| question.DialogID=="UserResponseTooLong"|| question.DialogID=="survey001"|| question.DialogID=="survey002" || question.DialogID=="question001"}

            onClick={event=>{
                event.stopPropagation() //this prevents the trigger for collapse using this button
                this.onDelete(i)
            }}>
                <DeleteOutlined />
            </Button>
        </Space>);

    }
    addNewQuestion(index, mode, type ){

        var updateModel = this.state.model
        var newObj={}
        
      
            switch(mode){
                case "after":
                    if (type=="wb"){

                        //@todo: give them option to choose the name of the whiteboard script 
                        newObj={
                            "DialogID": "",
                            "NextDialogID": updateModel["interviewerDialogs"][index+1].DialogID,
                            "whiteboardType": "education", 
                            "count": 0,
                           //"script":""//This is the script name from dropdown
                        }
                        updateModel["interviewerDialogs"]= [...this.state.model["interviewerDialogs"].slice(0,index+1),
                                                                    newObj,
                                                                    ...this.state.model["interviewerDialogs"].slice(index+1)]
                            
                                const updatedStringModel = JSON.stringify(updateModel,null,2)
                                this.setState({
                                    model: updateModel,
                                    stringModel: updatedStringModel,
                                    whiteboardQuizCount: this.state.whiteboardQuizCount+1
                                })
            
            
                    }
                    else
                    {
                        newObj ={
                            "DialogID": "",
                            "DialogText": "",
                            "dynamicParams": [],
                            "staticParams": [],
                            "alternates": [],
                            "requiredParams": [],
                            "timeLimit": 10,
                            "NextDialogID": "",
                            "requireResponse": false,
                            "section":updateModel["interviewerDialogs"][index].section
                        }
                        updateModel["interviewerDialogs"]= [...this.state.model["interviewerDialogs"].slice(0,index+1),
                                                            newObj,
                                                            ...this.state.model["interviewerDialogs"].slice(index+1)]
                    
                        const updatedStringModel = JSON.stringify(updateModel,null,2)
                        this.setState({
                            model: updateModel,
                            stringModel: updatedStringModel
                        })
                    }
                break;
                case "before":
                    if (type=="wb"){

                        //@todo: give them option to choose the name of the whiteboard script 
                        newObj={
                            "DialogID": "",
                            "NextDialogID": updateModel["interviewerDialogs"][index+1].DialogID,
                            "whiteboardType": "education", 
                            "count": 0,
                            //"script":"" //chosen and filled by dropdown
                            
                        }
                        updateModel["interviewerDialogs"]= [...this.state.model["interviewerDialogs"].slice(0,index),
                                                                    newObj,
                                                                    ...this.state.model["interviewerDialogs"].slice(index)]
                            
                                const updatedStringModel = JSON.stringify(updateModel,null,2)
                                this.setState({
                                    model: updateModel,
                                    stringModel: updatedStringModel,
                                    whiteboardQuizCount: this.state.whiteboardQuizCount+1

                                })
            
            
                    }else
                    {
                    newObj ={
                        "DialogID": "",
                        "DialogText": "",
                        "dynamicParams": [],
                        "staticParams": [],
                        "alternates": [],
                        "requiredParams": [],
                        "timeLimit": 10,
                        "NextDialogID": "",
                        "requireResponse": false,
                        "section":updateModel["interviewerDialogs"][index].section
                    }
                    updateModel["interviewerDialogs"]= [...this.state.model["interviewerDialogs"].slice(0,index),
                                                        newObj,
                                                        ...this.state.model["interviewerDialogs"].slice(index)]
                
                    const updatedStringModel = JSON.stringify(updateModel,null,2)
                    this.setState({
                        model: updateModel,
                        stringModel: updatedStringModel
                    })

                } 
                break;  
               
            
        }
    }

    onDelete(index){
        var updateModel = this.state.model

        // At any given point only 2 + 1 stress wb sections are allowed. 1 for education, another for technical. 
        //In CIRVR, the user will choose where to place it 
        var wbcount = this.state.whiteboardQuizCount
        if (updateModel["interviewerDialogs"][index].whiteboardType!=null){
            wbcount = wbcount-1
        }
        updateModel["interviewerDialogs"]= [...this.state.model["interviewerDialogs"].slice(0,index),
        ...this.state.model["interviewerDialogs"].slice(index+1)]
                    const updatedStringModel = JSON.stringify(updateModel,null,2)
        
        this.setState({
            model: updateModel,
            stringModel: updatedStringModel, 
            whiteboardQuizCount: wbcount 
            
        }, ()=> {console.log("wbcount:", this.state.whiteboardQuizCount)})
    }

    //**************************************************************** */
    /*
    getStringId(intId){
        if(intId.toString().length==1){
            return "00"+intId.toString()
        }
        else if(intId.toString().length ==2){
            return "0"+ intId.toString()
        }
        else{
            return intId.toString()
        } 
      }
      */
    downloadFiles(){
        //this.downloadTxtFile();
        this.downloadQuestionsFile();
    }

    render(){

        //Redirecting back to the list page 
        if(this.state.redirect === true){
            return <Navigate to="/" /*to="/interview-list"*//>  /*had to update Redirect to Navigate*/
        }
        
        //<Button style={{backgroundColor:"#F5CBA7"}} onClick={this.onInsertBefore(question.DialogID, "skinny", index)}>Whiteboard</Button>
        //<Button style={{backgroundColor:"#F9E79F"}} onClick={this.onInsertBefore(question.DialogID, "special", index)}>Filter</Button>

        var dialogues = (  
            <div>
            {this.state.model["interviewerDialogs"].map((question, index)=> { 
                var color=""
               /* if(question.whiteboardType!=null){
                    color="#F5CBA7"
                }
                else if(question.filterType!=null){
                    color="#F9E79F"
                }*/
                if (question.section=="Greeting"){
                    color = "#F4F6F6";
                }
                else if (question.section=="Technical"){
                    color = "#FEF9E7";
                }
                else if (question.section="Education"){
                    color="#D6EAF8"
                }
               
                 else if (question.section="Personal"){
                    color="#D5F5E3"
                }
                else if (question.section="PreviousWorkExperience"){
                    color="#F5EEF8"
                }
                else{
                    
                    color="white"
                }
                
                return (<Collapse
                    bordered={true}
                    //defaultActiveKey={}
                    expandIcon={({ isActive }) => <EditOutlined rotate={isActive ? 90 : 0} />}
                    style={{paddingBottom:"10px", zIndex:1, color:"white"}}
                    //className="site-collapse-custom-collapse"
                    >
    
                        <Panel header={question.whiteboardType==null? (question.DialogID+ " "+ question.DialogText): "Whiteboard Quiz"} 
                                key={index} //Note: Do not make the key the dialog ID, because the dialog id is mutable. Panel will keep collapsing on change.
                                extra={question.section!=="Greeting"? this.addExtra(index, question):null}
                                disabled={question.DialogID=="ending001"|| question.DialogID=="UserResponseTooLong"|| question.DialogID=="survey001"|| question.DialogID=="survey002"}
                                >
                                <Dialogue
                                id={(question.DialogID)}
                                dialogueObject={question}
                                index={index}
                                model={this.state.model}
                                stringModel={this.state.stringModel}
                               // visible={this.state.questionOpenDict[question.DialogID]}
                                questionsToggle={this.questionsToggle}
                                handleDialogueChange={this.handleDialogueChange}
                                handleAlternatesChange={this.handleAlternatesChange}
                                addAlternates= {this.addAlternates}
                                deleteAlternate={this.deleteAlternate}
                                handleDynamicParamsChange={this.handleDynamicParamsChange}
                                handleRequiredParamsChange={this.handleRequiredParamsChange}
                                handleNextDialogIDChange={this.handleNextDialogIDChange}
                               // handleErrorResponseChange={this.handleErrorResponseChange}
                                //handleResponseChange={this.handleResponseChange}
                                handleCheckboxChange={this.handleRequireResponseCheckboxChange}
                                handleInterruptionTypeChange = {this.handleInterruptionRadioGroupChange}
                                handleTimeLimitChange={this.handleTimeLimitChange}
                                handleSectionChange = {this.handleSectionChange}
                                handleFilterChange = {this.handleChangeFilter}
                                handleChangePivot = {this.handleChangePivot}
                                updateDialogue ={this.updateDialogue}
                                interruption_ids ={this.state.interruption_ids}
                                wb_ids = {this.state.wb_ids}
                                interruptionChooseScriptChange={this.interruptionChooseScriptChange}
                                wbChooseScriptChange = {this.wbChooseScriptChange}
                                handleWbTypeChange = {this.handleWbTypeChange}
                                //handleUserInterruptionChange={this.handleUserInterruptionChange}
                                //handleUpdateRequiredParamsDict={this.handleUpdateRequiredParamsDict}
                                handleDialogIDChange= {this.handleDialogIDChange}
                                requiredParamsDict = {this.state.requiredParamsDict}
                                existing_ids = {this.state.existing_ids} //this is being passed to check dialogue id change 
                                
                                />
                            </Panel>
                    </Collapse>)

                        })}
                </div>)
        /* wbScriptDropDown =
        (<Row>  <Select
            style={{ width: '500px' }}
            placeholder="Choose Whiteboard Script"
            defaultValue={this.state.dialogueObject.script}
            onChange={(value)=>this.props.wbChooseScriptChange(value, this.state.index)}>
            {
                this.props.wb_ids.map((ans, pos)=>
                { 
                    ///console.log("dynamic params: ",ans)

                return(
                    <Option id={pos} /*draggable onDragStart={(event)=>this.startDrag(event,ans)} key={pos} value={ans.title}>{ans.title}</Option>)})
            }
            
        </Select>
            </Row>)*/

        return (
        
        <div style={{ height: 800 }}>
          <OverviewFlow/>
         </div>
       );

        
    };
};

export default CirvrStudio;


/*                          <Col span={24} xs={24} sm={24} md={24} lg={this.state.graphView?12:24}>
                                <Graph graph={this.state.graph}
                                    model={this.state.model}
                                    questionsToggle={this.questionsToggle}
                                    questionOpenDict={this.state.questionOpenDict}
                                    updateQDict={this.updateQDict}
                                    handleDialogueChange={this.handleDialogueChange}
                                    handleAlternatesChange={this.handleAlternatesChange}
                                    addAlternates= {this.addAlternates}
                                    deleteAlternate={this.deleteAlternate}
                                    handleNextDialogIDChange={this.handleNextDialogIDChange}
                                    handleErrorResponseChange={this.handleErrorResponseChange}
                                    handleResponseChange={this.handleResponseChange}
                                    handleTimeLimitChange={this.handleTimeLimitChange}
                                    handleUserInterruptionChange={this.handleUserInterruptionChange}
                                    count={this.state.count}
                                ></Graph>
                            
                                                        <!--<D3graph model ={this.state.model}/>-->

                            </Col>         

                                <Button style={{minWidth:"140px", backgroundColor:color}} key={(question.DialogID).toString()} id={(question.DialogID).toString()} onClick={()=> this.questionsToggle(question.DialogID)} variant="contained">{question.DialogID}</Button> 

                    }*/ 

