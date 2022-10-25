import { TextField } from '@mui/material';


function Alternate() {
  
  return (
    
      <main>
        <br></br>
        <TextField
          id="filled-multiline-static"
          label="Alternate Dialog"
          multiline
          rows={1}
          fullWidth
          placeholder="What do you think was challenging about the job?"
        />
      </main>
    
  );
}
export default Alternate;