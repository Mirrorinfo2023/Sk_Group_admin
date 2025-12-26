"use client"
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import { DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import {
    Grid,
    Button,
    Paper,
    Typography,
    Box,
    Card,
    TextField,
    MenuItem,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Backdrop,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import * as XLSX from 'xlsx';

// Compact Stat Card Style
const StatCard = styled(Card)({
    background: '#f5f5f5',
    borderRadius: 12,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});

const StatContent = styled('div')({
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

const StatValue = styled('div')({
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 4,
});

const StatLabel = styled('div')({
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.9,
});

// Compact Filter Section
const FilterSection = styled(Paper)({
    borderRadius: 12,
    padding: '16px',
    marginBottom: 16,
    backgroundColor: '#1976d2',
    color: 'white',
});

const FilterRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: 8,
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white',
        fontSize: '0.875rem',
    },
    '& .MuiInputBase-input': {
        fontSize: '0.875rem',
        padding: '8px 12px',
    },
});

const CompactButton = styled(Button)({
    minWidth: 'auto',
    padding: '6px 12px',
    fontSize: '0.75rem',
    borderRadius: 8,
});

// Advanced Search Dialog
const AdvancedSearchDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        maxWidth: 800,
    },
});

// Loading Skeleton Components
const StatSkeleton = styled(Skeleton)({
    borderRadius: 12,
    height: 80,
});

const FilterSkeleton = styled(Skeleton)({
    borderRadius: 12,
    height: 60,
    marginBottom: 16,
});

// Styled Table Components
const StyledTableContainer = styled(TableContainer)({
    background: 'white',
    borderRadius: 8,
    border: `1px solid #e0e0e0`,
    marginBottom: 16,
});

const StyledTableHeaderCell = styled(TableCell)({
    fontWeight: '600',
    fontSize: '12px',
    padding: '12px 8px',
    color: 'white',
    borderRight: `1px solid rgba(255,255,255,0.2)`,
    whiteSpace: "nowrap"
});

const StyledTableCell = styled(TableCell)({
    padding: '10px 8px',
    borderRight: `1px solid #e0e0e0`,
    fontSize: '12px',
    color: '#000000',
    whiteSpace: "nowrap"
});

const StyledTableRow = styled(TableRow)({
    '&:nth-of-type(even)': {
        backgroundColor: '#fafafa',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

// Status chips
const StatusChip = styled(Chip)({
    fontWeight: 500,
    fontSize: '10px',
    height: '20px',
});

const ActiveChip = styled(StatusChip)({
    backgroundColor: '#4caf50',
    color: 'white',
});

const InactiveChip = styled(StatusChip)({
    backgroundColor: '#f44336',
    color: 'white',
});

// Date Range Component - Compact version
const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange, onGenerateReport }) => {
    const today = new Date();

    return (
        <Paper sx={{
            p: 2,
            mb: 2,
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap'
            }}>
                <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 600 }}>
                    Date Range:
                </Typography>
                <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{
                        width: '150px',
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 1,
                        },
                    }}
                    inputProps={{
                        max: endDate || today.toISOString().split('T')[0],
                    }}
                />
                <Typography sx={{ color: '#666' }}>to</Typography>
                <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{
                        width: '150px',
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 1,
                        },
                    }}
                    inputProps={{
                        min: startDate,
                        max: today.toISOString().split('T')[0],
                    }}
                />
                <Button
                    variant="contained"
                    onClick={onGenerateReport}
                    disabled={!startDate || !endDate}
                    size="small"
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                        '&:disabled': {
                            backgroundColor: '#e0e0e0',
                            color: '#9e9e9e'
                        }
                    }}
                >
                    Generate Report
                </Button>
            </Box>
        </Paper>
    );
};

// Function to get cycle slab based on day
const getCycleSlab = (day) => {
    if (!day) return '-';

    const dayNum = parseInt(day);
    if (isNaN(dayNum)) return `Day ${day}`;

    if (dayNum >= 1 && dayNum <= 4) return 'slab3 (25th - 4th)';
    if (dayNum >= 5 && dayNum <= 14) return 'slab1 (5th - 14th)';
    if (dayNum >= 15 && dayNum <= 24) return 'slab2 (15th - 24th)';
    if (dayNum >= 25 && dayNum <= 31) return 'slab3 (25th - 4th)';

    return `Day ${day}`;
};

function ReturnReport(props) {
    const [report, setReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [stats, setStats] = useState({
        total_count: 0,
        total_investment: 0,
        total_return: 0,
        active_count: 0
    });

    // Loading states
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Date states
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return firstDayOfMonth.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    // Compact filters
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        plan: 'all',
        payoutCycle: 'all'
    });

    // Advanced filters
    const [advancedFilters, setAdvancedFilters] = useState({
        minInvestment: '',
        maxInvestment: '',
        minReturn: '',
        maxReturn: '',
        accountNumber: '',
        ifscCode: '',
    });

    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState({
        username: true,
        account_number: true,
        ifsc_code: true,
        status: true,
        plan: true,
        payout_cycle: true,
        total_investment_amount: true,
        return_amount: true,
        investment_created_date: true
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const dispatch = useDispatch();

    const uniquePlans = useMemo(() => {
        const plans = report.map(item => item.plan).filter(Boolean);
        return [...new Set(plans)];
    }, [report]);

    const uniquePayoutCycles = useMemo(() => {
        const cycles = report.map(item => {
            const day = item.payout_cycle;
            return getCycleSlab(day);
        }).filter(Boolean);
        return [...new Set(cycles)].sort();
    }, [report]);

    useEffect(() => {
        if (startDate && endDate) {
            generateReport();
        }
    }, []);

    useEffect(() => {
        applyFilters();
    }, [report, filters, advancedFilters]);

    const generateReport = async (isRefresh = false) => {
        if (!startDate || !endDate) {
            dispatch(callAlert({ message: 'Please select both start and end dates', type: 'FAILED' }));
            return;
        }

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const from_date = startDate;
            const to_date = endDate;

            console.log("Request Data (Plain):", from_date, to_date);

            const response = await api.post("/api/users/get-return-report");

            console.log("API Response:", response.data);

            // Decrypt response
            if (!response.data.data) {
                throw new Error("No data in response");
            }

            const decryptedString = (response.data.data);
            console.log("Decrypted String:", decryptedString);

            let decrypted;
            try {
                decrypted = (decryptedString);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                // If it's already an object, use it directly
                if (typeof decryptedString === 'object') {
                    decrypted = decryptedString;
                } else {
                    throw new Error("Failed to parse response data");
                }
            }

            console.log("Decrypted Response:", decrypted);

            if (decrypted) {
                const reportData = decrypted || [];
                console.log("reportData", reportData);
                setReport(reportData);

                // Calculate stats
                const totalInvestment = reportData.reduce((sum, item) => {
                    return sum + parseFloat(item.total_investment_amount || 0);
                }, 0);

                const totalReturn = reportData.reduce((sum, item) => {
                    return sum + parseFloat(item.return_amount || 0);
                }, 0);

                const activeCount = reportData.filter(item => item.status === "Active").length;

                setStats({
                    total_count: decrypted.count || reportData.length,
                    total_investment: totalInvestment,
                    total_return: totalReturn,
                    active_count: activeCount
                });

                if (reportData.length === 0) {
                    dispatch(callAlert({
                        message: 'No data found for the selected date range',
                        type: 'WARNING'
                    }));
                } else {
                    dispatch(callAlert({
                        message: `Successfully loaded ${reportData.length} records`,
                        type: 'SUCCESS'
                    }));
                }
            } else {
                dispatch(callAlert({
                    message: decrypted.message || 'Failed to fetch report',
                    type: 'FAILED'
                }));
            }

        } catch (error) {
            console.error('Error generating report:', error);

            // Handle specific encryption/decryption errors
            if (error.message.includes("encryption") || error.message.includes("decryption")) {
                dispatch(callAlert({
                    message: 'Encryption/Decryption error. Please check your encryption keys.',
                    type: 'FAILED'
                }));
            } else if (error?.response?.data?.error) {
                // Check if response data is encrypted
                if (error.response.data.data) {
                    try {
                        const decryptedError = DataDecrypt(error.response.data.data);
                        const parsedError = JSON.parse(decryptedError);
                        dispatch(callAlert({
                            message: parsedError.message || parsedError.error || 'API Error',
                            type: 'FAILED'
                        }));
                    } catch (decryptError) {
                        dispatch(callAlert({
                            message: error.response.data.error,
                            type: 'FAILED'
                        }));
                    }
                } else {
                    dispatch(callAlert({
                        message: error.response.data.error,
                        type: 'FAILED'
                    }));
                }
            } else if (error.message) {
                dispatch(callAlert({
                    message: error.message,
                    type: 'FAILED'
                }));
            } else {
                dispatch(callAlert({
                    message: 'Network error. Please try again.',
                    type: 'FAILED'
                }));
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...report];

        // Basic search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.username?.toLowerCase().includes(searchLower) ||
                item.account_number?.toLowerCase().includes(searchLower) ||
                item.ifsc_code?.toLowerCase().includes(searchLower) ||
                item.plan?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === filters.status);
        }

        // Plan filter
        if (filters.plan !== 'all') {
            filtered = filtered.filter(item => item.plan === filters.plan);
        }

        // Payout cycle filter - now using slabs
        if (filters.payoutCycle !== 'all') {
            filtered = filtered.filter(item => {
                const slab = getCycleSlab(item.payout_cycle);
                return slab === filters.payoutCycle;
            });
        }

        // Advanced filters
        if (advancedFilters.minInvestment) {
            filtered = filtered.filter(item =>
                parseFloat(item.total_investment_amount || 0) >= parseFloat(advancedFilters.minInvestment)
            );
        }
        if (advancedFilters.maxInvestment) {
            filtered = filtered.filter(item =>
                parseFloat(item.total_investment_amount || 0) <= parseFloat(advancedFilters.maxInvestment)
            );
        }

        if (advancedFilters.minReturn) {
            filtered = filtered.filter(item =>
                parseFloat(item.return_amount || 0) >= parseFloat(advancedFilters.minReturn)
            );
        }
        if (advancedFilters.maxReturn) {
            filtered = filtered.filter(item =>
                parseFloat(item.return_amount || 0) <= parseFloat(advancedFilters.maxReturn)
            );
        }

        if (advancedFilters.accountNumber) {
            filtered = filtered.filter(item =>
                item.account_number?.toLowerCase().includes(advancedFilters.accountNumber.toLowerCase())
            );
        }

        if (advancedFilters.ifscCode) {
            filtered = filtered.filter(item =>
                item.ifsc_code?.toLowerCase().includes(advancedFilters.ifscCode.toLowerCase())
            );
        }

        setFilteredReport(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAdvancedFilterChange = (field, value) => {
        setAdvancedFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleColumnToggle = (column) => {
        setSelectedColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            plan: 'all',
            payoutCycle: 'all'
        });
        setAdvancedFilters({
            minInvestment: '',
            maxInvestment: '',
            minReturn: '',
            maxReturn: '',
            accountNumber: '',
            ifscCode: '',
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const downloadExcel = async () => {
        try {
            setExporting(true);
            const dataToExport = filteredReport.map(item => {
                const row = {};

                if (selectedColumns.username) row['Username'] = item.username || '';
                if (selectedColumns.account_number) row['Account Number'] = item.account_number || '';
                if (selectedColumns.ifsc_code) row['IFSC Code'] = item.ifsc_code || '';
                if (selectedColumns.status) row['Status'] = item.status || '';
                if (selectedColumns.plan) row['Plan'] = item.plan || '';
                if (selectedColumns.payout_cycle) {
                    row['Payout Cycle'] = getCycleSlab(item.payout_cycle);
                }
                if (selectedColumns.total_investment_amount) {
                    row['Total Investment'] = item.total_investment_amount ? formatExcelCurrency(item.total_investment_amount) : '';
                }
                if (selectedColumns.return_amount) {
                    row['Return Amount'] = item.return_amount ? formatExcelCurrency(item.return_amount) : '';
                }
                if (selectedColumns.investment_created_date) {
                    row['Investment Date'] = item.investment_created_date ? formatExcelDate(item.investment_created_date) : '';
                }

                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Return Report");

            if (dataToExport.length > 0) {
                const colWidths = Object.keys(dataToExport[0]).map(key => {
                    const maxLength = Math.max(
                        key.length,
                        ...dataToExport.map(row => String(row[key] || '').length)
                    );
                    return { width: Math.min(Math.max(maxLength + 2, 12), 30) };
                });
                worksheet['!cols'] = colWidths;
            }

            const fileName = `return-report-${startDate}-to-${endDate}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            dispatch(callAlert({
                message: `Excel file downloaded successfully: ${fileName}`,
                type: 'SUCCESS'
            }));
        } catch (error) {
            console.error('Export error:', error);
            dispatch(callAlert({ message: 'Failed to export Excel file', type: 'FAILED' }));
        } finally {
            setExporting(false);
        }
    };

    const formatExcelDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatExcelCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0.00';
        const numAmount = parseFloat(amount);
        return `₹${numAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0.00';
        const numAmount = parseFloat(amount);
        return `₹${numAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatColumnName = (key) => {
        const names = {
            username: 'Username',
            account_number: 'Account Number',
            ifsc_code: 'IFSC Code',
            status: 'Status',
            plan: 'Plan',
            payout_cycle: 'Payout Cycle',
            total_investment_amount: 'Total Investment',
            return_amount: 'Return Amount',
            investment_created_date: 'Investment Date'
        };
        return names[key] || key;
    };

    const activeFilterCount = Object.values(filters).filter(value =>
        value && value !== 'all'
    ).length + Object.values(advancedFilters).filter(value =>
        value && value !== false && value !== ''
    ).length;

    const handleRefresh = () => {
        if (startDate && endDate) {
            generateReport(true);
        } else {
            dispatch(callAlert({ message: 'Please select date range first', type: 'FAILED' }));
        }
    };

    // Columns for the table in the specified order
    const columns = [
        { id: 'index', label: 'Sr. No.', visible: true },
        { id: 'username', label: 'Username', visible: selectedColumns.username },
        { id: 'status', label: 'Status', visible: selectedColumns.status },
        { id: 'plan', label: 'Plan', visible: selectedColumns.plan },
        { id: 'total_investment_amount', label: 'Total Investment', visible: selectedColumns.total_investment_amount },
        { id: 'return_amount', label: 'Return Amount', visible: selectedColumns.return_amount },
        { id: 'account_number', label: 'Account Number', visible: selectedColumns.account_number },
        { id: 'ifsc_code', label: 'IFSC Code', visible: selectedColumns.ifsc_code },
    ];

    return (
        <Layout>
            <Box sx={{ padding: 2 }}>
                {/* Loading Backdrop */}
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress color="inherit" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Return Report...
                        </Typography>
                    </Box>
                </Backdrop>

                {/* Compact Statistics Cards */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {loading ? (
                        // Loading Skeletons for Stats
                        <>
                            <Grid item xs={6} sm={3}>
                                <StatSkeleton variant="rectangular" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatSkeleton variant="rectangular" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatSkeleton variant="rectangular" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatSkeleton variant="rectangular" />
                            </Grid>
                        </>
                    ) : (
                        // Actual Stat Cards
                        <>
                            <Grid item xs={6} sm={4}>
                                <StatCard sx={{
                                    borderLeft: '4px solid #667eea',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#667eea',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}>
                                    <StatContent>
                                        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{stats.total_count}</StatValue>
                                        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Total Records</StatLabel>
                                    </StatContent>
                                </StatCard>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <StatCard sx={{
                                    borderLeft: '4px solid #11998e',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#11998e',
                                        boxShadow: '0 8px 25px rgba(17, 153, 142, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}>
                                    <StatContent>
                                        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{formatCurrency(stats.total_investment)}</StatValue>
                                        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Total Investment</StatLabel>
                                    </StatContent>
                                </StatCard>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <StatCard sx={{
                                    borderLeft: '4px solid #ff6b6b',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#ff6b6b',
                                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}>
                                    <StatContent>
                                        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{formatCurrency(stats.total_return)}</StatValue>
                                        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Total Return</StatLabel>
                                    </StatContent>
                                </StatCard>
                            </Grid>
                        </>
                    )}
                </Grid>

                {/* Compact Date Range Selector */}
                <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onGenerateReport={() => generateReport()}
                />

                {/* Compact Filter Section */}
                {loading ? (
                    <FilterSkeleton variant="rectangular" />
                ) : (
                    <FilterSection>
                        <FilterRow>
                            <StyledTextField
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#667eea', fontSize: '18px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: 180, flex: 1 }}
                            />

                            <StyledTextField
                                select
                                label="Status"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </StyledTextField>

                            <StyledTextField
                                select
                                label="Plan"
                                value={filters.plan}
                                onChange={(e) => handleFilterChange('plan', e.target.value)}
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="all">All Plans</MenuItem>
                                {uniquePlans.map(plan => (
                                    <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                                ))}
                            </StyledTextField>

                            <StyledTextField
                                select
                                label="Payout Cycle"
                                value={filters.payoutCycle}
                                onChange={(e) => handleFilterChange('payoutCycle', e.target.value)}
                                size="small"
                                sx={{ minWidth: 140 }}
                            >
                                <MenuItem value="all">All Cycles</MenuItem>
                                {uniquePayoutCycles.map(cycle => (
                                    <MenuItem key={cycle} value={cycle}>{cycle}</MenuItem>
                                ))}
                            </StyledTextField>

                            <Tooltip title="Refresh">
                                <CompactButton
                                    variant="contained"
                                    onClick={handleRefresh}
                                    disabled={!startDate || !endDate || refreshing}
                                    startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                                    sx={{
                                        background: '#2196F3',
                                        color: 'white',
                                        '&:hover': {
                                            background: '#1976D2',
                                        },
                                        '&:disabled': {
                                            background: '#bbdefb',
                                            color: '#e3f2fd'
                                        }
                                    }}
                                >
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </CompactButton>
                            </Tooltip>

                            {activeFilterCount > 0 && (
                                <CompactButton
                                    variant="outlined"
                                    onClick={clearFilters}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    Clear Filters
                                </CompactButton>
                            )}
                        </FilterRow>
                    </FilterSection>
                )}

                {/* Advanced Search Dialog */}
                <AdvancedSearchDialog
                    open={advancedSearchOpen}
                    onClose={() => setAdvancedSearchOpen(false)}
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Advanced Search</Typography>
                        <IconButton onClick={() => setAdvancedSearchOpen(false)}>
                            <HighlightOffIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Column Selection</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.keys(selectedColumns).map((column) => (
                                        <FormControlLabel
                                            key={column}
                                            control={
                                                <Checkbox
                                                    checked={selectedColumns[column]}
                                                    onChange={() => handleColumnToggle(column)}
                                                />
                                            }
                                            label={formatColumnName(column)}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Min Investment"
                                    value={advancedFilters.minInvestment}
                                    onChange={(e) => handleAdvancedFilterChange('minInvestment', e.target.value)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Max Investment"
                                    value={advancedFilters.maxInvestment}
                                    onChange={(e) => handleAdvancedFilterChange('maxInvestment', e.target.value)}
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Min Return"
                                    value={advancedFilters.minReturn}
                                    onChange={(e) => handleAdvancedFilterChange('minReturn', e.target.value)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Max Return"
                                    value={advancedFilters.maxReturn}
                                    onChange={(e) => handleAdvancedFilterChange('maxReturn', e.target.value)}
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    value={advancedFilters.accountNumber}
                                    onChange={(e) => handleAdvancedFilterChange('accountNumber', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    value={advancedFilters.ifscCode}
                                    onChange={(e) => handleAdvancedFilterChange('ifscCode', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={clearFilters}>Clear All</Button>
                        <Button onClick={() => setAdvancedSearchOpen(false)} variant="contained">
                            Apply Filters
                        </Button>
                    </DialogActions>
                </AdvancedSearchDialog>

                {/* Results Summary */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {loading ? 'Loading data...' : `Showing ${filteredReport.length} of ${report.length} records`}
                    </Typography>
                    {activeFilterCount > 0 && (
                        <Chip
                            icon={<FilterListIcon />}
                            label={`${activeFilterCount} Filters Applied`}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Box>

                {/* Table Component with Loading State */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={40} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Return Report Data...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <StyledTableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
                            <Table stickyHeader size="small" sx={{ minWidth: 1600 }}>
                                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                                    <TableRow>
                                        {columns.map((column) => (
                                            column.visible && (
                                                <StyledTableHeaderCell
                                                    key={column.id}
                                                    sx={{ backgroundColor: '#1976d2' }}
                                                >
                                                    {column.label}
                                                </StyledTableHeaderCell>
                                            )
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredReport.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.filter(c => c.visible).length} align="center" sx={{ py: 8 }}>
                                                <Box sx={{ textAlign: 'center', color: '#757575' }}>
                                                    <InfoOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
                                                    <Typography variant="h6" gutterBottom fontWeight="600">
                                                        No Records Found
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {report.length === 0
                                                            ? 'No data found for the selected date range. Try selecting a different date range.'
                                                            : 'Try adjusting your filters or refresh the data'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredReport
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    {/* Sr. No. */}
                                                    <StyledTableCell>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </StyledTableCell>

                                                    {/* Username */}
                                                    {selectedColumns.username && (
                                                        <StyledTableCell>
                                                            <Tooltip title={row.username || "-"}>
                                                                <Typography variant="body2" noWrap sx={{ maxWidth: 120, fontWeight: '500' }}>
                                                                    {row.username || "-"}
                                                                </Typography>
                                                            </Tooltip>
                                                        </StyledTableCell>
                                                    )}

                                                    {/* Status */}
                                                    {selectedColumns.status && (
                                                        <StyledTableCell>
                                                            {row.status === 'Active' ? (
                                                                <ActiveChip label="Active" size="small" />
                                                            ) : row.status === 'Inactive' ? (
                                                                <InactiveChip label="Inactive" size="small" />
                                                            ) : (
                                                                <StatusChip label={row.status || "-"} size="small" />
                                                            )}
                                                        </StyledTableCell>
                                                    )}

                                                    {/* Plan */}
                                                    {selectedColumns.plan && (
                                                        <StyledTableCell>
                                                            <Chip
                                                                label={row.plan || "-"}
                                                                size="small"
                                                                sx={{
                                                                    color: "white",
                                                                    backgroundColor: '#1976d2',
                                                                    fontSize: "10px",
                                                                }}
                                                            />
                                                        </StyledTableCell>
                                                    )}

                                                    {/* Total Investment */}
                                                    {selectedColumns.total_investment_amount && (
                                                        <StyledTableCell>
                                                            <Typography variant="body2" fontWeight="600">
                                                                {formatCurrency(row.total_investment_amount)}
                                                            </Typography>
                                                        </StyledTableCell>
                                                    )}

                                                    {/* Return Amount */}
                                                    {selectedColumns.return_amount && (
                                                        <StyledTableCell>
                                                            <Typography variant="body2" fontWeight="700">
                                                                {formatCurrency(row.return_amount)}
                                                            </Typography>
                                                        </StyledTableCell>
                                                    )}

                                                    {/* Account Number */}
                                                    {selectedColumns.account_number && (
                                                        <StyledTableCell>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {row.account_number || "-"}
                                                            </Typography>
                                                        </StyledTableCell>
                                                    )}

                                                    {/* IFSC Code */}
                                                    {selectedColumns.ifsc_code && (
                                                        <StyledTableCell>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {row.ifsc_code || "-"}
                                                            </Typography>
                                                        </StyledTableCell>
                                                    )}
                                                </StyledTableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>

                        {filteredReport.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 100, 250, 500]}
                                component="div"
                                count={filteredReport.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    borderTop: `1px solid #e0e0e0`,
                                    backgroundColor: 'white',
                                    borderRadius: '0 0 8px 8px',
                                    border: `1px solid #e0e0e0`,
                                    borderTop: 'none',
                                }}
                            />
                        )}
                    </>
                )}
            </Box>
        </Layout>
    );
}

export default withAuth(ReturnReport);