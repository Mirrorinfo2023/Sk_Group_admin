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



const UserIncomeTransactions = () => {

    const router = useRouter();
    const  uid  = router.query;
    
    const [totalEarning, setEarningAmount] = useState('');
    const [totalwithdrawal, setWithdrawalAmount] = useState('');
    const [silverRoyalty, setSilverRoyalty] = useState('');
    const [goldRoyalty, setGoldRoyalty] = useState('');
    const [platinumRoyalty, setPlatinumRoyalty] = useState('');
    const [daimondRoyalty, setDaimondRoyalty] = useState('');
    // const [carFund, setCarFund]= useState('');
    // const [houseFund, setHouseFund]= useState('');
    // const [travelFund, setTravelFund]= useState('');
    // const [awardFund, setAwardFund]= useState('');
    const [selfIncome, setSelfIncome]= useState('');
    const [repurchaseIncome, setRepurchaseIncome]= useState('');
    const [upgradeIncome, setUpgradeIncome]= useState('');
    const [levelIncome, setLevelIncome]= useState('');

  
     
      const handleSubmit = async () => {
        
          const formData ={
            'user_id':uid.id,
            'totalEarning':totalEarning,
            'totalwithdrawal':totalwithdrawal,
            'silverRoyalty':silverRoyalty,
            'goldRoyalty':goldRoyalty,
            'platinumRoyalty':platinumRoyalty,
            'daimondRoyalty':daimondRoyalty,
          
            // 'carFund':carFund,
            // 'houseFund':houseFund,
            // 'travelFund':travelFund,
            // 'awardFund':awardFund,

            'selfIncome':selfIncome,
            'repurchaseIncome':repurchaseIncome,
            'upgradeIncome':upgradeIncome,
            'levelIncome':levelIncome,

          }

        try {
        //    console.log(formData);
          const response = await api.post('/api/users/d7dfaf86f2ab8c7013f268736ab747e07bd8558e ', formData);

          if (response) {
            window.history.back();
            alert('Income Added successfully');
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>Income Credit/Debit</Typography>
                    </Box>


                    <Grid spacing={2}   sx={{ padding: 2 }} container>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Total Earning" variant="outlined" display={'inline-block'}
                        value={totalEarning} onChange={(e) => setEarningAmount(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Total withdrawal" variant="outlined" display={'inline-block'}
                        value={totalwithdrawal} onChange={(e) => setWithdrawalAmount(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Silver Royalty" variant="outlined" display={'inline-block'}
                        value={silverRoyalty} onChange={(e) => setSilverRoyalty(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Gold Royalty" variant="outlined" display={'inline-block'}
                        value={goldRoyalty} onChange={(e) => setGoldRoyalty(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Platinum Royalty" variant="outlined" display={'inline-block'}
                        value={platinumRoyalty} onChange={(e) => setPlatinumRoyalty(e.target.value)}  />
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Daimond Royalty" variant="outlined" display={'inline-block'}
                        value={daimondRoyalty} onChange={(e) => setDaimondRoyalty(e.target.value)}  />
                    </Box>

                    

                    {/* <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Car Fund" variant="outlined" display={'inline-block'}
                        value={carFund} onChange={(e) => setCarFund(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="House Fund" variant="outlined" display={'inline-block'}
                        value={houseFund} onChange={(e) => setHouseFund(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Travel Fund" variant="outlined" display={'inline-block'}
                        value={travelFund} onChange={(e) => setTravelFund(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Award Fund" variant="outlined" display={'inline-block'}
                        value={awardFund} onChange={(e) => setAwardFund(e.target.value)}  />
                    </Box> */}

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Self Income" variant="outlined" display={'inline-block'}
                        value={selfIncome} onChange={(e) => setSelfIncome(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Repurchase Income" variant="outlined" display={'inline-block'}
                        value={repurchaseIncome} onChange={(e) => setRepurchaseIncome(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Upgrade Income" variant="outlined" display={'inline-block'}
                        value={upgradeIncome} onChange={(e) => setUpgradeIncome(e.target.value)}  />
                    </Box>
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                        <TextField required  fullWidth label="Level Income" variant="outlined" display={'inline-block'}
                        value={levelIncome} onChange={(e) => setLevelIncome(e.target.value)}  />
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
export default UserIncomeTransactions;