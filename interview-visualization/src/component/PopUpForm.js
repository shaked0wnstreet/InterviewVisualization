import './PopUp.css';
import { MenuItem, Stack, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';


function PopUpForm(props) {

// Options for sections
  const sections = [
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
      value: 'Education',
    },
    {
      value: 'Technical',
    },
    {
      value: 'Past Experience',
    },
  ];

  const [responseType, setResponseType] = useState('');

  const onResponseTypeChange = (event) => {
    setResponseType(event.target.value);
  };
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
        <TextField
        id="filled-multiline-static"
        label="Alternate Dialog"
        multiline
        rows={1}
        fullWidth
        placeholder="What do you think was challenging about the job?"
        />
        <Button variant="outlined" startIcon={<AddIcon/>}>
          Add Alternate
        </Button>
        <TextField
            id="outlined-required"
            label="Next Dialog ID"
            placeholder="001"
          />

        <Stack direction='row'spacing={10}>
          <FormControlLabel labelPlacement='start' control={<Checkbox defaultChecked />} label="Require Respond?" />
          <TextField
          id="outlined-number"
          label="Time Limit (seconds)"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          />
        </Stack>
        <TextField
          id="filled-multiline-static"
          label="Entities (required)"
          require
          rows={1}
          fullWidth
          placeholder="# New Tag"
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Chose expected response type"
          value={responseType}
          onChange={onResponseTypeChange}
          >
          {responseTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>

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
