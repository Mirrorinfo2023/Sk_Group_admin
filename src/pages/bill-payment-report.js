"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/BillPayment/billPayment";
import { Grid,Paper,TableContainer,FormControl ,InputLabel,Select, MenuItem} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { Steps } from 'antd';
import { Typography,Divider,Box,TextField} from "@mui/material";
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

function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }
    // const [fromDate, setFromDate] = useState(new Date());
    // const [toDate, setToDate] = useState(new Date());
  
    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));

    useEffect(() => {
        const getTnx = async () => {
          const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0],
          };
    
          try {
            const response = await api.post('api/report/bill-payment-report', reqData);
            if (response.status === 200) {
              setShowServiceTrans(response.data.data);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (uid) {
          getTnx();
        }
      }, [uid, fromDate, toDate, dispatch]);

      const handleFromDateChange = (date) => {
        setFromDate(date);
      };
    
      const handleToDateChange = (date) => {
        setToDate(date);
      };

      const [searchTerm, setSearchTerm] = useState('');
      const [selectedValue, setSelectedValue] = useState('');

      const handleChange = (event) => {
          
          setSelectedValue(event.target.value);
      };
      let filteredRows;

      if(selectedValue != ''){
          filteredRows = rows.filter(row => {
              return (
                (row.operator_name && row.operator_name.toLowerCase().includes(selectedValue.toLowerCase()))
              );
          });
      }else{
        filteredRows = rows.filter(row => {
          return (
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.consumer_name && row.consumer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.operator_name && row.operator_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.reference_no && row.reference_no.includes(searchTerm)) ||
            (row.trax_id && row.trax_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.transaction_id && row.transaction_id.includes(searchTerm)) ||
            (row.biller_id && row.biller_id.includes(searchTerm))
            // Add conditions for other relevant columns
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
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>Bill Payment Report</Typography>
                </Box>

                  {/* <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '180px', verticalAlign: 'top', padding: '0 10px'}} >

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Operator</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedValue}
                            label="Transaction Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="Airtel">Airtel</MenuItem>
                            <MenuItem value="Bsnl">Bsnl</MenuItem>
                            <MenuItem value="Bsnl Special">Bsnl Special</MenuItem>
                            <MenuItem value="Jio">Jio</MenuItem>
                            <MenuItem value="Vodafone Idea">Vodafone Idea</MenuItem>
                            <MenuItem value="Airtel Digital Tv">Airtel Digital Tv</MenuItem>
                            <MenuItem value="Dish Tv">Dish Tv</MenuItem>
                            <MenuItem value="Sun Direct">Sun Direct</MenuItem>
                            <MenuItem value="Tata Play">Tata Play</MenuItem>
                            <MenuItem value="Videocon D2h">Videocon D2h</MenuItem>
                            
                        </Select>
                    </FormControl>

                </Box> */}

                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={3} mb={1} sx={{ width: '20%', verticalAlign: 'top' }}>
                <TextField id="standard-basic" placeholder="Search" variant="standard" mt={2} style={{width: '100%'}}
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
                        {/* <DemoContainer  ml={2} components={['DatePicker', 'DatePicker']}  > */}
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
            
            </Grid>
            
            <Transactions showServiceTrans={filteredRows} />
        </Layout>


    );
}
export default withAuth(TransactionHistory);

