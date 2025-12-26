"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button, Image, TableBody,TableRow, TableCell, Table, TableHead } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

function TransactionHistory(props) {

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
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const [category_name, setservice_name] = useState('');
    const [discount_upto, setservice_discount_upto] = useState('');
    const [description, setdescription] = useState('');
    const [status, setstatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [category_image, setcategory_image] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
    const [editingIndex, setEditingIndex] = useState(null);

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setcategory_image(URL.createObjectURL(file));
    };
  
    const chandleChange = (event) => {
        setSelectedValue(event.target.value);
      };

    useEffect(() => {
        const getTnx = async () => {
          const reqData = {
            "category_id": id
          };

          // const originalString = 'Hello, World!';
          // const encryptedData = DataEncrypt(JSON.stringify(originalString));
          // console.log(encryptedData);
          // const decryptedObject = DataDecrypt(encryptedData);
          // console.log(decryptedObject);
          try {
            const response = await api.post('/api/leads/get-lead-category', reqData);
            if (response.status === 200) {
                setservice_name(response.data.data.category_name);
                setservice_discount_upto(response.data.data.discount_upto);
                setdescription(response.data.data.description);
                setstatus(response.data.data.status);
                setcategory_image(response.data.data.category_image);
                setFormFields(response.data.data.input_params);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (id) {
          getTnx();
        }
      }, [id, dispatch]);

    const handleSubmit = async () => {
        // alert(status);
        
            // const formData = new FormData();
            // formData.append('img', selectedFile);
            // formData.append('title', title);
            // formData.append('categoryId',transactionType);

            const formData ={
                'id':id,
                'category_name': category_name,
                'discount_upto': discount_upto,
                'description': description,
                'status': status,
                'category_image': selectedFile,
                'formFields': formFields
            }
            console.log(formData);

        try {
            const response = await api.post("/api/leads/update-lead-category", formData, {

                headers:{'content-type': 'multipart/form-data'}
              
              
              });
            
            if (response) {
                window.history.back();
                alert('Updated successfully');
            } 

        } catch (error) {
            console.error('Error updating :', error);
        }
        
        };
          
        // const priorityhandleChange = (event) => {
        //     setpriority(event.target.value);
        // };
    
        const statushandleChange = (event) => {
            setstatus(event.target.value);
        };


        const fieldTypes = [
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'password', label: 'Password' },
            { value: 'image', label: 'Image' },
          ];
    
          
    
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

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>Lead Category [Update] </Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Category Name" variant="outlined" display={'inline-block'}
                            value={category_name}   onChange={(e) => setservice_name(e.target.value)} />
                        </Box>
                        <br />
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Discount Upto" variant="outlined" display={'inline-block'}
                            value={discount_upto} onChange={(e) => setservice_discount_upto(e.target.value)}  />
                        </Box>
                        <br />
                        {/* <Box justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedValue}
                                label="Status"
                                onChange={chandleChange}
                            >
                                <MenuItem value="">Default</MenuItem>
                                <MenuItem value="Health">Health</MenuItem>
                                <MenuItem value="Term">Term</MenuItem>
                                <MenuItem value="Wealth">Wealth</MenuItem>
                                <MenuItem value="Vehicle">Vehicle</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                                
                            </Select>
                        </FormControl>

                        </Box> */}
                        {/* <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={priority}
                                label="Priority"
                                onChange={priorityhandleChange}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                            </Select>
                        </FormControl>
                        </Box> */}

                        
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >
                        
                        <TextareaAutosize  fullWidth
                                label="Description" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Description" 
                                style={{height: '90px', width:'968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                        /> 
                        </Box>



                        <br />
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Status"
                                onChange={statushandleChange}
                            >
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>Inactive</MenuItem>
                            </Select>
                        </FormControl>

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
                                {formFields && formFields.map((field, index) => (
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
                        <br /><br />
                        <Grid item>
                            <Box display="flex" justifyContent="flex-first" mr={2}  mt={1} ml={2} mb={1} >
                            <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                                Update
                            </Button>
                            </Box>   
                        </Grid>
                        <br /><br /><br /><br /><br />
                    </TableContainer>
                </Grid>
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

