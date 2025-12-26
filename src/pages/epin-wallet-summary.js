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
import Transactions from "@/components/Dashboard/User/epin_wallet";
import { Grid, Button,TableContainer, Paper, Typography, Divider, Box, TextField, Select, MenuItem, FormControl,InputLabel } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';



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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function TransactionHistory(props) {

    

    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [masterReport, setmasterReport] = useState({});
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
    
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));
    const [totalPageCount, setTotalPageCount] = React.useState(dayjs(getDate.date));

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
            }

            try {

                const response = await api.post("/api/report/epin-wallet-summary", reqData);
                
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setTotalPageCount(response.data.totalPageCount);
                    setmasterReport(response.data.report);
                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }

            }
        }

        if (fromDate || toDate) {
            getTnx();
        }

    }, [fromDate, toDate, dispatch]);

    const handleFromDateChange = (date) => {
        setFromDate(date);
      };
    
      const handleToDateChange = (date) => {
        setToDate(date);
      };

      const [selectedValue, setSelectedValue] = useState('');

        const handleChange = (event) => {
            
            setSelectedValue(event.target.value);
        };
        let filteredRows;
    
        if (selectedValue !== '') { 
            filteredRows = rows.filter(row => {
                return (
                    // Check if row.sub_type matches selectedValue
                    (row.sub_type && row.sub_type.toLowerCase().includes(selectedValue.toLowerCase())) &&
                    // Also check if searchTerm matches any of the relevant columns
                    (
                        (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
                        (row.mobile && row.mobile.includes(searchTerm)) ||
                        (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (row.recharge_type && row.recharge_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (row.reference_no && row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (row.transaction_id && row.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                );
            });
        } else {
            filteredRows = rows.filter(row => {
                return (
                    // If selectedValue is empty, search using only searchTerm across multiple columns
                    (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
                    (row.mobile && row.mobile.includes(searchTerm)) ||
                    (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (row.sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (row.recharge_type && row.recharge_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (row.reference_no && row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (row.transaction_id && row.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            });
        }

    return (
        
        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
                  <Grid item={true} justifyContent='center' xs={12} >
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1} ml={10} mr={8} style={{width: '19%', verticalAlign: 'top'}}>
                    <Item
                            sx={{
                                height: 100,
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #0000FF',
                                borderRadius: '10px',
                            }}
                            >
                            <Typography variant="h6" component="div">
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#FFA500', // Orange
                                }}
                                >
                                {masterReport.totalOldBal ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box>
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :500
                                </Box> */}
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Old Balance</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={8} style={{width: '19%', verticalAlign: 'top'}}>
                    <Item
                            sx={{
                                height: 100,
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #0000FF',
                                borderRadius: '10px',
                            }}
                            >
                            <Typography variant="h6" component="div">
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#FFA500', // Orange
                                }}
                                >
                                {masterReport.totalNewBal ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box>
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :500
                                </Box> */}
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total New Balance</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={8} style={{width: '19%', verticalAlign: 'top'}}>
                    <Item
                            sx={{
                                height: 100,
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #0000FF',
                                borderRadius: '10px',
                            }}
                            >
                            <Typography variant="h6" component="div">
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#FFA500', // Orange
                                }}
                                >
                                {masterReport.totalCredit ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box>
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :500
                                </Box> */}
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Credit</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={8} style={{width: '19%', verticalAlign: 'top'}}>
                    <Item
                            sx={{
                                height: 100,
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #0000FF',
                                borderRadius: '10px',
                            }}
                            >
                            <Typography variant="h6" component="div">
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#FFA500', // Orange
                                }}
                                >
                                {masterReport.totalDebit ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box>
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :500
                                </Box> */}
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Debit</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    
                </Grid>
            
            <Grid item={true} xs={12}   >
                <TableContainer component={Paper} >

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '15%', verticalAlign: 'top'}} >
                        <Typography variant="h5"  sx={{ padding: 2 }}>User E-pin Summary</Typography>
                    </Box>

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '180px', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedValue}
                                label="Transaction Type"
                                onChange={handleChange}
                            >
                                <MenuItem value="">Default</MenuItem>
                                <MenuItem value="Add Money">Add Money</MenuItem>
                                <MenuItem value="Plan Purchase">Plan Purchase</MenuItem>
                                <MenuItem value="Send Money">Send Money</MenuItem>
                                <MenuItem value="Receive Money">Receive Money</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={3} mb={1} sx={{ width: '16%', verticalAlign: 'top' }}>
                        <TextField id="standard-basic" placeholder="Search" variant="standard" mt={2} style={{width: '90%', marginLeft: 12 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon />
                            ),
                        }}/>
                    </Box>
            
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1} sx={{ verticalAlign: 'top' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>
                    
                    <DatePicker 
                        label="From Date"
                        value={fromDate}
                        sx={{ padding: 1, lineHeight: 20 }}
                        format="DD-MM-YYYY"
                        onChange={handleFromDateChange}
                        />
                
                    <DatePicker 
                        label="To Date"
                        value={toDate}
                        sx={{ padding: 1, lineHeight: 20 }}
                        format="DD-MM-YYYY"
                        onChange={handleToDateChange}
                        />
                        
                    </div>
                    {/* </DemoContainer> */}
                    
                    </LocalizationProvider>
                    
                        
                    </Box>
                            
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={2} ml={2} mb={1} >
                            <Button variant="contained" color="success" style={{ marginRight: '8px' }} size="medium" href={`/credit-balance-to-user/?action=Credit`}>
                            Credit
                            </Button>
                            <Button variant="contained" color="warning" href={`/credit-balance-to-user/?action=Debit`}>Debit</Button>
                    </Box>
                    
                </TableContainer>
            </Grid>
            
            </Grid>
                <Transactions showServiceTrans={filteredRows} totalPageCount={totalPageCount} setTotalPageCount={setTotalPageCount}  />
        </Layout>

    );
}
export default withAuth(TransactionHistory);

