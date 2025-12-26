"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import InvestmentTransactions from "@/components/InvestMent/InvestMentReport";
import { Grid, Button, Paper, Typography, Box } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const StatCard = styled(Paper)(({ bgcolor }) => ({
    background: bgcolor,
    color: '#fff',
    borderRadius: 12,
    padding: '28px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 280,
    minHeight: 100,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 24,
}));

const StatContent = styled('div')({
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

const StatValue = styled('div')({
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 4,
});

const StatLabel = styled('div')({
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.85,
    letterSpacing: 1,
    textTransform: 'uppercase',
});

const StatIcon = styled('div')({
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.18,
    fontSize: 64,
    zIndex: 1,
});

const FilterRow = styled(Box)(({ theme }) => ({
    background: '#f5faff',
    borderRadius: 12,
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
}));

const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
    return formattedDateTime;
};

function InvestReportPage(props) {
    const [report, setReport] = useState(null);
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const today = dayjs();
    const [fromDate, setFromDate] = React.useState(today);
    const [toDate, setToDate] = React.useState(today);

    useEffect(() => {
        generateReport();
    }, []);

    const generateReport = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0]
        }

        try {
            const response = await api.post("/api/refferal-report/prime-users-report", reqData);

            if (response.status === 200) {
                setShowServiceTrans(response.data.data || []);
                setReport(response.data.report || {});
            }
        } catch (error) {
            if (error?.response?.data?.error) {
                dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
            } else {
                dispatch(callAlert({ message: error.message, type: 'FAILED' }))
            }
        }
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    return (
        <Layout>
            <Grid container spacing={3} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent:"center", gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <StatCard bgcolor="#FFC107">
                            <StatContent>
                                <StatValue>{report ? report.total_count : 0}</StatValue>
                                <StatLabel>Total Count</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <LeaderboardIcon sx={{ fontSize: 64, color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                        <StatCard bgcolor="#5C6BC0">
                            <StatContent>
                                <StatValue>{report ? report.total_active : 0}</StatValue>
                                <StatLabel>Active Count</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <CheckCircleIcon sx={{ fontSize: 64, color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                        <StatCard bgcolor="#26A69A">
                            <StatContent>
                                <StatValue>{report ? report.total_inactive : 0}</StatValue>
                                <StatLabel>Inactive Count</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <HighlightOffIcon sx={{ fontSize: 64, color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                        <StatCard bgcolor="#EC407A">
                            <StatContent>
                                <StatValue>{report ? report.total_deleted : 0}</StatValue>
                                <StatLabel>Deleted Count</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <DeleteForeverIcon sx={{ fontSize: 64, color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <FilterRow>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} style={{ width: '60%', verticalAlign: 'center' }} >
                            <Typography variant="h5" sx={{ padding: 2 }}>Invest Report</Typography>
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From Date"
                                value={fromDate}
                                sx={{ minWidth: 140, maxWidth:170, background: '#fff', borderRadius: 1 }}
                                format="DD-MM-YYYY"
                                onChange={handleFromDateChange}
                            />
                            <DatePicker
                                label="To Date"
                                value={toDate}
                                sx={{ minWidth: 140, maxWidth:170, background: '#fff', borderRadius: 1 }}
                                format="DD-MM-YYYY"
                                onChange={handleToDateChange}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            onClick={generateReport}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 16,
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Generate Report
                        </Button>
                    </FilterRow>
                </Grid>
            </Grid>
            <InvestmentTransactions showServiceTrans={showServiceTrans} />
        </Layout>
    );
}
export default withAuth(InvestReportPage); 