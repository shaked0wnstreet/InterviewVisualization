import React, { useState } from "react";
import { Component } from "react";
import { Drawer, Form, Button, Col, Row, Checkbox, Select, DatePicker, Input, InputNumber } from 'antd';
import '../questionStyle.css';
import { AudioOutlined, PlusOutlined , DownOutlined,CaretRightOutlined, QuestionCircleOutlined, MinusCircleTwoTone, FormOutlined, RightOutlined, DotChartOutlined, LeftOutlined, CopyOutlined, DownloadOutlined, DeleteOutlined, SaveOutlined, ConsoleSqlOutlined} from '@ant-design/icons';
import {Popover, Tooltip, Card, Menu, Collapse, Dropdown, Radio } from 'antd'
import EditableTagGroup from "./RequiredParamsTags"
//import Axios from 'axios'
import { MenuItem, Stack, TextField, FormControlLabel } from '@mui/material';


const {TextArea} = Input;
const { Option } = Select;

const { Panel } = Collapse;

//For sections dropdown
function handleChange(value) {
  console.log(`selected ${value}`);
}

export default class Dialogue extends React.Component{

    constructor(props){
        super(props);
        this.state={
            key: props.key,
            id: props.id,
            index: props.index,
            dialogueObject: props.dialogueObject,
            model:this.props.model,
            stringModel:this.props.stringModel,
           // visible: props.visible,
            size: null,
            validateStatus: null,
            errorMsg: null,
            firstDialog: null,
            requireResponse: props.dialogueObject.requireResponse,
            interruptee: props.dialogueObject.Interruptee,
            timeLimit: props.dialogueObject.timeLimit,
            //errorResponse: props.dialogueObject.unrecognizedResponse,
            questionsToggle: props.questionsToggle,
            handleDialogueChange: props.handleDialogueChange, //func
            handleAlternatesChange: props.handleAlternatesChange,
            addAlternates: props.addAlternates, //func
            deleteAlternate: props.deleteAlternate, //func
            filter: props.dialogueObject.filterType,
            handleNextDialogIDChange: props.handleNextDialogIDChange, //func
            //handleErrorResponseChange: props.handleErrorResponseChange, //func
            handleResponseChange: props.handleResponseChange,  //func
            handleTimeLimitChange: props.handleTimeLimitChange, //func
            handleCheckboxChange: props.handleCheckboxChange,
            //handleUserInterruptionChange: props.handleUserInterruptionChange, //func
            handleFilterChange: props.handleFilterChange, //func
            handleDynamicParamsChange: props.handleDynamicParamsChange, //func
            handleRequiredParamsChange: props.handleRequiredParamsChange, //func
            //handleUpdateRequiredParamsDict: props.handleUpdateRequiredParamsDict,
            handleSectionChange: props.handleSectionChange,
            handleDialogIDChange: props.handleDialogIDChange,
            requiredParamsDict: props.requiredParamsDict,
            handleChangePivot: props.handleChangePivot, //func
            paramsList: [] //list of dynamic params option that are available to the question from all the required params before the current dialogue id.
  
        }

        //this.onClose = this.onClose.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleCheckboxResponse= this.handleCheckboxResponse.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleErrorChange= this.handleErrorChange.bind(this);

        if(this.state.dialogueObject.DialogID == "000"){
            this.setState({firstDialog:"disabled"})
        }
        else{
            this.setState({firstDialog: null})
        }
        var paramsSet= new Set()
        //this.state.handleUpdateRequiredParamsDict(this.state.dialogueObject.DialogID, this.state.dialogueObject.requiredParams)
        for (const [key,value] of Object.entries(this.state.requiredParamsDict))
        {
            if(parseInt(key)<=parseInt(this.state.id)){
                if(value!=null){
                    for ( const [k, val] of Object.entries(value)){
                        paramsSet.add(val)
                    }
                }
            }
            
        }
        this.state.paramsList = Array.from(paramsSet)
        
    }
  
    
    /*onClose(){
        this.setState({
            visible: false,
          });
        this.state.questionsToggle(this.state.id)
    }*/
    validateTimeLimit(timeLimit) {
        if (timeLimit>=10 && timeLimit<=120) {
          return {
            validateStatus: 'success',
            errorMsg: null,
          };
        }
        return {
          validateStatus: 'error',
          errorMsg: 'Time limit should be >=10 or <=120 seconds!',
        };
      }
    
    
    componentDidMount() {
        window.addEventListener("resize", this.updateWindowDimensions());
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }
    
    
    updateWindowDimensions() {
        
        if(window.innerWidth>=320 && window.innerWidth<720){
            this.setState({ size: window.innerWidth });
        }
        else if(window.innerWidth>=720 && window.innerWidth<800){
            this.setState({size:window.innerWidth-100})
        }
        else if(window.innerWidth>=800 && window.innerWidth<=1024) {
            this.setState({size:window.innerWidth-100})    
        }
        else if(window.innerWidth>1024){
            this.setState({size: window.innerWidth-1000})
        }
    }
    handleCheckboxResponse(event){
        const model = this.state.model
        console.log(event.target.checked)
        //console.log(this.state.requireResponse)
        this.setState({requireResponse:event.target.checked})
        this.state.handleCheckboxChange(event.target.checked, this.state.index)
    }
   
    handleTimeChange(value){
        this.setState({
            ...this.validateTimeLimit(value),
            timeLimit: value})
        this.state.handleTimeLimitChange(value, this.state.id, this.state.index)

    }
    handleSecChange(event){
        console.log("Dialogue section change:", event)
        const dialogueObject = this.state.dialogueObject
        dialogueObject.section = event;
        this.props.updateDialogue(dialogueObject, this.state.index)
        //this.state.handleSectionChange(event.target.value, this.state.index);
    }
    handleErrorChange(event){
        this.setState({errorResponse: event.target.value})
        this.state.handleErrorResponseChange(event, this.state.id,this.state.index)
    }
    filterChange(value){
        if (value=="null"){
            this.setState({filter:null, state:this.state}, ()=>{console.log("filterNew:", this.state.filter)})

        }else{
            this.setState({filter:value, state: this.state}, ()=>{console.log("filterNew:", this.state.filter)})

        }
        this.props.handleFilterChange(value,this.state.id,this.state.index )
    }
/* startDrag(ev, value) {
        ev.dataTransfer.setData("drag-item", ev.target.id);
        console.log("ans:", value)
    }
    drop(ev) {
        const droppedItem = ev.dataTransfer.getData("drag-item");
        console.log("DroppedItem: "+ droppedItem)
        if (droppedItem) {
            console.log("DroppedItem: "+ droppedItem)
            ev.target.appendChild(document.getElementById(droppedItem))

        }
    }
    dragOver(ev){
        ev.preventDefault()
    }*/
    
    //Put this entire form in a grid
    render(){
       
        if(this.state.requireResponse)
        {
            var timeLimit = (
                <div nowrap>
                    <Form.Item label="Time Limit (seconds)" 
                    validateStatus={this.state.validateStatus}
                    help={this.state.errorMsg}
                    hasFeedback
                    rules={[{
                        required: this.state.timeLimit,
                        
                    }]}
                    >
                        
                        <InputNumber disabled={this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001"?true: false}
                          style={{width:"60px"}} name="timelimit"  min={10} max={120} value={this.state.timeLimit} onChange={(value)=>this.handleTimeChange(value)}> </InputNumber>
                        
                    </Form.Item>
                </div>
            )
        }
        /*if(this.state.requireResponse)
        {
            var errorResponse = (
                <div nowrap>
                    <Form.Item label="Error Response">
                        <Input disabled={this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001"?true: false} style={{width: "100%"}} name="unrecognizedResponse"  value={this.state.errorResponse} onChange={(event)=>this.handleErrorChange(event)}></Input>
                    </Form.Item>
            </div>
            )
        }*/
        const dynamicPopOver =(<div>These parameters are the entities grabbed from the user's previous answer to a question that is meant to be included in the Dialog Text to ask for a follow-up question about a specific entities.
            <pre>
                {"Add to the dialogue in this format: "} 
                {"'Rate your level of experience with {{skill}}', if the dynamic parameter is 'skill'"} 
            </pre>
        </div>)

        const requiredParamsPopover =(<div>
            The entities that are captured from the users response. 
        </div>)

        //@todo: This was to validate stuff

       /* const checkDialogueText= (rule, value) => {
            if (value.number > 0) {
            return Promise.resolve();
            }
            return Promise.reject('Price must be greater than zero!');
        };*/
        //For the filters
        //Should change this just a tad bit - If user know what type of answers we are receiving, then automate. 
        if(this.state.requireResponse){
            var technical =(
                <div nowrap>
                    <Form.Item label="Choose expected response type:">
                        <Select defaultValue={this.state.dialogueObject.filterType!=null? this.state.dialogueObject.filterType: "null"}  style={{ width: 400}} onChange={(value)=>this.filterChange(value)}>
                            <Option value="SentimentFilter">Positive/Negative</Option> 
                            <Option  value="null">Statements</Option>
                        </Select>
                    </Form.Item>
                </div>
            )
        }

        if(this.state.filter==null){
           // this.setState({ state: this.state });

            var filterTypeNextId=(
                <Col span={8} xs={24} sm={24} md={24} lg={24}>
                    <Form.Item label="Next Dialog ID">
                        <Input
                        style={{width:"200px"}} name="NextDialogID"  
                        defaultValue={this.state.dialogueObject.NextDialogID} 
                        onChange={(event)=>this.state.handleNextDialogIDChange(event, "regular",this.state.index)}></Input>
                    </Form.Item>
                </Col>
            )
        }
        else if (this.state.filter=="NumberEntityFilter" && this.state.requireResponse){

            //this.setState({ state: this.state });

            var filterTypeNextId =(
                <div>
                    <Col>
                    <Form.Item label="Number threshold for comparison">
                        <Input disabled={this.state.dialogueObject.DialogID=="000"}
                            style={{'width':"200px"}} name = "numberEntityPivot"
                            value={this.state.dialogueObject.numberEntityPivot}
                            onChange={(event)=> this.state.handleChangePivot(event, this.state.index)}>
                        </Input>
                    </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} md={24} lg={24}>
                        <Form.Item label="Next ID if number < threshold">
                            <Input disabled={this.state.dialogueObject.DialogID=="000"} 
                            style={{width:"200px"}} name="LESS_THAN"  
                            value={this.state.dialogueObject.childMap!=null? this.state.dialogueObject.childMap.LESS_THAN: ""}                             
                            onChange={(event)=>this. this.props.handleNextDialogIDChange(event, "left",this.state.index)} ></Input>
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} md={24} lg={24}>
                        <Form.Item label="Next ID if number >= threshold">
                            <Input disabled={this.state.dialogueObject.DialogID=="000"} 
                            style={{width:"200px"}} name="GREATER_THAN"  
                            value={this.state.dialogueObject.childMap!=null? this.state.dialogueObject.childMap.GREATER_THAN: ""}                             
                            onChange={(event)=>this.props.handleNextDialogIDChange(event, "right",this.state.index)} >

                            </Input>
                        </Form.Item>
                    </Col>
                </div>

            )
        }
        else if (this.state.filter=="SentimentFilter" && this.state.requireResponse){
            //this.setState({ state: this.state });

            var filterTypeNextId =(
                <div>

                    <Col span={8} xs={24} sm={24} md={24} lg={24}>
                        <Form.Item label="Next ID if negative response (e.g., no)">
                            <Input disabled={this.state.dialogueObject.DialogID=="000"} 
                            style={{width:"200px"}} name="LESS_THAN"  
                            defaultValue={this.state.dialogueObject.childMap!=null? this.state.dialogueObject.childMap.LESS_THAN:this.state.dialogueObject.DialogID}                             
                            onChange={(event)=>this.props.handleNextDialogIDChange(event, "left",this.state.index)} ></Input>
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} md={24} lg={24}>
                        <Form.Item label="Next ID if positive response (e.g., yes)">
                            <Input disabled={this.state.dialogueObject.DialogID=="000"} 
                            style={{width:"200px"}} name="GREATER_THAN"  
                            defaultValue={this.state.dialogueObject.childMap!=null? this.state.dialogueObject.childMap.GREATER_THAN: ""}                             
                            onChange={(event)=>this.props.handleNextDialogIDChange(event, "right",this.state.index)} ></Input>

                        </Form.Item>
                    </Col>
                </div>
            )
        }
        const options = [
            { label: 'Previous Work Experience', value: 'PreviousWorkExperience' },
            { label: 'Technical', value: 'Technical' },
            { label: 'Education', value: 'Education' },
            { label: 'Personal', value: 'Personal' },

          ];

        const whiteboardOptions=[
            { label: 'Technical', value: 'technical' },
            { label: 'Education', value: 'education' }
        ];
        const questionSection=[
            {label: 'Question', value: 'Question'}
        ]

        const menu = (
            <Menu>
              
              <Menu.Item icon={<DownOutlined />} disabled>
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                  2nd menu item
                </a>
              </Menu.Item>
             
            </Menu>
          );

        var interruptionScriptDropDown = null;
        /*(<Row>  <Select
            style={{ width: '100%' }}
            placeholder="Choose Questions Script"
            defaultValue={this.state.dialogueObject.script}
            onChange={(value)=>this.props.interruptionChooseScriptChange(value)}>
            {
                this.props.interruption_ids.map((ans, pos)=>
                { 
                    ///console.log("dynamic params: ",ans)

                return(
                    <Option id={pos} /*draggable onDragStart={(event)=>this.startDrag(event,ans)}*/ //key={pos} value={ans.title}>{ans.title}</Option>)})
           /* }
            
       </Select>
            </Row>)*/

       


        /*<select disabled={this.props.dialogueObject.section=="Greeting"} 
                                    defaultValue={this.props.dialogueObject.section} 
                                    style={{ width: "300px" }} 
                                    //@todo: Make sure the Previous Work Experinece and Personal actually work. 
                                    //Not sure why it isn't working
                                    onChange={(event)=>this.props.handleSectionChange(event.target.value, this.state.index)}>
                                <option value="PreviousWorkExperience">Previous Work Experience</option>
                                <option value="Technical">Technical</option> 
                                <option value="Education">Education</option>
                                <option value="personal">Personal</option>

                            </select>*/
        return (

        <Card
            style={{ paddingLeft:"10px", paddingRight:"10px",}}
            >
            <Form >
                <Row gutter={[1,1]}>
                   
                    <Col span={8}>
                        <Form.Item label="Dialog ID">
                            <Input disabled={this.state.dialogueObject.section=="Greeting"} 
                                    style={{width:"200px"}} name="DialogID"  
                                    value={this.state.dialogueObject.DialogID} 
                                    onChange={(event)=>this.state.handleDialogIDChange(event, this.state.id, this.state.index)}></Input>
                        </Form.Item>
                    </Col>





                    <Col span={16}>
                        {/*}
                        <Form.Item label="Section">
                        <Select style={{ width: 200 }} 
                                onChange={(event)=>this.handleSecChange(event)} 
                                //value={this.state.dialogueObject.section}
                                >
                            <Option value="greetings">Greetings</Option>
                            <Option value="previousworkexperience">Previous Work Experience</Option>
                            <Option value="technical">Technical</Option>
                            <Option value="education">Education</Option>
                            <Option value="personal">Personal</Option>
                            <Option value="question">Question</Option> 
                        </Select>
        </Form.Item>*/}
                        

    <TextField
          id="outlined-select-currency"
          select
          label="Section"
          //value={section}
          //onChange={handleSecChange}
          
          onChange={(event)=>this.handleSecChange(event)}
          helperText="Please select the interview section"
          >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
    </TextField>
          

                        {this.state.dialogueObject.DialogID=="question001"?
                        (
                            
                        <Form.Item label="Section">
                        <Radio.Group
                            options={questionSection}
                            onChange={(event)=>this.handleSecChange(event)}
                            value={this.state.dialogueObject.section}
                            optionType="button"
                            defaultValue={questionSection.label}
                            />
                        </Form.Item>
                        ) //if 
                        
                        : //else 
                        this.state.dialogueObject.whiteboardType==null?
                        <Form.Item label="Section">
                        <Radio.Group
                            options={options}
                            onChange={(event)=>this.handleSecChange(event)}
                            value={this.state.dialogueObject.section}
                            optionType="button"
                            />
                        </Form.Item>
                        :
                    
                        <Form.Item label="Type">
                        <Radio.Group
                            options={whiteboardOptions}
                            onChange={(event)=>this.props.handleWbTypeChange(event, this.state.index)}
                            value={this.state.dialogueObject.whiteboardType}
                            optionType="button"
                            />
                        </Form.Item>
                        }               
                    </Col>
                  
                </Row>
               

                {this.state.dialogueObject.whiteboardType==null?
                (<div><Form.Item label="Dialogue Text" rules={[{required:true,
                                                                message: "Please enter an interview question."}]}>
                    <Input.TextArea id="text" /*onDragOver={this.dragOver} onDrop={this.drop} */
                                    disabled={this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001"?true: false} 
                                    name="DialogText"  value={this.state.dialogueObject.DialogText!==""?this.state.dialogueObject.DialogText:""} 
                                    allowClear
                                    onChange={(event)=>this.state.handleDialogueChange(event, this.state.id, this.state.index)}></Input.TextArea>
                </Form.Item>

                
                {this.state.dialogueObject.DialogID=="question001"?interruptionScriptDropDown:null}
                {this.state.dialogueObject.dynamicParams==null? null: (<div>
                <Form.Item label="Dynamic Entities" rules={{required:true}}>
                    <Row>
                        <Col span={22}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                defaultValue={this.state.dialogueObject.dynamicParams!=null? this.state.dialogueObject.dynamicParams: null}
                                value={this.state.dialogueObject.dynamicParams!=null? this.state.dialogueObject.dynamicParams: null}
                                onChange={(value)=>this.state.handleDynamicParamsChange(value,this.state.index)}
                                disabled={this.state.dialogueObject.DialogID=="000"}
                            >
                                {
                                    this.state.paramsList.map((ans, pos)=>
                                    { 
                                        ///console.log("dynamic params: ",ans)

                                    return(
                                        <Option id={pos} /*draggable onDragStart={(event)=>this.startDrag(event,ans)}*/ key={pos} value={this.state.paramsList[pos]}>{ans}</Option>)})
                                    }
                                
                            </Select>
                        </Col>

                        <Col span={2}>
                            <Popover  title={"Dynamic Parameters"} placement="top" content={dynamicPopOver}>
                                <QuestionCircleOutlined style={{align:"middle", paddingLeft:"5px" }}></QuestionCircleOutlined>
                            </Popover>
                        </Col>
                    </Row>
                </Form.Item>
                {this.state.dialogueObject.alternates==null? null 
                :
                <Form.Item label="Alternates">
                    {this.state.dialogueObject.alternates.map((alt, index)=> {return (
                        <Row style={{paddingBottom: "5px"}}>
                            <Col span={22}>
                                <Input.TextArea  disabled={this.state.dialogueObject.DialogID=="000"} 
                                    name={"alternates"+ index} value={this.state.dialogueObject.alternates[index]} 
                                    onChange={(event)=>this.state.handleAlternatesChange(event, this.state.id,this.state.index, index)}>

                                </Input.TextArea>
                            </Col>
                            {this.state.dialogueObject.DialogID!=="000"?
                                <Col span={2}>
                                        <MinusCircleTwoTone disabled={this.state.dialogueObject.DialogID=="000"}  style={{align:"middle", paddingLeft:"5px" }} onClick={()=>this.state.deleteAlternate(this.state.id, this.state.index, index)}/>    
                                </Col>
                                :
                                <Col span={2}>
                                        <MinusCircleTwoTone disabled={this.state.dialogueObject.DialogID=="000"}  style={{align:"middle", paddingLeft:"5px" }} />    
                                </Col>
                            }
                        </Row>
                    )})}
                    <Button style={{float: "right", paddingRight:"10px"}} disabled={this.state.dialogueObject.DialogID=="000"} type="dashed" icon={<PlusOutlined/>} onClick={()=>this.state.addAlternates(this.state.id,this.state.index)}> Add alternate</Button>
                </Form.Item>}
                <Row>
                    {filterTypeNextId}
                        
                    
                    <Col span={8} xs={24} sm={24} md={12} lg={12}>
                        <Form.Item label="Require Response?">
                            <Checkbox  disabled={this.state.dialogueObject.DialogID=="000"} name="requireResponse"  
                            checked={this.state.requireResponse} 
                            onChange={(event)=>this.handleCheckboxResponse(event)}></Checkbox>
                        </Form.Item>
                    </Col>
        
                    <Col span={8} xs={24} sm={24} md={12} lg={12}>
                        {timeLimit}
                    </Col>
                   

                    <Col span={24} xs={24} sm={24} md={24} lg={24}>
                        <Form.Item label="Entities (required)">
                            <Row>
                                <Col span={22}>
                                    <EditableTagGroup 
                                    requiredParams={this.state.dialogueObject.requiredParams!=null? this.state.dialogueObject.requiredParams: []}
                                    dialogIndex = {this.state.index}
                                    id={this.state.id}
                                    handleRequiredParamsChange = {this.state.handleRequiredParamsChange}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Popover title={"Entities"} placement="top" content={requiredParamsPopover}>
                                        <QuestionCircleOutlined style={{align:"middle", paddingLeft:"5px" }}></QuestionCircleOutlined>
                                    </Popover>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Col>

                    <Col span={8} xs={24} sm={24} md={12} lg={12}>
                        <Form.Item label="Add interruption. Who to interrupt?">
                            <Radio.Group  disabled={this.state.dialogueObject.DialogID=="000"} 
                            name="interruption"  
                            value={this.state.dialogueObject.Interruptee} 
                            onChange={(event)=>this.props.handleInterruptionTypeChange(event, this.state.index)}>
                                <Radio value="interviewer">Interviewer</Radio>
                                <Radio value="interviewee">Interviewee</Radio>
                                <Radio value="null">None</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    
                    <Col span={24} xs={24} sm={24} md={24} lg={24}>
                        {technical}
                    </Col>
                    </Row></div>)}</div>)
                :
                <div>
                 <Row>
                    <Form.Item label="Next Dialog ID">
                            <Input
                            style={{width:"200px"}} name="NextDialogID"  
                            defaultValue={this.state.dialogueObject.NextDialogID} 
                            onChange={(event)=>this.state.handleNextDialogIDChange(event, "regular",this.state.index)}></Input>
                    </Form.Item>
                 </Row>
                 
                
                    
                   
                </div>}
                

                </Form>
            </Card>
                    
        );

    }

}
//                                                    <Input disabled={this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001"?true: false} name="requiredParams" defaultValue={this.state.dialogueObject.requiredParams} placeholder="e.g. personName, hoursPerWeek, ..." onChange={(event)=> this.state.handleRequiredParamsChange(event, this.state.id, this.state.index)}></Input> 
/*
<Col span={22}>
                                            <Input disabled={this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001"?true: false}
                                            name="dynamicParams" value={this.state.dialogueObject.dynamicParams} placeholder="e.g. personName, hoursPerWeek, ..." onChange={(event)=> this.state.handleDynamicParamsChange(event, this.state.id, this.state.index)}></Input> 
                                        </Col>
*/

/*<Col span={8} xs={24} sm={24} md={24} lg={24}>
<Form.Item label="Enable User Interruption?">
    <Checkbox disabled={(this.state.dialogueObject.DialogID=="000"|| this.state.dialogueObject.DialogID=="001")?true: false} name="userInterruptionEnabled"  value={this.state.dialogueObject.userInterruptionEnabled} onChange={(event)=>this.state.handleUserInterruptionChange(event, this.state.id,this.state.index)}></Checkbox>
</Form.Item>
</Col>

 <Col span={24} xs={24} sm={24} md={24} lg={24}>
                        {errorResponse}
                    </Col>
*/
