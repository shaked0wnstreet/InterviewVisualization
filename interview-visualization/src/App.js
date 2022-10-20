import logo from './logo.svg';
import './App.css';
import PopUpForm  from './component/PopUpForm';
import Button from '@mui/material/Button';
import { useState } from 'react';


function App() {
  const [onPopUp, setOnPopUp] = useState(false); 
  return (
    <div className="App">
      <main>
        <h1>React popups</h1>
        <br></br>
        <Button variant="contained" onClick={() => setOnPopUp(true)}>Open PopUp</Button>
        {onPopUp ? <PopUpForm setTrigger={setOnPopUp}/> : ''}
      </main>
    </div>
  );
}
export default App;