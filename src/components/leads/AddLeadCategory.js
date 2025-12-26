import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';

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



const AddLeadCategoryTransactions = () => {

  
    
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
    const [range, setRange] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [leadCategory, setLeadCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };

    const handleChange = (event) => {
      setLeadCategory(event.target.value);
    };

    
    const handleCancel = async () => {
      window.history.back();
    };
  
   

      
  
    useEffect(() => {
      const all_parameters = {
        "category_name1": null
    }
    const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
      const reqData = {
        encReq: encryptedData
      };
      const getCategories = async () => {
        try {
          const response = await api.post("/api/leads/get-category", reqData);
             
                if (response.status === 200) {
                  const decryptedObject = DataDecrypt(response.data);
                  setCategories(decryptedObject.data);
                }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      getCategories();
    }, []);
    
       
      const handleSubmit = async () => {
       
        
          const formData ={
            'category_image': selectedFile,
            'category_name':title,
            'description':description,
            'category_id':leadCategory,
            'discount_upto':range,
            'formFields': formFields
          }

        try {

         console.log(formData);
          const response = await api.post('/api/leads/add-category', formData,{

            headers:{'content-type': 'multipart/form-data'}
          
          
          });
        
          if (response) {
            window.history.back();
            alert('Leads Saved  successfully');
          } else {
            console.error('Failed to save');
          }

        } catch (error) {
          console.error('Error uploading file:', error);
        }
        
      };

      const fieldTypes = [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'image', label: 'Image' },
      ];

      const [formFields, setFormFields] = useState([]);
      const [formData, setFormData] = useState({});
      const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
      const [editingIndex, setEditingIndex] = useState(null);

      const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleAddFieldChange = (e) => {
        const { name, value } = e.target;
        setNewField((prevField) => ({
          ...prevField,
          [name]: value,
        }));
      };

      const addField = () => {
        if (editingIndex !== null) {
          // Save edited field
          const updatedFields = [...formFields];
          updatedFields[editingIndex] = newField;
          setFormFields(updatedFields);
          setEditingIndex(null);
        } else {
          // Add new field
          setFormFields((prevFields) => [...prevFields, newField]);
        }
        setNewField({ name: '', label: '', type: 'text' });
      };
    
      const handleEditField = (index) => {
        setNewField(formFields[index]);
        setEditingIndex(index);
      };
    
      const handleDeleteField = (index) => {
        setFormFields((prevFields) => prevFields.filter((_, i) => i !== index));
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>Add New Leads Category</Typography>
                    </Box>


                    <Grid spacing={2}   sx={{ padding: 2 }} container>

                    <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} ml={1} mb={0} style={{width: '50%', verticalAlign: 'top'}} >

                      <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Category</InputLabel>
                              <Select
                                  labelId="transaction-type-label"
                                  id="transaction-type"
                                  variant="outlined"
                                  value={leadCategory}
                                  label="Lead Type"
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

                        <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                            fullWidth label="Title" 
                            variant="outlined" display={'inline-block'}
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}  />

                        </Box>

                        
                        <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                            fullWidth label="Discount Upto" 
                            variant="outlined" display={'inline-block'}
                            value={range} 
                            onChange={(e) => setRange(e.target.value)}  />

                        </Box>

                        <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >
                        
                        <TextareaAutosize  fullWidth
                                label="Message" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Enter Message" 
                                style={{height: '90px', width:'968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                        /> 

                        
                        </Box>

                        <Box display="inline-block" justifyContent="space-between" alignItems="right" mt={3} ml={2} mb={2} sx={{ width: '70%',      verticalAlign: 'top' }}>
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

                        <Box justifyContent={'space-between'} alignItems={'left'} mt={3} ml={1} mb={0} style={{width: '100%', verticalAlign: 'top'}}>
                          <Typography variant="h5" component="h3" gutterBottom>
                            Add New Form
                          </Typography>
                            <TableContainer component={Paper} style={{width: '100%'}}>
                                <TableBody>
                                  <TableRow>
                                    <TableCell width={'30%'} >
                                      <TextField
                                        label="Field Name"
                                        variant="outlined"
                                        name="name"
                                        value={newField.name}
                                        onChange={handleAddFieldChange}
                                        fullWidth
                                      />
                                    </TableCell>
                                    <TableCell width={'30%'}>
                                      <TextField
                                        label="Field Label"
                                        variant="outlined"
                                        name="label"
                                        value={newField.label}
                                        onChange={handleAddFieldChange}
                                        fullWidth
                                      />
                                    </TableCell>
                                    <TableCell width={'30%'}>
                                      <TextField
                                        select
                                        label="Field Type"
                                        variant="outlined"
                                        name="type"
                                        value={newField.type}
                                        onChange={handleAddFieldChange}
                                        fullWidth
                                      >
                                        {fieldTypes.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </TableCell>
                                    <TableCell><Button variant="contained" color="primary" onClick={addField}>
                                    {editingIndex !== null ? 'Save Field' : 'Add Field'}
                                              </Button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </TableContainer>
                          </Box>

                            <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Sl No.</TableCell>
                                    <TableCell>Field Name</TableCell>
                                    <TableCell>Field Label</TableCell>
                                    <TableCell>Field Type</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {formFields.map((field, index) => (
                                    <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{ field.name}</TableCell>
                                    <TableCell>{field.label}</TableCell>
                                    <TableCell>{ field.type}</TableCell>
                                    <TableCell>
                                    <Button variant="contained" onClick={() => handleEditField(index)} color="warning" style={{ marginRight: '8px' }}>Edit</Button>
                                            <Button variant="contained" onClick={() => handleDeleteField(index)} color="error" style={{ marginRight: '8px' }}>Delete</Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                    </Grid>
           
                    <Grid item>
                            <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                                <Button variant="contained" color="primary" style={{ marginRight: '8px' }} size="medium" onClick={handleSubmit}>
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
export default AddLeadCategoryTransactions;