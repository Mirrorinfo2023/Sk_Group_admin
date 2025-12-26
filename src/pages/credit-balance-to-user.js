"use client"
import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
// import Head from "next/head";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import CreditTransactions from "@/components/Dashboard/User/CreditBalance";
import { Grid, Button,TableContainer, Paper, Typography, Divider, Box, TextField, Select, MenuItem, FormControl,InputLabel, Link } from "@mui/material";
import dayjs from 'dayjs';
import { useRouter } from 'next/router';



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
    const router = useRouter();
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }
    const handleSearch = (text) => {
        setSearchTerm(text);
    };
    const  attr  = router.query;
    // console.log(attr);
    const dispatch = useDispatch();
    const [mlmId, setMlmId] = useState('');
    const [mobile, setMobile] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [fromDate, setFromDate] = React.useState(dayjs(getDate.date));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));
    const [buttonHidden, setButtonHidden] = useState(false);
    const [narration, setNarration] = useState('');

    // useEffect(() => {
    //     const getTnx = async () => {
    //         const reqData = {
    //             from_date: fromDate.toISOString().split('T')[0],
    //             to_date: toDate.toISOString().split('T')[0],
    //         }

    //         try {

    //             const response = await api.post("/api/report/user-summary", reqData);

    //             if (response.status === 200) {
    //                 setShowServiceTrans(response.data.data)
    //             }

    //         } catch (error) {

    //             if (error?.response?.data?.error) {
    //                 dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
    //             } else {
    //                 dispatch(callAlert({ message: error.message, type: 'FAILED' }))
    //             }

    //         }
    //     }

    //     if (fromDate || toDate) {
    //         getTnx();
    //     }

    // }, [fromDate, toDate, dispatch]);

    const handleFromDateChange = (date) => {
        setFromDate(date);
      };
    
      const handleToDateChange = (date) => {
        setToDate(date);
      };

   
        const handleChange = (event) => {
            setSelectedValue(event.target.value);
        };

        const filteredRows = rows.filter(row => {
            return (
              (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
              (row.mobile && row.mobile.includes(searchTerm)) ||
              (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (row.sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (row.recharge_type && row.recharge_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (row.reference_no && row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (row.transaction_id && row.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
              // Add conditions for other relevant columns
            );
        });


        
       
      const handleSubmit = async () => {
        setButtonHidden(true);
          const formData ={
       
            'walletType':selectedValue,
            'mobile' :mobile,
            'amount' :amount,
            'action': attr.action,
            'narration': narration
          }
          setMlmId('');
          setMobile('');
          setAmount('');
        try {
          const response = await api.post('/api/wallet/d7dfaf86f2ab8c7013f268736ab747e07bd8558e ', formData);
          
          if (response) {
            window.history.back();
            alert(response.data.message);
          } else {
            console.error('Failed to save');
          }

        } catch (error) {
          console.error('Error  file:', error);
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

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '15%', verticalAlign: 'top'}} >
                        <Typography variant="h5"  sx={{ padding: 2 }}>{attr.action}</Typography>
                    </Box>

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '180px', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Wallet Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedValue}
                                label="Wallet"
                                onChange={handleChange}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                <MenuItem value="wallet">Main Wallet</MenuItem>
                                <MenuItem value="cashback">Cashback wallet</MenuItem>
                                <MenuItem value="income">Income Wallet</MenuItem>
                                <MenuItem value="prime">Prime Wallet</MenuItem>
                                <MenuItem value="epin">Epin Wallet</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>

                    
                    <Box display={'inline-block'}  justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '15%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Mobile" variant="outlined" display={'inline-block'}
                        value={mobile} onChange={(e) => setMobile(e.target.value)}  />
                    </Box>

                    <Box display={'inline-block'}  justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '15%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Amount" variant="outlined" display={'inline-block'}
                        value={amount} onChange={(e) => setAmount(e.target.value)}  />
                    </Box>

                    <Box display={'inline-block'}  justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '20%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                        <TextField required  fullWidth label="Narration" variant="outlined" display={'inline-block'}
                        value={narration} onChange={(e) => setNarration(e.target.value)}  />
                    </Box>
                 
                    <Box display={'inline-block'}  justifyContent={'space-between'}  mr={2}  mt={2} ml={2} mb={1} >
                    {!buttonHidden && (
                        <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                    <Link href={`/bulk-income-credit/?action=${attr.action}`}  ml={2}>
                                <Button variant="contained" color="warning" size="medium" >
                                    Bulk Upload
                                </Button>
                            </Link>
                    </Box>
                    
                  
                </TableContainer>
            </Grid>
            
            </Grid>
                <CreditTransactions showServiceTrans={filteredRows} />
        </Layout>

    );
}
export default withAuth(TransactionHistory);

