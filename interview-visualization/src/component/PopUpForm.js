import './PopUp.css';
import { MenuItem, Stack, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import Box from '@mui/material/Box';
//import Alternate  from './Alternate';


function PopUpForm(props) { 
// Options for sections
  const sections = [
    {
      value: 'Greetings',
    },
    {
      value: 'Previous Work Experience',
    },
    {
      value: 'Technical',
    },
    {
      value: 'Education',
    },
    {
      value: 'Personal',
    },
    {
      value: 'Question',
    },
  ];

  const interuptees = [
    {
      value: 'Interviewee',
    },
    {
      value: 'Interviewer',
    },
  ];

  // Options for dynamic entities
  const entitiesOption = [
    {
      value: 'interviewerName',
    },
    {
      value: 'greetingTime',
    },
    {
      value: 'personName',
    },
  ];

  // Options for response types
  const responseTypes = [
    {
      value: 'Positive/Negative',
    },
    {
      value: 'Statements', 
    },
  ];

  function onSaveBtnClicked() {
    props.setIsModalOpen(!props.isModalOpen);
    props.onSubmit();

  }

  let handleAlternateChange = (i, e) => {
    let newAlternateValues = props.alternateValues;
    newAlternateValues[i] = e.target.value;
    props.setAlternateValues(newAlternateValues);
  }

  let addAlternateFields = () => {
    props.setAlternateValues([...props.alternateValues, { alternate: "" }])
  }

  let removeAlternateFields = (i) => {
      let newAlternateValues = [...props.alternateValues];
      newAlternateValues.splice(i, 1);
      props.setAlternateValues(newAlternateValues)
  }
  return (
    <div className='popup'>
      <Stack spacing={2} className='popup-inner'>
        
        <Stack direction='row'spacing={5}>
          <TextField
            id="outlined-required"
            label="Dialog ID"
            value={props.dialogID}
            disable={false}
            onChange={(e) => props.onDialogIDChange(e)}
            placeholder="001"
          />

          <TextField
          id="outlined-select-currency"
          select
          label="Section"
          value={props.section}
          onChange={(e) => props.onSectionChange(e)}
          helperText="Please select the interview section"
          >
          {sections.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
          </TextField>
          
        </Stack>
        <TextField
          id="filled-multiline-static"
          label="Dialog Text"
          value ={props.dialogText}
          multiline
          rows={1}
          onChange={(e) =>props.onDialogTextChange(e)}
          fullWidth
          placeholder="What challenges did you face?"
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Dynamic Entities"
          value={props.dynamicParams}
          onChange={(e) =>props.onDynamicEntityChange(e)}
          helperText="Please select the dynamic entities"
          >
          {entitiesOption.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField> 

        
        {(props.alternateValues).map((element,index) => (
              <Stack direction='row' >
                <TextField
                  id="filled-multiline-static"
                  label="Alternate Dialog"
                  name="alternate"
                  defaultValue={element === null ? '' : element} 
                  onChange={(e) => handleAlternateChange(index, e)}
                  multiline
                  rows={1}
                  fullWidth
                  placeholder="What do you think was challenging about the job?"
                />
                <button type="button" onClick={() => removeAlternateFields(index)}>-</button>
              </Stack>
        ))}

      <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button variant="outlined" onClick={() => addAlternateFields()} startIcon={<AddIcon/>}>Add Alternate</Button>
      </Box>  

      <Stack direction='row'spacing={10}>
        <Stack direction='row'spacing={10}>
          <FormControlLabel labelPlacement='start' control={<Checkbox checked={props.requiredResponse} onChange={props.onRequiredResponseChange} />} label="Require Response?"/>
          <TextField
          id="outlined-number"
          label="Time Limit (seconds)"
          type="number"
          onChange={(e) =>props.onTimeLimitChange(e)}
          value={props.timeLimit}
          disabled = {!props.requiredResponse}         //Disables Time Limit option if unchecked
          InputLabelProps={{
          shrink: true, 
          }}
          />                      
        </Stack> 

        <Stack direction='row'spacing={10}>
          <FormControlLabel labelPlacement='start' control={<Checkbox checked={props.userInterruptionEnabled} onChange={props.onInterruptionChange} />} label="Allow Interruption?"/>
          <TextField
            id="outlined-select-currency"
            select
            label="Interruption Type"                       //userInterruptionEnabled and Interuptee
            value={props.Interruptee}
            disabled = {!props.requiredResponse & !props.userInterruptionEnabled}
            onChange={(e) =>props.onInterruptionTypeChange(e)}
            helperText="Please select who to interrupt"
            InputLabelProps={{
              shrink: true, 
              }}
          >
          {interuptees.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
          </TextField>                     
        </Stack>
      </Stack>

        <TextField
          id="outlined-select-currency"
          select          
          label="Choose expected response type"
          value={props.responseType}
          disabled = {!props.requiredResponse}
          onChange={(e) =>props.onResponseTypeChange(e)}
          >
          {responseTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>

      <Stack direction='row'spacing={10}>
        <TextField
          id="outlined-required"
          label="Next Dialog ID"
          onChange={(e) =>props.onNextDialogIDChange(e)}
          value={props.nextID}
          required = {props.responseType === 'Statements'}
          disabled = {!props.requiredResponse || props.responseType === 'Positive/Negative'}
          placeholder="001"
        />
      
        <TextField
          id="outlined-required"
          label="Next Positive ID"
          onChange={(e) =>props.onNextPositiveIDChange(e)}
          value={props.nextPositiveID}
          placeholder="PastWork002"
          required = {props.responseType === 'Positive/Negative'}
          disabled = {!props.requiredResponse || props.responseType === 'Statements'}
          helperText="Next ID if positive response (e.g. yes)"
        />

        <TextField
          id="outlined-required"
          label="Next Negative ID"
          onChange={(e) =>props.onNextNegativeIDChange(e)}
          value={props.nextNegativeID}
          placeholder="002"
          required = {props.responseType === 'Positive/Negative'}
          disabled = {!props.requiredResponse || props.responseType === 'Statements'}
          helperText="Next ID if negative response (e.g. no)"
         />
      </Stack>

        <TextField 
          id="filled-multiline-static" 
          onChange={props.onEntitiesChange}
          value={props.entities}
          label="Entities (required)"   //make this to where they can click a button to add more
          required                      //save into an array of dynamic params that can be selected up top
          rows={1}
          fullWidth
          placeholder="+ New Tag"
        />

        <Button variant="outlined" startIcon={<AddIcon/>}>Add Entities</Button> 

        <br></br>
        <Stack direction='row'spacing={2}>
          <Button variant="contained" className='save-btn' onClick={onSaveBtnClicked} >Save</Button>
          <Button variant="contained" className='cancel-btn' color='error' onClick={() => props.setIsModalOpen(!props.isModalOpen)} >Cancel</Button>       
        </Stack>
        
      </Stack>
    </div>
  )
}

export default PopUpForm;