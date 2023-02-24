import './App.css';
import React, { useEffect, useState } from 'react';
//import AuthoringTool from "./AuthoringTool"
import { DataGrid } from '@mui/x-data-grid';
import logo from './cirvr.png'; // Tell webpack this JS file uses this image
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, IconButton} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import data from "./DataStorage/graph.json"

//import StoredScripts from "DataStorage"
//import fs from 'fs'
import * as fs from 'fs';




//import fs from 'browserify-fs'



const  AuthoringHome= ()=> {

    console.log(data)

  const [mainCheckBox, setMainCheckBox] = useState(false)
  const [files, setFiles] = useState([])

  /*const saveFile = async (blob, title, directory) => {
    const a = document.createElement('a');
    a.saveFile = title+'.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };*/
  

   /* fs.readdir("./DataStorage/", (err, files) => {
        files.forEach(file => {
        console.log(file);
        });
    });*/
  
  
  
  function addNewScript(){

    let init_script={
        title: "default-title", 
        date_created: new Date(),
        date_modified: '',
        graph:{links: [], nodes:[]}
    }

    console.log(__dirname+"DataStorage")
    
   /* fs.readdir("/DataStorage/", (err, files) => {
        files.forEach(file => {
        console.log(file);
        });
    });*/

    
    fs.writeFile('/test.json', init_script, err => {
        if (err) {
        console.error(err);
        }
        // file written successfully
    });
    //const blob = new Blob([JSON.stringify(init_script, null, 2)], {type : 'application/json'});
    
    //saveFile(blob, init_script.title, "DataStorage");

  }

 /* useEffect(()=>{

  }, [files]);*/
  //We are going to create an interview list here and then navigate to <Authoring tool page?
  //We will pass the original 
  return (
    <div style={{ height: 400, width: '100%' }} >
        <img src={logo} alt="CIRVR logo" style={{width:"20%"}}></img>
        <h1 style={{fontFamily: "Arial, Helvetica, sans-serif"}}> Interview Authoring Tool</h1>
        <TableContainer component={Paper}>
            <Button 
                size="small"
                fontSize="small"
                startIcon={<AddIcon/>}
                onClick={addNewScript}> 
                ADD NEW SCRIPT
            </Button>
            

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align='left'>Interview Script</TableCell>
                    <TableCell align="center">Date Created</TableCell>
                    <TableCell align="right">Date Modified</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>

                    <TableCell align='left'>Interview Script</TableCell>
                    <TableCell align="center">Data Created</TableCell>
                    <TableCell align="right">Date Modified</TableCell>
                    <TableCell align="right">Edit</TableCell>
                    <TableCell align="right">Download</TableCell>
                    <TableCell align="right">Delete</TableCell>

                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  );
}
export default AuthoringHome;