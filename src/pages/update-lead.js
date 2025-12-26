"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

    const [lead_name, setLeadName] = useState('');
    const [category_id, setcategory_id] = useState('');
    const [specification, setSpecification] = useState('');
    const [status, setstatus] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    useEffect(() => {
       
        const all_parameters = {
            "id": id
        }
        // const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const getTnx = async () => {
        //   const reqData = {
        //     encReq: encryptedData
        //   };
          try {
            const response = await api.post('/api/leads/get-lead-admin', all_parameters);
            if (response.status === 200) {
                // const decryptedObject = DataDecrypt(response.data);
                // setLeadName(decryptedObject.data.lead_name);
                // setcategory_id(decryptedObject.data.category_id);
                // setSpecification(decryptedObject.data.specification);
                // setDescription(decryptedObject.data.description);
                // setLink(decryptedObject.data.link);
                // setstatus(decryptedObject.data.status);
                setLeadName(response.data.data.lead_name);
                setcategory_id(response.data.data.category_id);
                setSpecification(response.data.data.specification);
                setDescription(response.data.data.description);
                setLink(response.data.data.link);
                setstatus(response.data.data.status);
           
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

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {

            const formData ={
                'id':id,
                'lead_name':lead_name,
                'category_id':category_id,
                'link':link,
                'status':status,
                'description':description,
                'specification':specification,
                'image': selectedFile,
            }

           

        try {
            const response = await api.post("/api/users/update-lead", formData);
            
            if (response) {
                window.history.back();
                alert('Updated successfully');
            } 

        } catch (error) {
            console.error('Error updating :', error);
        }
        
        };
          
   
        const statushandleChange = (event) => {
            setstatus(event.target.value);
        };
        const categoryhandleChange = (event) => {
            setcategory_id(event.target.value);
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
                    <Typography variant="h5"  sx={{ padding: 2 }}>Lead [Update] </Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >



                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Lead Name" variant="outlined" display={'inline-block'}
                            value={lead_name}   onChange={(e) => setLeadName(e.target.value)} />
                        </Box>
                        <br />
                   
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category_id}
                                label="Category"
                                onChange={categoryhandleChange}
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

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Link" variant="outlined" display={'inline-block'}
                            value={link} onChange={(e) => setLink(e.target.value)}  />
                        </Box>
                      

                      

                        
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >
                        
                        <TextareaAutosize  fullWidth
                                label="Specification" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Specification" 
                                style={{height: '90px', width:'968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                value={specification}
                                onChange={(e) => setSpecification(e.target.value)}
                        /> 
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >
                        
                        <TextareaAutosize  fullWidth
                                label="Description" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Description" 
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

