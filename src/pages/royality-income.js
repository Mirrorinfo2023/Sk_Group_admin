"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/IncomeReport/royality_income";
import { Grid,Paper,TableContainer } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { Steps } from 'antd';
import { Typography,Divider,Box,TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
    const [report, setReport] = useState(null);
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
            const response = await api.post('/api/report/royality-income-report', reqData);
            console.log(response.data.data);
            if (response.status === 200) {
              setShowServiceTrans(response.data.data);
              setReport(response.data.report);
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

      const filteredRows = rows.filter(row => {
        return (
          (row.royality_name && row.royality_name.toLowerCase().includes(searchTerm.toLowerCase()))
          // Add conditions for other relevant columns
        );
    });

    // console.log(filteredRows);
    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
                <Grid item={true} justifyContent='center' xs={12} >
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1} ml={25} mr={14} style={{width: '19%', verticalAlign: 'top'}}>
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
                                {report ? report.total_royalitygenerate : 0} 
                                </Box>
                               
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>	Total Royality Generate</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={14} style={{width: '17%', verticalAlign: 'top'}}>
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
                              {report ? report.todays_royalityIncome : 0} 
                                </Box>
                              
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>	Todays Royality Income</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={14} style={{width: '19%', verticalAlign: 'top'}}>
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
                                {report ? report.Month_royalityIncome : 0} 
                                </Box>
                               
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Month Royality Income</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    {/* <Grid item xs={4} display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={1} mb={1}  mr={8} style={{width: '19%', verticalAlign: 'top'}}>
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
                                {report ? report.total_user2360B : 0} 
                                </Box>
                                <Box
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
                                </Box>
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total User 2360B count</Typography>
                            </Typography>
                            </Item>
                    </Grid> */}
                    
                </Grid>
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>Royality Income</Typography>
                </Box>
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

