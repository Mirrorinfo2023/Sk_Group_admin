"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import InvestmentTransactions from "@/components/InvestMent/InvestMentReport";
import {
    Grid,
    Button,
    Typography,
    Box,
    Card,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Leaderboard,
    CheckCircle,
    HighlightOff,
    DeleteForever,
    Add,
    Refresh,
    Tune,
    TrendingUp,
    FlashOnOutlined,
    Search,
    FilterList,
} from '@mui/icons-material';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

function InvestmentReport(props) {
    const [report, setReport] = useState({});
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [allServiceTrans, setAllServiceTrans] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterColumn, setFilterColumn] = useState("all");
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    const today = dayjs();
    const [fromDate, setFromDate] = useState(today.startOf('month'));
    const [toDate, setToDate] = useState(today);

    // Calculate stats from data
    const calculateStats = (data) => {
        const total_count = data.length;
        const total_active = data.filter(item => item.status === 'approved').length;
        const total_inactive = data.filter(item => item.status === 'pending').length;
        const total_deleted = data.filter(item => item.status === 'rejected').length;

        return {
            total_count,
            total_active,
            total_inactive,
            total_deleted
        };
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await api.get("/api/70b12e5fc4d4c51474b2b32706b248af89fce45f");
                if (response.status === 200 && response.data.success) {
                    const investmentData = response.data.data || [];
                    setAllServiceTrans(investmentData);
                    setShowServiceTrans(investmentData);

                    // Calculate stats from the data
                    const calculatedReport = calculateStats(investmentData);
                    setReport(calculatedReport);
                } else {
                    setError("Failed to fetch investment data");
                }
            } catch (error) {
                console.error("Error fetching investment data:", error);
                setError(error?.response?.data?.message || error.message || "Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter and sort data based on search, filters, and sorting
    useEffect(() => {
        let filtered = allServiceTrans;

        // Apply date range filter
        if (fromDate && toDate) {
            const from = fromDate.startOf('day');
            const to = toDate.endOf('day');
            filtered = filtered.filter(item => {
                if (!item.createdAt) return true;
                const createdAt = dayjs(item.createdAt);
                return createdAt.isBetween(from, to, null, '[]');
            });
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item => {
                const searchLower = searchTerm.toLowerCase();

                if (filterColumn === "all") {
                    // Search across all columns
                    return (
                        (item.username?.toLowerCase().includes(searchLower)) ||
                        (item.mlm_id?.toLowerCase().includes(searchLower)) ||
                        (item.mobile?.includes(searchTerm)) ||
                        (item.email?.toLowerCase().includes(searchLower)) ||
                        (item.first_name?.toLowerCase().includes(searchLower)) ||
                        (item.last_name?.toLowerCase().includes(searchLower)) ||
                        (item.amount?.toString().includes(searchTerm)) ||
                        (item.remark?.toLowerCase().includes(searchLower)) ||
                        (item.utr_id?.toLowerCase().includes(searchLower)) ||
                        (item.status?.toLowerCase().includes(searchLower)) ||
                        (item.reason?.toLowerCase().includes(searchLower))
                    );
                } else {
                    // Search in specific column
                    const value = item[filterColumn]?.toString().toLowerCase() || "";
                    return value.includes(searchLower);
                }
            });
        }

        // Apply sorting
        if (sortColumn) {
            filtered.sort((a, b) => {
                let aValue = a[sortColumn];
                let bValue = b[sortColumn];

                // Handle different data types for sorting
                if (sortColumn === 'amount') {
                    aValue = parseFloat(aValue) || 0;
                    bValue = parseFloat(bValue) || 0;
                } else if (sortColumn === 'createdAt' || sortColumn === 'updatedAt') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                } else {
                    // String comparison
                    aValue = (aValue || '').toString().toLowerCase();
                    bValue = (bValue || '').toString().toLowerCase();
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setShowServiceTrans(filtered);

        // Recalculate stats for filtered data
        const filteredReport = calculateStats(filtered);
        setReport(filteredReport);
    }, [allServiceTrans, fromDate, toDate, searchTerm, filterColumn, sortColumn, sortDirection]);

    // Handle sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            // Toggle direction if same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New column, default to ascending
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setFilterColumn("all");
        setSortColumn("");
        setSortDirection("asc");
        setFromDate(today.startOf('month'));
        setToDate(today);
    };

    // Refresh data
    const handleRefresh = () => {
        window.location.reload();
    };

    // Stats configuration
    const statsCards = [
        {
            label: "Total Investments",
            value: report?.total_count ?? 0,
            color: "#667eea",
            icon: <Leaderboard sx={{ fontSize: 24 }} />,
            bgColor: "#F0F2FF"
        },
        {
            label: "Approved",
            value: report?.total_active ?? 0,
            color: "#4CAF50",
            icon: <CheckCircle sx={{ fontSize: 24 }} />,
            bgColor: "#E8F5E8"
        },
        {
            label: "Pending",
            value: report?.total_inactive ?? 0,
            color: "#FF9800",
            icon: <HighlightOff sx={{ fontSize: 24 }} />,
            bgColor: "#FFF3E0"
        },
        {
            label: "Rejected",
            value: report?.total_deleted ?? 0,
            color: "#F44336",
            icon: <DeleteForever sx={{ fontSize: 24 }} />,
            bgColor: "#FFEBEE"
        }
    ];

    const hasActiveFilters = fromDate?.startOf('month')?.valueOf() !== today.startOf('month').valueOf() ||
        toDate?.valueOf() !== today.valueOf() ||
        searchTerm ||
        filterColumn !== "all" ||
        sortColumn;

    const filteredCount = showServiceTrans.length;
    const totalCount = allServiceTrans.length;
    const isFiltered = filteredCount !== totalCount;

    // Column options for filtering
    const columnOptions = [
        { value: "all", label: "All Columns" },
        { value: "username", label: "Username" },
        { value: "mlm_id", label: "MLM ID" },
        { value: "mobile", label: "Mobile" },
        { value: "email", label: "Email" },
        { value: "first_name", label: "First Name" },
        { value: "last_name", label: "Last Name" },
        { value: "amount", label: "Amount" },
        { value: "remark", label: "Remark" },
        { value: "utr_id", label: "UTR ID" },
        { value: "status", label: "Status" },
        { value: "reason", label: "Rejected Reason" }
    ];

    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 4
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}>
                            Investment Portfolio
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <IconButton
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                backgroundColor: showFilters ? 'primary.main' : 'grey.100',
                                color: showFilters ? 'white' : 'grey.700',
                                '&:hover': {
                                    backgroundColor: showFilters ? 'primary.dark' : 'grey.200'
                                }
                            }}
                        >
                            <Tune />
                        </IconButton>

                        <IconButton
                            onClick={handleRefresh}
                            disabled={loading}
                            sx={{
                                backgroundColor: 'grey.100',
                                color: 'grey.700',
                                '&:hover': { backgroundColor: 'grey.200' },
                                '&:disabled': { opacity: 0.5 }
                            }}
                        >
                            <Refresh />
                        </IconButton>

                        <Button
                            variant="contained"
                            href="/add-new-prime/"
                            startIcon={<Add />}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 3,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                fontSize: '1rem',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                }
                            }}
                        >
                            New Investment
                        </Button>
                    </Box>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: 2 }}
                        action={
                            <IconButton size="small" onClick={() => setError("")}>
                                <HighlightOff fontSize="small" />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}

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


                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    {/* Search Box */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            placeholder="Search investments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                            size="medium"
                        />
                    </Grid>

                    {/* Column Filter */}
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="medium">
                            <InputLabel>Search In</InputLabel>
                            <Select
                                value={filterColumn}
                                label="Search In"
                                onChange={(e) => setFilterColumn(e.target.value)}
                            >
                                {columnOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Sort By */}
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="medium">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortColumn}
                                label="Sort By"
                                onChange={(e) => setSortColumn(e.target.value)}
                            >
                                <MenuItem value="">No Sorting</MenuItem>
                                {columnOptions.slice(1).map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label} {sortColumn === option.value && `(${sortDirection})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* From Date */}
                    <Grid item xs={6} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From"
                                value={fromDate}
                                onChange={setFromDate}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: { size: "medium", fullWidth: true }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* To Date */}
                    <Grid item xs={6} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="To"
                                value={toDate}
                                onChange={setToDate}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: { size: "medium", fullWidth: true }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Reset Button */}
                    <Grid item xs={12} md={1}>
                        <Button
                            fullWidth
                            onClick={handleResetFilters}
                            variant="outlined"
                            sx={{ height: '56px', fontWeight: 600 }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>

                {/* Results Summary */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    p: 3,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'grey.700' }}>
                        {isFiltered ? (
                            <>
                                Displaying <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> investment records
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontWeight: 700,
                                        '&:hover': { color: 'primary.dark' }
                                    }}
                                    onClick={handleResetFilters}
                                >
                                    (Show all)
                                </Box>
                            </>
                        ) : (
                            <>
                                Showing all <strong>{totalCount}</strong> investment records
                            </>
                        )}
                    </Typography>

                    {loading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 600 }}>
                                Updating...
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Table Section */}
                <InvestmentTransactions
                    showServiceTrans={showServiceTrans}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(InvestmentReport);