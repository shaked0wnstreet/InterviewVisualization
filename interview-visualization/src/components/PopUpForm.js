import './PopUp.css';
import { MenuItem, Stack, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
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

  const [section, setSection] = useState('');

  const onSectionChange = (event) => {
    setSection(event.target.value);
  };
// Options for dynamic entities
  const entities = [
    {
      value: 'Education',
    },
    {
      value: 'Technical',
    },
    {
      value: 'Past Experience',
    },
  ];

  const [entity, setEntity] = useState('');

  const onEntityChange = (event) => {
    setEntity(event.target.value);
  };
  // Options for response types
  const responseTypes = [
    {
      value: 'Positive/Negative',
    },
    {
      value: 'Statements', 
    },
  ];

  const [responseType, setResponseType] = useState('');

  const onResponseTypeChange = (event) => {
    setResponseType(event.target.value);
  };

  //For Required Response checkbox
  const [requiredResponse, setRequiredResponse] = useState('');

  const onRequiredResponseChange = (event) => {
      setRequiredResponse(event.target.checked);
  };

  //For Interruption checkbox
  const [interruption, setInterruption] = useState('');

  const onInterruptionChange = (event) => {
      setInterruption(event.target.checked);
  };

  const interuptees = [
    {
      value: 'Interviewee',
    },
    {
      value: 'Interviewer',
    },
  ];

  const [interruptionType, setInterruptionType] = useState('');

  const onInterruptionTypeChange = (event) => {
    setInterruptionType(event.target.value);
  };

  //For adding an alternate dialog text box
  const [alternateValues, setAlternateValues] = useState([{ alternate : ""}])

    let handleAlternateChange = (i, e) => {
        let newAlternateValues = [...alternateValues];
        newAlternateValues[i][e.target.name] = e.target.value;
        setAlternateValues(newAlternateValues);
      }
    
    let addAlternateFields = () => {
        setAlternateValues([...alternateValues, { alternate: "" }])
      }
    
    let removeAlternateFields = (i) => {
        let newAlternateValues = [...alternateValues];
        newAlternateValues.splice(i, 1);
        setAlternateValues(newAlternateValues)
    }

  return (
    <div className='popup'>
      <Stack spacing={2} className='popup-inner'>
        
        <Stack direction='row'spacing={5}>
          <TextField
            id="outlined-required"
            label="Dialog ID"
            placeholder="001"
          />

          <TextField
          id="outlined-select-currency"
          select
          label="Section"
          value={section}
          onChange={onSectionChange}
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
          multiline
          rows={1}
          fullWidth
          placeholder="What challenges did you face?"
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Dynamic Entities"
          value={entity}
          onChange={onEntityChange}
          helperText="Please select the dynamic entities"
          >
          {entities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField> 

        
        {alternateValues.map((element, index) => (
            <div key={index}>

              <Stack direction='row'spacing={1}>
                <TextField
                  id="filled-multiline-static"
                  label="Alternate Dialog"
                  name="alternate"
                  value={element.alternate || ""} onChange={e => handleAlternateChange(index, e)}
                  multiline
                  rows={1}
                  fullWidth
                  placeholder="What do you think was challenging about the job?"
                />
                {
                  index ? 
                    <button type="button" onClick={() => removeAlternateFields(index)}>-</button> 
                    : null
                }
              </Stack>
            </div>
        ))}

      <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button variant="outlined" onClick={() => addAlternateFields()} startIcon={<AddIcon/>}>Add Alternate</Button>
      </Box>  

      <Stack direction='row'spacing={10}>
        <Stack direction='row'spacing={10}>
          <FormControlLabel labelPlacement='start' control={<Checkbox checked={requiredResponse} onChange={onRequiredResponseChange} />} label="Require Response?"/>
          <TextField
          id="outlined-number"
          label="Time Limit (seconds)"
          type="number"
          disabled = {!requiredResponse}         //Disables Time Limit option if unchecked
          InputLabelProps={{
          shrink: true, 
          }}
          />                      
        </Stack> 

        <Stack direction='row'spacing={10}>
          <FormControlLabel labelPlacement='start' control={<Checkbox checked={interruption} onChange={onInterruptionChange} />} label="Allow Interruption?"/>
          <TextField
            id="outlined-select-currency"
            select
            label="Interruption Type"                       //userInterruptionEnabled and Interuptee
            value={interruptionType}
            disabled = {!interruption}
            onChange={onInterruptionTypeChange}
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
          value={responseType}
          disabled = {!requiredResponse}
          onChange={onResponseTypeChange}
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
          required = {responseType === 'Statements'}
          disabled = {responseType === 'Positive/Negative'}
          placeholder="001"
        />
      
        <TextField
          id="outlined-required"
          label="Next Positive ID"
          placeholder="PastWork002"
          required = {responseType === 'Positive/Negative'}
          disabled = {responseType !== 'Positive/Negative'}
          helperText="Next ID if positive response (e.g. yes)"
        />

        <TextField
          id="outlined-required"
          label="Next Negative ID"
          placeholder="002"
          required = {responseType === 'Positive/Negative'}
          disabled = {responseType !== 'Positive/Negative'}
          helperText="Next ID if negative response (e.g. no)"
         />
      </Stack>

        <TextField 
          id="filled-multiline-static" 
          label="Entities (required)"   //make this to where they can click a button to add more
          required                      //save into an array of dynamic params that can be selected up top
          rows={1}
          fullWidth
          placeholder="+ New Tag"
        />

        <Button variant="outlined" startIcon={<AddIcon/>}>Add Entities</Button> 

        <br></br>
        <Stack direction='row'spacing={2}>
          <Button variant="contained" className='save-btn' onClick={() => props.setTrigger(false)} >Save</Button>
          <Button variant="contained" className='cancel-btn' color='error' onClick={() => props.setTrigger(false)} >Cancel</Button>       
        </Stack>
        
      </Stack>
    </div>
  )
}

export default PopUpForm;