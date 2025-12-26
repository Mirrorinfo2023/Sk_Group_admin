import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import FormControl from '@mui/material/FormControl';

 
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



const AddGraphicsCAtegoryTransactions = () => {

    
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 10,
  });
  

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };
  
    
       
      const handleSubmit = async () => {
        
          const formData ={
            'image': selectedFile,
            'category_name':title,
            'description':description,
           
          }

        try {
            const response = await api.post('/api/graphics/add-category', formData,{
                    headers:{'content-type': 'multipart/form-data'}
            });
            
            if (response.data.status==201) {
                window.history.back();
                alert('Graphics category Added successfully');
            } else {
                console.error('Failed to upload graphics Category');
            }

        } catch (error) {
          console.error('Error uploading file:', error);
        }
        
      };

      const handleCancel = async () => {
        window.history.back();
      };
      

     
    
  
    return (

        <main className="p-6 space-y-6">
          
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
                <TableContainer component={Paper} >

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top'}} >
                        <Typography variant="h5"  sx={{ padding: 2 }}>Add New Graphics Category</Typography>
                    </Box>


                    <Grid spacing={2}   sx={{ padding: 2 }} container>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Category Name" variant="outlined" display={'inline-block'}
                            value={title} onChange={(e) => setTitle(e.target.value)}  />
                        </Box>

                   
                        <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >
                            
                            <TextareaAutosize  fullWidth
                                    label="Description" 
                                    minRows={3}
                                    size="normal"
                                    variant="outlined"
                                    placeholder="Enter Description" 
                                    style={{height: '90px', width:'968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                            /> 

                            
                        </Box>

                        <Box justifyContent="space-between" alignItems="center" mt={1} ml={2} mb={1} sx={{ width: '50%', verticalAlign: 'top' }}>
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)} />
                                </Button>
                                {selectedFile && (
                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    {selectedFile.name}
                                </Typography>
                                )}
                        </Box>
              
                    </Grid>

                    <Grid item>
                        <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                        <Button variant="contained" color="success" style={{ marginRight: '8px' }} size="medium" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="outlined"  onClick={handleCancel} >Cancel</Button>
                        </Box>
                    
                                
                    </Grid>
                    
                </TableContainer>
            </Grid>
            
            </Grid>
              
        </main>
    )
}
export default AddGraphicsCAtegoryTransactions;