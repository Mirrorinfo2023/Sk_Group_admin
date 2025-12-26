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


function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { setting_id } = router.query;

    const [recharge_cutoff_limit, setrecharge_cutoff_limit] = useState('');
    const [bbps_cutoff_limit, setbbps_cutoff_limit] = useState('');
    const [recharge_panel_cron, setrecharge_panel_cron] = useState('');

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    useEffect(() => {
        const getTnx = async () => {
          const reqData = {
          };

          // const originalString = 'Hello, World!';
          // const encryptedData = DataEncrypt(JSON.stringify(originalString));
          // console.log(encryptedData);
          // const decryptedObject = DataDecrypt(encryptedData);
          // console.log(decryptedObject);
          try {
            const response = await api.post('/api/setting/get-setting', reqData);
            if (response.status === 200) {
              setShowServiceTrans(response.data.data);
              setrecharge_cutoff_limit(response.data.data[0].recharge_cutoff_limit);
              setbbps_cutoff_limit(response.data.data[0].bbps_cutoff_limit);
              setrecharge_panel_cron(response.data.data[0].recharge_panel_cron);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (setting_id) {
          getTnx();
        }
      }, [setting_id, dispatch]);

        const handleSubmit = async () => {
            // alert(status);
           
              // const formData = new FormData();
              // formData.append('img', selectedFile);
              // formData.append('title', title);
              // formData.append('categoryId',transactionType);

              const formData ={
                'recharge_limit': recharge_cutoff_limit,
                'bbps_cutoff_limit': bbps_cutoff_limit,
                'recharge_panel_cron': recharge_panel_cron,
                'setting_id': setting_id
              }
    
            try {
                const response = await api.post("/api/setting/get-setting", formData);
                
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
                    <Typography variant="h5"  sx={{ padding: 2 }}>System Setting [Update]</Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Recharge Cutoff Limit" variant="outlined" display={'inline-block'}
                            value={recharge_cutoff_limit} onChange={(e) => setrecharge_cutoff_limit(e.target.value)}  />
                        </Box>
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="BBPS Cutoff Limit" variant="outlined" display={'inline-block'}
                            value={bbps_cutoff_limit} onChange={(e) => setbbps_cutoff_limit(e.target.value)}  />
                        </Box>
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                            <TextField required  fullWidth label="Recharge Panel Cron" variant="outlined" display={'inline-block'}
                            value={recharge_panel_cron} onChange={(e) => setrecharge_panel_cron(e.target.value)}  />
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

