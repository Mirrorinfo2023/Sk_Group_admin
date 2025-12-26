"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button,Link } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

  

  const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

    return formattedDateTime;
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
  
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

  
    const [title, setTitle] = useState('');
    const [meeting_link, setMeetingLink] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [valid_till, setmeetingDate] = React.useState(dayjs(getDate.date));

    const handleChange = (event) => {
        setTransactionType(event.target.value);
      };
  
    const statushandleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleFromDateChange = (date) => {
        setmeetingDate(date);
      };


    useEffect(() => {
        const getCategories = async () => {
          try {
            const response = await api.post("/api/affiliate_link/get-affiliate-category");
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

    
    useEffect(() => {
       
        const all_parameters = {
            "id": id
        }
       
        const getTnx = async () => {
        //   const reqData = {
        //     encReq: encryptedData
        //   };
          try {
            const response = await api.post('/api/affiliate_link/get-link', all_parameters);
          
            if (response.status === 200) {
                
                setTitle(response.data.data.title);
                setMeetingLink(response.data.data.link);
                setTransactionType(response.data.data.category_id);
                setStatus(response.data.data.status);
                setAmount(response.data.data.amount);
                setmeetingDate(response.data.data.till_date);
               
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

     
        try {
        
                const formData ={
                    'id':id,
                    'image': selectedFile,
                    'title':title,
                    'category_id':transactionType,
                    'link':meeting_link,
                    'status':status,
                    'amount':amount,
                    'valid_date':valid_till

                }
              
                const response = await api.post('/api/affiliate_link/update-affiliate-link', formData,{
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
                    <Typography variant="h5"  sx={{ padding: 2 }}>Affiliate Link [Update] </Typography>
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Affiliate Name" variant="outlined" display={'inline-block'}
                        value={title} onChange={(e) => setTitle(e.target.value)}  />
                    </Box>


                        
                    
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Link Category</InputLabel>
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

                   
               
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Affiliate Link" variant="outlined" display={'inline-block'}
                        value={meeting_link} onChange={(e) => setMeetingLink(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Amount" variant="outlined" display={'inline-block'}
                        value={amount} onChange={(e) => setAmount(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} ml={1} mt={2} mb={2} style={{width: '80%', verticalAlign: 'top'}} >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            
                                <DatePicker 
                                    label="Valid For"
                                    value={valid_till}
                                    sx={{ padding: 1, lineHeight: 20, width:356 }}
                                    format="DD-MM-YYYY"
                                    onChange={handleFromDateChange}
                                    />
                        </LocalizationProvider>
                        
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
                        <br /><br />
                    </TableContainer>
                </Grid> 
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

