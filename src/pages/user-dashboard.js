"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import Image from "next/image";

function TransactionHistory(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [mlm_id, setmlm_id] = useState('');
    const [mobile, setmobile] = useState('');
    const [email, setemail] = useState('');
    const [ref_mlm_id, setref_mlm_id] = useState('');
    const [ref_first_name, setref_first_name] = useState('');
    const [ref_last_name, setref_last_name] = useState('');
    const [ref_mobile, setref_mobile] = useState('');
    const [wallet_balance, setwallet_balance] = useState('');
    const [royality_income, setroyality_income] = useState('');
    const [reward_income, setreward_income] = useState('');
    const [total_walletIncome, settotal_walletIncome] = useState('');
    const [total_passive_walletIncome, settotal_passive_walletIncome] = useState('');
    const [total_earning, settotal_earning] = useState('');
    const [activation_date, setactivation_date] = useState('');
    const [registration_date, setregistration_date] = useState('');
    const [user_status, setuser_status] = useState('');
    
  
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
            "user_id": id
        }
        const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const getTnx = async () => {
          const reqData = {
            encReq: encryptedData
          };
          try {
            const response = await api.post('/api/users/my-details', reqData);
            if (response.status === 200) {
                const decryptedObject = DataDecrypt(response.data);
                
                setfirst_name(decryptedObject.data.first_name);
                setlast_name(decryptedObject.data.last_name);
                setmlm_id(decryptedObject.data.mlm_id);
                setmobile(decryptedObject.data.mobile);
                setemail(decryptedObject.data.email);
                setref_mlm_id(decryptedObject.data.ref_mlm_id);
                setref_first_name(decryptedObject.data.ref_first_name);
                setref_last_name(decryptedObject.data.ref_last_name);
                setref_mobile(decryptedObject.data.ref_mobile);
                setwallet_balance(decryptedObject.data.wallet_balance);
                setroyality_income(decryptedObject.data.royality_income);
                setreward_income(decryptedObject.data.reward_income);
                settotal_walletIncome(decryptedObject.data.total_walletIncome);
                settotal_earning(decryptedObject.data.total_earning);
                setactivation_date(decryptedObject.data.activation_date);
                setregistration_date(decryptedObject.data.registration_date);
                setuser_status(decryptedObject.data.user_status);
                
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
          
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
            
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >
                    <Grid
                        container
                        spacing={4}
                        sx={{ padding: 2 }}
                    >
                    <Grid item xs={6}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ padding: 1 }}
                        >
                        <Grid item xs={3}>
                            <Image src="/icon.png" alt="Icon" width='100' height='100' />
                        </Grid>
                        <Grid item xs={9}>
                            <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                                <Typography variant="h4" >{first_name + ' ' + last_name }</Typography>
                                <Typography variant="h6" style={{ color: 'orange' }} >{mlm_id}</Typography>
                            </Box>
                        </Grid>
                            
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                    <Table aria-label="Users" sx={{ size: 2 }} mt={2} >
                            <TableBody>
                                <TableRow>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{mobile}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{email}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{user_status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Registration Date</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{registration_date}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Activation Date</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{activation_date}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Sponser Name</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{ref_first_name + ' ' + ref_last_name}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Sponser Mobile</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{ref_mobile}</TableCell>
                                </TableRow>
                                
                            </TableBody>
                        </Table>
                    </Grid>
                    </Grid>
                    <Grid item={true} xs={12} >
                        <Grid
                            container
                            spacing={4}
                            sx={{ padding: 2 }}
                        >
                            <Grid item={true} xs={3} >
                                <Paper elevation={6} style={{ backgroundColor: 'royalblue', padding: 20, marginBottom: 20 }}>
                                    <Typography variant="h6" style={{ color: 'white' }}>Wallet Balance</Typography>
                                    <Typography variant="h4" style={{ color: 'white' }}>{wallet_balance}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item={true} xs={3} >
                                <Paper elevation={6} style={{ backgroundColor: 'green', padding: 20, marginBottom: 20 }}>
                                    <Typography variant="h6" style={{ color: 'white' }}>Royality Income</Typography>
                                    <Typography variant="h4" style={{ color: 'white' }}>{royality_income}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item={true} xs={3} >
                                <Paper elevation={6} style={{ backgroundColor: 'orange', padding: 20, marginBottom: 20 }}>
                                    <Typography variant="h6" style={{ color: 'white' }}>Reward Income</Typography>
                                    <Typography variant="h4" style={{ color: 'white' }}>{reward_income}</Typography>
                                </Paper>
                            </Grid>
                            
                           
                            <Grid item={true} xs={3} >
                                <Paper elevation={6} style={{ backgroundColor: 'purple', padding: 20, marginBottom: 20 }}>
                                    <Typography variant="h6" style={{ color: 'white' }}>Total Earning</Typography>
                                    <Typography variant="h4" style={{ color: 'white' }}>{total_earning}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item={true} xs={3} >
                                <Paper elevation={6} style={{ backgroundColor: 'purple', padding: 20, marginBottom: 20 }}>
                                    <Typography variant="h6" style={{ color: 'white' }}>Income Balance</Typography>
                                    <Typography variant="h4" style={{ color: 'white' }}>{total_walletIncome}</Typography>
                                </Paper>
                            </Grid>
                            
                        </Grid>

                    </Grid>
                    
                    <br /><br /><br /><br /><br />
                </TableContainer>  
                </Grid>
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

