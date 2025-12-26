"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import EbookTransactions from "@/components/Ebook/EbookList";
import { Grid,Paper,TableContainer,Button, Typography,Divider,Box,TextField } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import { LocalFireDepartment } from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const drawWidth = 220;
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius: 2,
    // border: '2px solid #000',
    boxShadow: 24, overflow: 'auto'
};

const innerStyle = {
    overflow: 'auto',
    width: 400,
    height: 400,
};


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


    useEffect(() => {
        // const all_parameters = {
        //     "category_name1": null
        // }
        // const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
        const getTnx = async () => {
          const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0],
          }
          try {
            const response = await api.post('/api/ebook/ebook-list', reqData);
            if (response.status === 200) {
            //   const decryptedObject = DataDecrypt(response.data);
              setShowServiceTrans(response.data.data);
              setmasterReport(response.data.report)
              // console.log(response.data.data);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
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

    

      let filteredRows;
     
      // if(selectedValue != ''){
      //     filteredRows = rows.filter(row => {
      //         return (
      //           (row.status !== undefined && row.status === parseInt(selectedValue))
      //         );
      //     });
      // }else{
          filteredRows = rows.filter(row => {
              return (
                (row.ebook_name && row.ebook_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.author && row.author.toLowerCase().includes(searchTerm.toLowerCase())) 
                // (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
                // (row.usermobile && row.usermobile.includes(searchTerm)) ||
                // (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                // (row.reason_name && row.reason_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                // (row.mobile && row.mobile.toLowerCase().includes(searchTerm.toLowerCase()))
              // Add conditions for other relevant columns
              );
          });
      // }

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
                                {masterReport.totalEbookCount ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box> */}
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :500
                                </Box> */}
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Count</Typography>
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
                                {masterReport.totalEbookCount ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box> */}
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                : {masterReport.totalApproveEbook ?? 0}
                                </Box>
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Approve</Typography>
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
                                {masterReport.totalEbookCount ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box> */}
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :{masterReport.totalpendingEbook ?? 0}
                                </Box>
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Pending</Typography>
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
                                {masterReport.totalEbookCount ?? 0}
                                </Box>
                                {/* <Box
                                sx={{
                                    display: 'inline',
                                    color: '#0000FF', // Blue
                                }}
                                >
                                :50
                                </Box> */}
                                <Box
                                sx={{
                                    display: 'inline',
                                    color: '#000000', // Black
                                }}
                                >
                                :{masterReport.totalDeactivatedEbook ?? 0}
                                </Box>
                                <Typography variant="h2" sx={{ padding: 1,fontSize: '22px' }}>Total Deactivated</Typography>
                            </Typography>
                            </Item>
                    </Grid>
                    
                </Grid>

            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '20%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>Ebook</Typography>
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
                        
                        <DatePicker 
                            //label="From Date"
                            value={fromDate}
                            sx={{ padding: 1, lineHeight: 20 }}
                            format="DD-MM-YYYY"
                            onChange={handleFromDateChange}
                            />
                    
                        <DatePicker 
                            //label="To Date"
                            value={toDate}
                            sx={{ padding: 1, lineHeight: 20 }}
                            format="DD-MM-YYYY"
                            onChange={handleToDateChange}
                            />
                            
                       
                        
                        
                        </LocalizationProvider>
                        
                            
                        </Box>
            
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={2} mb={1} sx={{ verticalAlign: 'middle' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* <DemoContainer  ml={2} components={['DatePicker', 'DatePicker']}  > */}

                    </LocalizationProvider>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '5px' }}
                        startIcon={<AddIcon />}
                        href={`/add-ebook/`}
                    >
                       Add Ebook 
                    </Button>   
                    
                    <Button
                        variant="contained"
                        color="primary"
                        href={`/ebook-category-list/`}
                     >
                       Ebook Category
                    </Button>   
                    </Box>
                        </TableContainer>
            </Grid>
            
            </Grid>
            
            <EbookTransactions showServiceTrans={filteredRows} />
        </Layout>


    );
}
export default withAuth(TransactionHistory);

