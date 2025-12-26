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
import Transactions from "@/components/Partners/transactions";
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
    const [partner_id, setPartnerId] = useState('');
    const [partners, setPartners] = useState([]);
    const [buttonHidden, setButtonHidden] = useState(false);
    const [narration, setNarration] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [amount , setAmount ] = useState('');

    useEffect(()=>{
        const getPartners = async () => {
            try {
                const partners = await api.post("/api/partner/get-partners");
                if (partners.status === 200) {
                    setPartners(partners.data.data);
                }
            } catch (error) {

                if (error?.partners?.data?.error) {
                    dispatch(callAlert({ message: error.partners.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }

            }
        }
        getPartners();
    }, [dispatch]);

    useEffect(() => {

        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
                partner_id: partner_id
            }

            try {

                const response = await api.post("/api/partner/get-partner-transactions", reqData);
                
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setTotalPageCount(response.data.totalPageCount);
                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }

            }
        }

        if ((fromDate || toDate) && partner_id) {
            getTnx();
        }

    }, [fromDate, toDate, dispatch, partner_id]);


    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    
    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const handleChange = (event) => {
        
        setPartnerId(event.target.value);
    };

    const transhandleChange = (event) => {
        
        setSelectedValue(event.target.value);
    };

    const handleSubmit = async () => {
        setButtonHidden(true);
          const formData ={
            'partner_id': partner_id,
            'amount' :amount,
            'action': selectedValue,
            'narration': narration
          }
          setAmount('');
          setNarration('');
        try {
          const response = await api.post('/api/partner/credit-debit-wallet', formData);
          
          if (response) {
            window.location.reload();
            alert(response.data.message);
          } else {
            console.error('Failed to save');
          }

        } catch (error) {
          console.error('Error  file:', error);
        }
        
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>Partners Transaction history</Typography>
                    </Box>

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={2} mb={1} style={{width: '200px', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Partners</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={partner_id}
                                label="Partners"
                                onChange={handleChange}
                            >
                                <MenuItem value="">Choose Partner</MenuItem>
                                {partners.map((partner) => (

                                    <MenuItem key={partner.id} value={partner.id}>
                                    {partner.name}-{partner.company_code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
                            
    
                    
                </TableContainer>
            </Grid>


            <Grid item={true} xs={12}   >
                <TableContainer component={Paper} >

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '180px', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedValue}
                                onChange={transhandleChange}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                <MenuItem value="Credit">Credit</MenuItem>
                                <MenuItem value="Debit">Debit</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>

                    <Box display={'inline-block'}  justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '15%', verticalAlign: 'top', padding: '0 10px'}} >
                        
                        <TextField required  fullWidth label="Amount" variant="outlined" display={'inline-block'}
                        value={amount} onChange={(e) => setAmount(e.target.value)}  />
                    </Box>

                    <Box display={'inline-block'}  justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top', padding: '0 10px'}} >
                            
                        <TextField required  fullWidth label="Narration" variant="outlined" display={'inline-block'}
                        value={narration} onChange={(e) => setNarration(e.target.value)}  />
                    </Box>
                 
                    <Box display={'inline-block'}  justifyContent={'space-between'}  mr={2}  mt={2} ml={2} mb={1} >
                    {!buttonHidden && (
                        <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                    </Box>
                  
                </TableContainer>
            </Grid>
            
            </Grid>
                <Transactions showServiceTrans={filteredRows} totalPageCount={totalPageCount} setTotalPageCount={setTotalPageCount}  />
        </Layout>

    );
}
export default withAuth(TransactionHistory);

