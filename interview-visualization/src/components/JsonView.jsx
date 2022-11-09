import React from 'react';
import { Paper} from '@material-ui/core';
import '../questionStyle.css';


const JsonView =(props)=>{
    
    return (
        //Add a drop down button to open or collapse the module
        //Add a feature to let the user insert questions, or move them around the list
        //
        <Paper className="paper-jsonview">  
            <div className='jsonview'>   
                <pre>{JSON.stringify(props.model, null, 2)}</pre>
            </div>
        </Paper>);
    
};

export default JsonView;
