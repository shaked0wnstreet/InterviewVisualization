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
    props.setAlternateValues([...props.alternateValues, ""])
  }

  let removeAlternateFields = (i) => {
      let newAlternateValues = [...props.alternateValues];
      newAlternateValues.splice(i, 1);
      props.setAlternateValues(newAlternateValues)
  }
  return (
    <div className='popup' style={{"padding": "30px"}}>
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
          rows={2}
          onChange={(e) =>props.onDialogTextChange(e)}
          fullWidth
          placeholder="What challenges did you face?"
        />
      

        
        {(props.alternateValues).map((element,index) => (
              <Stack direction='row' >
                <TextField
                  id="filled-multiline-static"
                  label="Alternate Dialog"
                  name="alternate"
                  defaultValue={element === null ? '' : element} 
                  onChange={(e) => handleAlternateChange(index, e)}
                  multiline
                  rows={2}
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
        <TextField //this one should have multiple children
          id="outlined-required"
          label="Next Dialog ID"
          onChange={(e) =>props.onNextDialogIDChange(e)}
          value={props.nextID}
          required = {props.responseType === 'Statements'}
          disabled = {!props.requiredResponse || props.responseType === 'Positive/Negative'}
          placeholder="Enter next ID or connect this node to a new node"
        />

      </Stack>

     
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