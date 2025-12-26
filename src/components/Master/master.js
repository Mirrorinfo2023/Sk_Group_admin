import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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



const AddBannersTransactions = () => {

    
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
    const [transactionType, setTransactionType] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

  
    useEffect(() => {
      const getCategories = async () => {
        try {
          const response = await api.get("/api/banner/66a815be731fee133d7ecc8f240447c14e770b83");
          console.log(response);
          if (response.status === 200) {
            setCategories(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      getCategories();
    }, []);
  
    const handleChange = (event) => {
      setTransactionType(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };
  
    
       
      const handleSubmit = async () => {
        // alert(status);
       
          // const formData = new FormData();
          // formData.append('img', selectedFile);
          // formData.append('title', title);
          // formData.append('categoryId',transactionType);
        
          const formData ={
            'img': selectedFile,
            'title':title,
            'categoryId':transactionType
          }

        try {
          const response = await api.post('/api/banner/848c9e6b17fd0bab24254d057a09a88e8db32bcc', formData,{

            headers:{'content-type': 'multipart/form-data'}
          
          
          });
        
          if (response) {
            window.history.back();

            alert('File uploaded successfully');
          } else {
            console.error('Failed to upload file');
          }

        } catch (error) {
          console.error('Error uploading file:', error);
        }
        
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>Add New Banner</Typography>
                    </Box>


                    <Grid spacing={2}   sx={{ padding: 2 }} container>

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Title" variant="outlined" display={'inline-block'}
                        value={title} onChange={(e) => setTitle(e.target.value)}  />
                    </Box>

                    
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Banner Category</InputLabel>
                                    <Select
                                    labelId="transaction-type-label"
                                    id="transaction-type"
                                    value={transactionType}
                                    label="Transaction Type"
                                    onChange={handleChange}
                                >
                                <MenuItem value="">Please Select</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.category_name}
                                    </MenuItem>
                                    ))}
                             
                            </Select>
                        </FormControl>

                    </Box>

                   
                        
                
                    <Box display="inline-block" justifyContent="space-between" alignItems="center" mt={1} ml={2} mb={1} sx={{ width: '30%', verticalAlign: 'top' }}>
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
                        <Box display="flex" justifyContent="flex-end" mr={2}  mt={1} ml={2} mb={1} >
                        <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                            Submit
                        </Button>
                        </Box>
                  
                            
                        </Grid>
                    
                </TableContainer>
            </Grid>
            
            </Grid>
              
        </main>
    )
}
export default AddBannersTransactions;