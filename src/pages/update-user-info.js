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

function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [is_portfolio, setis_portfolio] = useState('');
    
  
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    const handleChange = (event) => {
        setis_portfolio(event.target.value);
    };

    useEffect(() => {
       
        const all_parameters = {
            "id": id
        }
        const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const getTnx = async () => {
          const reqData = {
            encReq: encryptedData
          };
          try {
            const response = await api.post('/api/users/63c6ad33e3395d611c35ed9ef749fd8fe4ae2bb4', reqData);
            if (response.status === 200) {
                const decryptedObject = DataDecrypt(response.data);
                setFirstName(decryptedObject.data[0].first_name);
                setLastName(decryptedObject.data[0].last_name);
                setEmail(decryptedObject.data[0].email);
                setMobile(decryptedObject.data[0].mobile);
                setis_portfolio(decryptedObject.data[0].is_portfolio);
                // setPassword(decryptedObject.data[0].password);
             
                    // setFirstName(response.data.data[0].first_name);
                    // setLastName(response.data.data[0].last_name);
                    // setEmail(response.data.data[0].email);
                    // setMobile(response.data.data[0].mobile);
                    // setPassword(response.data.data[0].password);
             
           
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
      
            const formData ={
                'user_id':id,
                'sender_user_id':2,
                'firstName':first_name,
                'lastName':last_name,
                'mobile':mobile,
                'email':email,
                'password':password,
                'is_portfolio': is_portfolio
            }

        try {
            const response = await api.post("/api/users/update-user-info-admin", formData);
            
            if (response) {
                window.history.back();
                alert('User Details Updated successfully');
            } 
             else {
                alert('Failed To Updated');
                console.error('Failed to save');
            }

        } catch (error) {
            console.error('Error updating :', error);
        }
        
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

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>User Profile [Update] </Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >

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
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={1} mb={0} style={{width: '49%', verticalAlign: 'top'}} >

                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Show Portfolio</InputLabel>
                                <Select
                                    labelId="transaction-type-label"
                                    id="transaction-type"
                                    variant="outlined"
                                    value={is_portfolio}
                                    label="Show Portfolio"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="1">Yes</MenuItem>
                                    <MenuItem value="0">No</MenuItem>
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

