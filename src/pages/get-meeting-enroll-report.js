"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import MeetingDetailsTransactions from "@/components/Meeting/MeetingDetailsReport";
import {
    Grid,
    Button,
    Paper,
    Typography,
    Box,
    TextField,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

function MeetingDetailsReport(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [reportStats, setReportStats] = useState({});
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());

    // Calculate report statistics
    useEffect(() => {
        if (showServiceTrans && showServiceTrans.length > 0) {
            const stats = {
                totalEnrollments: showServiceTrans.length,
                activeEnrollments: showServiceTrans.filter(item => item.status === 'active' || item.is_active).length,
                pendingEnrollments: showServiceTrans.filter(item => item.status === 'pending').length,
                cancelledEnrollments: showServiceTrans.filter(item => item.status === 'cancelled' || item.is_cancelled).length
            };
            setReportStats(stats);
        }
    }, [showServiceTrans]);

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (showServiceTrans && showServiceTrans.length > 0) {
            const filtered = showServiceTrans.filter(item =>
                item.name?.toLowerCase().includes(text.toLowerCase()) ||
                item.description?.toLowerCase().includes(text.toLowerCase()) ||
                item.first_name?.toLowerCase().includes(text.toLowerCase()) ||
                item.last_name?.toLowerCase().includes(text.toLowerCase()) ||
                item.mlm_id?.toLowerCase().includes(text.toLowerCase()) ||
                item.mobile?.toLowerCase().includes(text.toLowerCase()) ||
                item.email?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleGenerateReport = async (filters = {}) => {
        const reqData = {
            from_date: fromDate.toISOString().split('T')[0],
            to_date: toDate.toISOString().split('T')[0],
            searchTerm,
            status: selectedStatus,
            ...filters
        };

        try {
            // 🔒 Encrypt before sending
            const encryptedData = DataEncrypt(JSON.stringify(reqData));
            //console.log(🔒 Sending Encrypted Data:", encryptedData);

            const response = await api.post(
                "/api/meeting/3bacf58678791b87d5e04e8b23d36b55107c2e08",
                { data: encryptedData }
            );
            //console.log(✅ Response:", response);

            // 🔓 Decrypt response from backend
            const decrypted = DataDecrypt(response.data.data);
            //console.log(✅ Decrypted Response:", decrypted);

            if (decrypted.status === 200) {
                setShowServiceTrans(decrypted.data || []);
                setFilteredData(decrypted.data || []);
            } else {
                dispatch(callAlert({ message: decrypted.message || "Failed", type: "FAILED" }));
            }
        } catch (error) {
            console.error("❌ Error:", error);
            if (error?.response?.data?.error) {
                dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
            } else {
                dispatch(callAlert({ message: error.message, type: 'FAILED' }))
            }
        }
    };

    // Load initial data with encryption
    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };

            try {
                // 🔒 Encrypt before sending
                const encryptedData = DataEncrypt(JSON.stringify(reqData));
                //console.log(🔒 Sending Encrypted Data:", encryptedData);

                const response = await api.post(
                    "/api/meeting/3bacf58678791b87d5e04e8b23d36b55107c2e08",
                    { data: encryptedData }
                );

                // 🔓 Decrypt response from backend
                const decrypted = DataDecrypt(response.data.data);
                //console.log(✅ Decrypted Response:", decrypted);

                if (decrypted.status === 200) {
                    setShowServiceTrans(decrypted.data || []);
                    setFilteredData(decrypted.data || []);
                } else {
                    dispatch(callAlert({ message: decrypted.message || "Failed", type: "FAILED" }));
                }
            } catch (error) {
                console.error("❌ Error:", error);
                dispatch(
                    callAlert({
                        message: error?.response?.data?.error || error.message,
                        type: "FAILED",
                    })
                );
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

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleApplyFilters = () => {
        handleGenerateReport();
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setFromDate(dayjs().startOf("month"));
        setToDate(dayjs());
        handleGenerateReport();
        setShowFilters(false);
    };

    // Quick date filters
    const handleQuickFilter = (days) => {
        setFromDate(dayjs().subtract(days, 'day'));
        setToDate(dayjs());
    };

    // Compact Stats Cards
    const cards = [
        {
            label: "Total Enrollments",
            value: reportStats.totalEnrollments ?? 0,
            color: "#2196F3",
            icon: <PeopleIcon sx={{ fontSize: 20 }} />,
            bgColor: "#E3F2FD"
        },
        {
            label: "Active",
            value: reportStats.activeEnrollments ?? 0,
            color: "#4CAF50",
            icon: <EventAvailableIcon sx={{ fontSize: 20 }} />,
            bgColor: "#E8F5E8"
        },
        {
            label: "Pending",
            value: reportStats.pendingEnrollments ?? 0,
            color: "#FF9800",
            icon: <PendingActionsIcon sx={{ fontSize: 20 }} />,
            bgColor: "#FFF3E0"
        },
        {
            label: "Cancelled",
            value: reportStats.cancelledEnrollments ?? 0,
            color: "#F44336",
            icon: <CancelIcon sx={{ fontSize: 20 }} />,
            bgColor: "#FFEBEE"
        }
    ];

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Header with Title and Actions */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: "bold",
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '18px'
                    }}>
                        Meeting Enrollment Report
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Quick Date Filters */}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[{ label: '1D', days: 1 }, { label: '7D', days: 7 }, { label: '30D', days: 30 }].map((item) => (
                                <Button
                                    key={item.days}
                                    size="small"
                                    onClick={() => handleQuickFilter(item.days)}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 1,
                                        py: 0.5,
                                        fontSize: '0.7rem',
                                        backgroundColor: '#f5f5f5',
                                        color: '#666',
                                        '&:hover': { backgroundColor: '#e0e0e0' }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        <IconButton
                            size="small"
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                backgroundColor: showFilters ? '#2196f3' : '#f5f5f5',
                                color: showFilters ? 'white' : 'inherit',
                                '&:hover': {
                                    backgroundColor: showFilters ? '#1976d2' : '#e0e0e0'
                                }
                            }}
                        >
                            <TuneIcon sx={{ fontSize: 18 }} />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={handleResetFilters}
                            sx={{
                                backgroundColor: '#f5f5f5',
                                '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Compact Stats Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                backgroundColor: card.bgColor,
                                borderLeft: `4px solid ${card.color}`,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${card.color}40`,
                                    backgroundColor: card.color,
                                    '& .card-label': {
                                        color: '#fff !important',
                                    },
                                    '& .card-value': {
                                        color: '#fff !important',
                                    },
                                    '& .card-icon': {
                                        color: '#fff !important',
                                    }
                                }
                            }}>
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                    <Typography className="card-label" variant="subtitle2" sx={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#666',
                                        mb: 0.5,
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {card.label}
                                    </Typography>
                                    <Typography className="card-value" sx={{
                                        color: '#000',
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="card-icon" sx={{
                                    color: card.color,
                                    transition: 'color 0.3s ease'
                                }}>
                                    {card.icon}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Filters Section */}
                {showFilters && (
                    <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flexWrap: 'wrap'
                        }}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search name, mobile, email..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                                }}
                                sx={{
                                    width: "200px",
                                    '& .MuiOutlinedInput-root': {
                                        height: '36px',
                                        fontSize: '0.8rem',
                                    }
                                }}
                            />

                            {/* Status Filter */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Status"
                                    onChange={handleStatusChange}
                                    sx={{ height: '36px', fontSize: '0.8rem' }}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Date Range */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <DatePicker
                                        value={fromDate}
                                        format="DD/MM/YY"
                                        onChange={handleFromDateChange}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                placeholder: "From",
                                                sx: {
                                                    width: 110,
                                                    '& .MuiInputBase-root': {
                                                        height: 36,
                                                        fontSize: '0.8rem'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                                        to
                                    </Typography>
                                    <DatePicker
                                        value={toDate}
                                        format="DD/MM/YY"
                                        onChange={handleToDateChange}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                placeholder: "To",
                                                sx: {
                                                    width: 110,
                                                    '& .MuiInputBase-root': {
                                                        height: 36,
                                                        fontSize: '0.8rem'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </LocalizationProvider>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <button
                                    onClick={handleApplyFilters}
                                    style={{
                                        backgroundColor: '#2196f3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        height: '36px',
                                        minWidth: '80px'
                                    }}
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        color: '#666',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        height: '36px',
                                        minWidth: '80px'
                                    }}
                                >
                                    Reset
                                </button>
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Table Section */}
            </Box>
            <MeetingDetailsTransactions showServiceTrans={searchTerm ? filteredData : showServiceTrans} />
        </Layout>
    );
}

export default withAuth(MeetingDetailsReport);