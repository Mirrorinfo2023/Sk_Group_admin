"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import BannersTransactions from "@/components/Banners/BannersReport";
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
} from '@mui/icons-material';

function BannersReport(props) {
    const [report, setReport] = useState(null);

    // full data fetched from API (never modified)
    const [allData, setAllData] = useState([]);

    // data shown in table after client-side filtering
    const [showServiceTrans, setShowServiceTrans] = useState([]);

    // filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedApp, setSelectedApp] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());

    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [appCategories, setAppCategories] = useState([]);
    const [hasActiveFilters, setHasActiveFilters] = useState(false); // track UI filters

    // Update hasActiveFilters whenever filter states change
    useEffect(() => {
        const activeFilters = Boolean(
            searchTerm ||
            selectedStatus ||
            selectedApp ||
            selectedCategory ||
            !fromDate.isSame(dayjs().startOf('month'), 'day') ||
            !toDate.isSame(dayjs(), 'day')
        );
        setHasActiveFilters(activeFilters);
    }, [searchTerm, selectedStatus, selectedApp, selectedCategory, fromDate, toDate]);

    // Fetch categories and apps
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/api/banner/66a815be731fee133d7ecc8f240447c14e770b83");
                const decrypted = DataDecrypt(response.data.data);

                if (decrypted.status === 200) {
                    setAppCategories(decrypted.data.notificationApp || []);
                    setCategories(decrypted.data.bannersCategory || []);
                } else {
                    console.warn("No categories found:", decrypted.message);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories");
            }
        };
        getCategories();
    }, []);

    // Fetch all banner data ONCE (or on refresh)
    const fetchAllBanners = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // request uses current date range, but backend data will be treated as raw; we're going to filter client-side
            const reqData = {
                from_date: dayjs().startOf('year').format('YYYY-MM-DD'), // ask broad range - backend may ignore but safe
                to_date: dayjs().format('YYYY-MM-DD'),
                searchTerm: "",
                status: "",
                app_id: "",
                category_id: ""
            };

            const encryptedReqData = DataEncrypt(JSON.stringify(reqData));
            const response = await api.post("/api/banner/b0922bbeca57785f0add2136bca4786594e739cd", { data: encryptedReqData });

            if (response.data?.data) {
                const decryptedResponse = DataDecrypt(response.data.data);

                if (decryptedResponse.status === 200) {
                    // Map app and category names to banners and store in allData
                    const normalized = (decryptedResponse.data || []).map((banner) => {
                        const appName = appCategories.find((app) => String(app.id) === String(banner.app_id))?.app_name || "N/A";
                        const categoryName = categories.find((category) => String(category.id) === String(banner.type_id))?.category_name || "N/A";
                        return {
                            ...banner,
                            app_name: appName,
                            category: categoryName,
                        };
                    });

                    setAllData(normalized);
                    setReport(decryptedResponse.report);
                    // apply current filters on the freshly fetched data
                    applyFiltersOnData(normalized, {
                        searchTerm,
                        selectedStatus,
                        selectedApp,
                        selectedCategory,
                        fromDate,
                        toDate,
                    });
                } else {
                    setError(decryptedResponse.message || "Failed to fetch banner data");
                    setAllData([]);
                    setShowServiceTrans([]);
                }
            } else {
                setError("Failed to fetch banner data");
                setAllData([]);
                setShowServiceTrans([]);
            }
        } catch (err) {
            console.error("Error fetching banners:", err);
            const errorMessage = err?.response?.data?.error || err.message || "Network error";
            setError(errorMessage);
            dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
            setAllData([]);
            setShowServiceTrans([]);
        } finally {
            setLoading(false);
        }
    }, [appCategories, categories, dispatch, fromDate, toDate, searchTerm, selectedApp, selectedCategory, selectedStatus]);

    // Auto-fetch once categories/apps are ready
    useEffect(() => {
        // fetch only after categories & appCategories loaded (so mapping works)
        if (categories.length >= 0 && appCategories.length >= 0) {
            // we'll call fetchAllBanners (it internally maps using categories/appCategories)
            fetchAllBanners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, appCategories]);

    // Helper: convert selectedStatus string to numeric status if needed
    const statusStringToValue = (status) => {
        if (!status) return null;
        if (status === 'active') return 1;
        if (status === 'inactive') return 2;
        // allow passing numeric string too
        const n = Number(status);
        return Number.isNaN(n) ? null : n;
    };

    // Core client-side filtering function - can be called whenever filters change
    const applyFiltersOnData = (data = allData, opts = {}) => {
        const {
            searchTerm: sTerm = searchTerm,
            selectedStatus: sStatus = selectedStatus,
            selectedApp: sApp = selectedApp,
            selectedCategory: sCategory = selectedCategory,
            fromDate: fDate = fromDate,
            toDate: tDate = toDate,
        } = opts;

        let filtered = Array.isArray(data) ? [...data] : [];

        // Search - match title, banner_for, app_name, category (case-insensitive)
        if (sTerm && sTerm.trim() !== "") {
            const q = sTerm.trim().toLowerCase();
            filtered = filtered.filter(item => {
                const title = (item.title || "").toString().toLowerCase();
                const bannerFor = (item.banner_for || "").toString().toLowerCase();
                const appName = (item.app_name || "").toString().toLowerCase();
                const categoryName = (item.category || "").toString().toLowerCase();
                const idStr = (item.id || "").toString().toLowerCase();
                return title.includes(q) || bannerFor.includes(q) || appName.includes(q) || categoryName.includes(q) || idStr.includes(q);
            });
        }

        // Status filter
        const statusVal = statusStringToValue(sStatus);
        if (statusVal !== null) {
            filtered = filtered.filter(item => Number(item.status) === statusVal);
        }

        // App filter (app id)
        if (sApp !== "" && sApp !== null && sApp !== undefined) {
            // support both numeric id and string id
            filtered = filtered.filter(item => String(item.app_id) === String(sApp) || String(item.app_id) === String(item.app_id));
        }

        // Category filter (type_id or category id)
        if (sCategory !== "" && sCategory !== null && sCategory !== undefined) {
            filtered = filtered.filter(item => String(item.type_id) === String(sCategory) || String(item.category_id) === String(sCategory));
        }

        // Date range filter on created_on (inclusive)
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

        setShowServiceTrans(filtered);
    };

    // When user clicks Apply - run client-side filter (no API call)
    const handleApplyFilters = () => {
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            selectedApp,
            selectedCategory,
            fromDate,
            toDate
        });
    };

    // Reset filters locally (no API call)
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedApp("");
        setSelectedCategory("");
        setFromDate(dayjs().startOf("month"));
        setToDate(dayjs());

        // reset shown data to allData (or reapply default date range)
        // we'll show allData filtered by default date range (month start -> today)
        applyFiltersOnData(allData, {
            searchTerm: "",
            selectedStatus: "",
            selectedApp: "",
            selectedCategory: "",
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

    // Refresh data (re-fetch from API)
    const handleRefresh = () => {
        fetchAllBanners();
    };

    // Stats configuration with hover effect (values will be derived from report or computed)
    const statsCards = [
        {
            label: "Total Banners",
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

    // Chip delete handlers - change filter locally and reapply
    const removeSearchChip = () => { setSearchTerm(''); applyFiltersOnData(allData, { searchTerm: '', selectedStatus, selectedApp, selectedCategory, fromDate, toDate }); };
    const removeStatusChip = () => { setSelectedStatus(''); applyFiltersOnData(allData, { searchTerm, selectedStatus: '', selectedApp, selectedCategory, fromDate, toDate }); };
    const removeAppChip = () => { setSelectedApp(''); applyFiltersOnData(allData, { searchTerm, selectedStatus, selectedApp: '', selectedCategory, fromDate, toDate }); };
    const removeCategoryChip = () => { setSelectedCategory(''); applyFiltersOnData(allData, { searchTerm, selectedStatus, selectedApp, selectedCategory: '', fromDate, toDate }); };
    const removeFromDateChip = () => { setFromDate(dayjs().startOf('month')); applyFiltersOnData(allData, { searchTerm, selectedStatus, selectedApp, selectedCategory, fromDate: dayjs().startOf('month'), toDate }); };
    const removeToDateChip = () => { setToDate(dayjs()); applyFiltersOnData(allData, { searchTerm, selectedStatus, selectedApp, selectedCategory, fromDate, toDate: dayjs() }); };

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
                        Banners Report
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
                            href="/add-new-banner/"
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
                            Add Banner
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
                            Filter Banners
                        </Typography>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search banners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
                                }}
                                sx={{
                                    minWidth: 200,
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

                            {/* App Filter */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>App</InputLabel>
                                <Select
                                    value={selectedApp}
                                    label="App"
                                    onChange={(e) => setSelectedApp(e.target.value)}
                                    sx={{ height: '40px' }}
                                >
                                    <MenuItem value="">All Apps</MenuItem>
                                    {appCategories.map((app) => (
                                        <MenuItem key={app.id} value={app.id}>
                                            {app.app_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Category Filter */}
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Category"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    sx={{ height: '40px' }}
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.category_name}
                                        </MenuItem>
                                    ))}
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
                                {selectedApp && (
                                    <Chip
                                        label={`App: ${appCategories.find(a => String(a.id) === String(selectedApp))?.app_name || selectedApp}`}
                                        size="small"
                                        onDelete={removeAppChip}
                                        color="info"
                                        variant="outlined"
                                    />
                                )}
                                {selectedCategory && (
                                    <Chip
                                        label={`Category: ${categories.find(c => String(c.id) === String(selectedCategory))?.category_name || selectedCategory}`}
                                        size="small"
                                        onDelete={removeCategoryChip}
                                        color="success"
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
                        {`Showing ${showServiceTrans.length} banners${hasActiveFilters ? ' (filtered)' : ''}${loading ? ' (Loading...)' : ''}`}
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
                <BannersTransactions
                    showServiceTrans={showServiceTrans}
                    searchTerm={searchTerm}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(BannersReport);
