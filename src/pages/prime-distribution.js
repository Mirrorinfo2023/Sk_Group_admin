"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import UserDistributionTransactions from "@/components/UserReport/UserDistribution";
import { Grid, TableContainer, Paper, Typography, Divider, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
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

function UserDistributionTransactionsReport(props) {
    const router = useRouter();
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();

    const uid = router.query;

    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));

    useEffect(() => {
        const getTnx = async () => {
            const reqData = { sender_id: uid.id };

            try {
                // 🔐 Encrypt request
                const encryptedReq = {
                    data: DataEncrypt(JSON.stringify(reqData))
                };

                const response = await api.post(
                    "/api/refferal-report/prime-distribution-report",
                    encryptedReq
                );
                console.log("response ", response)
                // 🔓 Decrypt response
                const decData = (DataDecrypt(response.data.data));
                console.log("decData ", decData)
                if (decData.status === 200) {
                    setShowServiceTrans(decData.data);
                } else {
                    dispatch(callAlert({ message: decData.message, type: "FAILED" }));
                }

            } catch (error) {
                if (error?.response?.data?.error) {
                    dispatch(callAlert({
                        message: error.response.data.error,
                        type: "FAILED"
                    }));
                } else {
                    dispatch(callAlert({
                        message: error.message,
                        type: "FAILED"
                    }));
                }
            }
        };

        if (uid) {
            getTnx();
        }
    }, [uid, dispatch]);


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
    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >

                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{ width: '30%', verticalAlign: 'top' }} >
                            <Typography variant="h5" sx={{ padding: 2 }}>Distribution Report</Typography>
                        </Box>



                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} sx={{ width: '20%', verticalAlign: 'top' }}>
                            <TextField id="standard-basic" placeholder="Search" variant="standard" mt={2} style={{ width: '100%' }}

                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon />
                                    ),
                                }} />
                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} sx={{ verticalAlign: 'top' }}>
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
            <UserDistributionTransactions showServiceTrans={showServiceTrans} />
        </Layout>


    );
}
export default withAuth(UserDistributionTransactionsReport);

