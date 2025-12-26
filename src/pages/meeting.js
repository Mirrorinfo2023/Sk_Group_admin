"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import MeetingTransactions from "@/components/Meeting/MeetingReport";
import { Grid, Button, TableContainer, Paper, Typography, Divider, Box, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';



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



function MeetingReport(props) {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (text) => {
        setSearchTerm(text);
    };
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));

    // Expose getTnx for Generate Report button
    const getTnx = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0],
        }

        try {
            const response = await api.post("/api/meeting/get-meeting-list", reqData);
            if (response.status === 200) {
                setShowServiceTrans(response.data.data || [])
            }
        } catch (error) {
            if (error?.response?.data?.error) {
                dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
            } else {
                dispatch(callAlert({ message: error.message, type: 'FAILED' }))
            }
        }
    }

    useEffect(() => {
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

    return (

        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item={true} xs={12}>
                    <TableContainer component={Paper}>
                        {/* First Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
                            <Typography variant="h5" whiteSpace={"nowrap"}>
                                Meeting
                            </Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    style={{
                                        background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        padding: '8px 24px'
                                    }}
                                    href={`/add-new-meeting/`}
                                >
                                    Add New
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DownloadIcon />}
                                    style={{ marginLeft: 16 }}
                                    onClick={getTnx}
                                >
                                    Generate Report
                                </Button>
                            </Box>
                        </Box>
                        {/* Second Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                            <Box sx={{ width: "30%" }}>
                                <TextField
                                    id="standard-basic"
                                    placeholder="Search"
                                    variant="standard"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon />,
                                    }}
                                />
                            </Box>
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <DatePicker
                                            label="From Date"
                                            value={fromDate}
                                            sx={{ padding: 0, lineHeight: 15 }}
                                            format="DD-MM-YYYY"
                                            onChange={handleFromDateChange}
                                        />
                                        <DatePicker
                                            label="To Date"
                                            value={toDate}
                                            sx={{ padding: 0, lineHeight: 15 }}
                                            format="DD-MM-YYYY"
                                            onChange={handleToDateChange}
                                        />
                                    </div>
                                </LocalizationProvider>
                            </Box>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>
            <MeetingTransactions showServiceTrans={showServiceTrans} searchTerm={searchTerm} />
        </Layout>

    );
}
export default withAuth(MeetingReport);

