"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import CrmTransactions from "@/components/CRM/CrmReport";
import {
    Grid,
    Button,
    Typography,
    Box,
    TextField,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Search,
    Refresh,
    Tune,
    Add,
    Leaderboard,
    CheckCircle,
    HighlightOff,
    DeleteForever,
    Link as LinkIcon,
} from '@mui/icons-material';

function CrmReport(props) {
    const [report, setReport] = useState(null);
    const [allData, setAllData] = useState([]);
    const [showCrmLinks, setShowCrmLinks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    // Update hasActiveFilters whenever filter states change
    useEffect(() => {
        const activeFilters = Boolean(
            searchTerm ||
            selectedStatus ||
            !fromDate.isSame(dayjs().startOf('month'), 'day') ||
            !toDate.isSame(dayjs(), 'day')
        );
        setHasActiveFilters(activeFilters);
    }, [searchTerm, selectedStatus, fromDate, toDate]);

    // Fetch all CRM data
    const fetchAllCrmLinks = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const reqData = {
                from_date: dayjs().startOf('year').format('YYYY-MM-DD'),
                to_date: dayjs().format('YYYY-MM-DD'),
                searchTerm: "",
                status: ""
            };

            const encryptedReqData = DataEncrypt(JSON.stringify(reqData));
            const response = await api.post("/api/admin/8b9f9e2d91d3a0c12fa77b0c9aabf321dcab9871", { data: encryptedReqData });

            if (response.data?.data) {
                const decryptedResponse = DataDecrypt(response.data.data);

                if (decryptedResponse.status === 200) {
                    setAllData(decryptedResponse.data || []);
                    setReport(decryptedResponse.report);

                    // Apply current filters on the freshly fetched data
                    applyFiltersOnData(decryptedResponse.data || [], {
                        searchTerm,
                        selectedStatus,
                        fromDate,
                        toDate,
                    });
                } else {
                    setError(decryptedResponse.message || "Failed to fetch CRM links");
                    setAllData([]);
                    setShowCrmLinks([]);
                }
            } else {
                setError("Failed to fetch CRM links");
                setAllData([]);
                setShowCrmLinks([]);
            }
        } catch (err) {
            console.error("Error fetching CRM links:", err);
            const errorMessage = err?.response?.data?.error || err.message || "Network error";
            setError(errorMessage);
            dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
            setAllData([]);
            setShowCrmLinks([]);
        } finally {
            setLoading(false);
        }
    }, [dispatch, fromDate, toDate, searchTerm, selectedStatus]);

    // Auto-fetch on component mount
    useEffect(() => {
        fetchAllCrmLinks();
    }, []);

    // Status string to value converter
    const statusStringToValue = (status) => {
        if (!status) return null;
        if (status === 'active') return 1;
        if (status === 'inactive') return 2;
        const n = Number(status);
        return Number.isNaN(n) ? null : n;
    };

    // Core client-side filtering function
    const applyFiltersOnData = (data = allData, opts = {}) => {
        const {
            searchTerm: sTerm = searchTerm,
            selectedStatus: sStatus = selectedStatus,
            fromDate: fDate = fromDate,
            toDate: tDate = toDate,
        } = opts;

        let filtered = Array.isArray(data) ? [...data] : [];

        // Search - match crm_name and link
        if (sTerm && sTerm.trim() !== "") {
            const q = sTerm.trim().toLowerCase();
            filtered = filtered.filter(item => {
                const crmName = (item.crm_name || "").toString().toLowerCase();
                const link = (item.link || "").toString().toLowerCase();
                const idStr = (item.id || "").toString().toLowerCase();
                return crmName.includes(q) || link.includes(q) || idStr.includes(q);
            });
        }

        // Status filter
        const statusVal = statusStringToValue(sStatus);
        if (statusVal !== null) {
            filtered = filtered.filter(item => Number(item.status) === statusVal);
        }

        // Date range filter
        if (fDate) {
            const start = dayjs(fDate).startOf('day');
            filtered = filtered.filter(item => {
                const created = dayjs(item.created_on);
                return created.isValid() ? created.isSame(start) || created.isAfter(start) : false;
            });
        }
        if (tDate) {
            const end = dayjs(tDate).endOf('day');
            filtered = filtered.filter(item => {
                const created = dayjs(item.created_on);
                return created.isValid() ? created.isSame(end) || created.isBefore(end) : false;
            });
        }

        setShowCrmLinks(filtered);
    };

    // When user clicks Apply - run client-side filter
    const handleApplyFilters = () => {
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            fromDate,
            toDate
        });
    };

    // Reset filters locally
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setFromDate(dayjs().startOf("month"));
        setToDate(dayjs());

        applyFiltersOnData(allData, {
            searchTerm: "",
            selectedStatus: "",
            fromDate: dayjs().startOf("month"),
            toDate: dayjs()
        });
    };

    // Handle Enter key in search field
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApplyFilters();
        }
    };

    // Refresh data
    const handleRefresh = () => {
        fetchAllCrmLinks();
    };

    // Stats configuration
    const statsCards = [
        {
            label: "Total CRM Links",
            value: report?.total_count ?? allData.length ?? 0,
            color: "#FF6B35",
            icon: <Leaderboard sx={{ fontSize: 24 }} />,
            bgColor: "#FFF2ED"
        },
        {
            label: "Active",
            value: report?.total_active ?? allData.filter(r => Number(r.status) === 1).length ?? 0,
            color: "#00C853",
            icon: <CheckCircle sx={{ fontSize: 24 }} />,
            bgColor: "#F0FFF4"
        },
        {
            label: "Inactive",
            value: report?.total_inactive ?? allData.filter(r => Number(r.status) === 2).length ?? 0,
            color: "#5C6BC0",
            icon: <HighlightOff sx={{ fontSize: 24 }} />,
            bgColor: "#F0F2FF"
        },
        {
            label: "Deleted",
            value: report?.total_deleted ?? allData.filter(r => Number(r.status) === 0).length ?? 0,
            color: "#EC407A",
            icon: <DeleteForever sx={{ fontSize: 24 }} />,
            bgColor: "#FFF0F5"
        }
    ];

    // Chip delete handlers
    const removeSearchChip = () => {
        setSearchTerm('');
        applyFiltersOnData(allData, {
            searchTerm: '',
            selectedStatus,
            fromDate,
            toDate
        });
    };

    const removeStatusChip = () => {
        setSelectedStatus('');
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus: '',
            fromDate,
            toDate
        });
    };

    const removeFromDateChip = () => {
        setFromDate(dayjs().startOf('month'));
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            fromDate: dayjs().startOf('month'),
            toDate
        });
    };

    const removeToDateChip = () => {
        setToDate(dayjs());
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            fromDate,
            toDate: dayjs()
        });
    };

    return (
        <Layout>
            <Box sx={{ p: 2 }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        CRM Links Report
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton
                            size="small"
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                bgcolor: showFilters ? 'primary.main' : 'grey.100',
                                color: showFilters ? 'white' : 'grey.700',
                                '&:hover': {
                                    bgcolor: showFilters ? 'primary.dark' : 'grey.200'
                                }
                            }}
                        >
                            <Tune fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={handleRefresh}
                            disabled={loading}
                            sx={{
                                bgcolor: 'grey.100',
                                color: 'grey.700',
                                '&:hover': { bgcolor: 'grey.200' },
                                '&:disabled': { opacity: 0.5 }
                            }}
                        >
                            {loading ? <CircularProgress size={20} /> : <Refresh fontSize="small" />}
                        </IconButton>

                        <Button
                            variant="contained"
                            href="/add-new-crm/"
                            startIcon={<Add />}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 2,
                                py: 1,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                }
                            }}
                        >
                            Add CRM Link
                        </Button>
                    </Box>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {statsCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                p: 2,
                                backgroundColor: card.bgColor,
                                borderLeft: `4px solid ${card.color}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 24px ${card.color}20`,
                                    backgroundColor: card.color,
                                    '& .stat-text': {
                                        color: 'white !important',
                                    },
                                    '& .stat-icon': {
                                        color: 'white !important',
                                    }
                                }
                            }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography className="stat-text" variant="subtitle2" sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#666',
                                        mb: 0.5,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {card.label}
                                    </Typography>
                                    <Typography className="stat-text" sx={{
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        color: '#000',
                                        lineHeight: 1.1
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="stat-icon" sx={{ color: card.color, ml: 1 }}>
                                    {card.icon}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Filters Section */}
                {showFilters && (
                    <Card sx={{ p: 3, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Filter CRM Links
                        </Typography>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search CRM name or link..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
                                }}
                                sx={{
                                    minWidth: 250,
                                    '& .MuiOutlinedInput-root': {
                                        height: 40,
                                    }
                                }}
                                size="small"
                            />

                            {/* Status Filter */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Status"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    sx={{ height: '40px' }}
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Date Range */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(d) => setFromDate(d || dayjs().startOf('month'))}
                                        format="DD/MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                label: "From Date",
                                                sx: { width: 140 }
                                            }
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: 'grey.600', mx: 1 }}>
                                        to
                                    </Typography>
                                    <DatePicker
                                        value={toDate}
                                        onChange={(d) => setToDate(d || dayjs())}
                                        format="DD/MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                label: "To Date",
                                                sx: { width: 140 }
                                            }
                                        }}
                                    />
                                </Box>
                            </LocalizationProvider>

                            {/* Action Buttons */}
                            <Button
                                variant="contained"
                                onClick={handleApplyFilters}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    height: 40
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Apply'}
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    variant="outlined"
                                    onClick={handleResetFilters}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        px: 2,
                                        py: 1,
                                        height: 40
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </Box>

                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {searchTerm && (
                                    <Chip
                                        label={`Search: ${searchTerm}`}
                                        size="small"
                                        onDelete={removeSearchChip}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                                {selectedStatus && (
                                    <Chip
                                        label={`Status: ${selectedStatus}`}
                                        size="small"
                                        onDelete={removeStatusChip}
                                        color="secondary"
                                        variant="outlined"
                                    />
                                )}
                                {!fromDate.isSame(dayjs().startOf('month'), 'day') && (
                                    <Chip
                                        label={`From: ${fromDate.format('DD/MM/YY')}`}
                                        size="small"
                                        onDelete={removeFromDateChip}
                                        color="warning"
                                        variant="outlined"
                                    />
                                )}
                                {!toDate.isSame(dayjs(), 'day') && (
                                    <Chip
                                        label={`To: ${toDate.format('DD/MM/YY')}`}
                                        size="small"
                                        onDelete={removeToDateChip}
                                        color="warning"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        )}
                    </Card>
                )}

                {/* Results Summary */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 1
                }}>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 600 }}>
                        {`Showing ${showCrmLinks.length} CRM links${hasActiveFilters ? ' (filtered)' : ''}${loading ? ' (Loading...)' : ''}`}
                    </Typography>

                    {hasActiveFilters && (
                        <Button
                            size="small"
                            onClick={handleResetFilters}
                            disabled={loading}
                            startIcon={<Refresh />}
                            sx={{ fontSize: '0.75rem' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>

                {/* Table Section */}
                <CrmTransactions
                    showCrmLinks={showCrmLinks}
                    loading={loading}
                    onRefresh={fetchAllCrmLinks}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(CrmReport);