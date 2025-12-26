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
import { useRouter } from 'next/router';
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



const UserDetailsTransactions = () => {

    const router = useRouter();
    const  uid  = router.query;
    
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
     
      const handleSubmit = async () => {
        
          const formData ={
            'user_id':uid.id,
            'sender_user_id':2,
            'firstName':first_name,
            'lastName':last_name,
            'mobile':mobile,
            'email':email,
            'password':password,
          
          }

        try {
           
          const response = await api.post('/api/users/update-user-info-admin', formData);

          if (response) {
            window.history.back();
            alert('User Details Updated successfully');
          } else {
            console.error('Failed to save');
          }

        } catch (error) {
          console.error('Error uploading file:', error);
        }
        
      };

     
      const handleCancel = async () => {
        window.history.back();
      };
    
      const handleCheckAvailabliltyClick = async () => {
        
        if (!email) {
          console.error('Id is missing.');
          return;
        }
      
        let searchField='';
            if (email ) {
                searchField=email;
            } else {
                searchField=mobile;
          }
        
        const requestData = {
          mobileOrEmail: searchField,
         
        };

       
        try {
         
            const response = await api.post("/api/users/check-mobileOrEmail-admin", requestData);
            
            if (response.data.status === 200) {
                alert(`WARNING... ${searchField} Already IN USE`);
            }else{
                alert(`SUCCESS... You Can Use This ${searchField}`);
                
            }

        } catch (error) {
            console.error("Error:", error);
           
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>Update User Details</Typography>
                    </Box>


                    <Grid spacing={2}   sx={{ padding: 2 }} container>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="First Name" variant="outlined" display={'inline-block'}
                        value={first_name} onChange={(e) => setFirstName(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Last Name" variant="outlined" display={'inline-block'}
                        value={last_name} onChange={(e) => setLastName(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%',verticalAlign: 'top', padding: '0 10px', whiteSpace: 'nowrap'}} >
                        <TextField required  fullWidth label="Email" variant="outlined" display={'inline-block'} 
                        value={email} onChange={(e) => setEmail(e.target.value)}  />

                        <Button display={'inline-block'} variant="contained" size="large" color="success"  alignItems={'left'} onClick={handleCheckAvailabliltyClick} sx={{  marginLeft:2 }} mt={2}>Check Email Availability</Button>
                                                       
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px', whiteSpace: 'nowrap'}} >
                        <TextField required  fullWidth label="Mobile" variant="outlined" display={'inline-block'}
                        value={mobile} onChange={(e) => setMobile(e.target.value)}  />

                        <Button display={'inline-block'} variant="contained" size="large" color="success"  alignItems={'left'} onClick={handleCheckAvailabliltyClick} sx={{  marginLeft:2 }} mt={2}>Check Mobile Availability</Button>
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Password" variant="outlined" display={'inline-block'}
                        value={password} onChange={(e) => setPassword(e.target.value)}  />
                    </Box>

                    
                    </Grid>

                    <Grid item>
                        <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                        <Button variant="contained" color="success" style={{ marginRight: '8px' }} size="medium" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="outlined" mr={2} onClick={handleCancel} >Cancel</Button>
                        </Box>
                  
                            
                        </Grid>
                    
                </TableContainer>
            </Grid>
            
            </Grid>
              
        </main>
    )
}
export default UserDetailsTransactions;