"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PoliciesTable from "@/components/PrivacyPolicy/PoliciesTable";
import PolicyDialog from "@/components/PrivacyPolicy/PolicyDialog";
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
    Article,
} from '@mui/icons-material';

function PoliciesReport(props) {
    const [report, setReport] = useState(null);
    const [allData, setAllData] = useState([]);
    const [showPolicies, setShowPolicies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    // Helper function to get category name by ID
    const getCategoryNameById = useCallback((categoryId) => {
        if (!categoryId || !categories.length) return 'N/A';
        const category = categories.find(cat => String(cat.id) === String(categoryId));
        return category ? category.category_name : 'N/A';
    }, [categories]);

    // Helper function to enrich policies with category names
    const enrichPoliciesWithCategoryNames = useCallback((policies) => {
        if (!policies || !Array.isArray(policies)) return [];
        if (!categories.length) return policies; // Can't enrich if no categories

        return policies.map(policy => ({
            ...policy,
            category_name: policy.category_name || getCategoryNameById(policy.category_id)
        }));
    }, [categories, getCategoryNameById]);

    // Update hasActiveFilters whenever filter states change
    useEffect(() => {
        const activeFilters = Boolean(
            searchTerm ||
            selectedStatus ||
            selectedCategory ||
            !fromDate.isSame(dayjs().startOf('month'), 'day') ||
            !toDate.isSame(dayjs(), 'day')
        );
        setHasActiveFilters(activeFilters);
    }, [searchTerm, selectedStatus, selectedCategory, fromDate, toDate]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get("/api/policy/66a815be731fee133d7ecc8f240447c14e770b83");
            const decrypted = DataDecrypt(response.data.data);

            // console.log("decrypted ", decrypted)
            if (decrypted.status === 200) {
                setCategories(decrypted.data || []);
            } else {
                console.warn("No categories found:", decrypted.message);
                setCategories([]);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories");
            setCategories([]);
        }
    }, []);

    // Fetch all policies
    const fetchAllPolicies = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                '/api/policy/d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0'
            );

            if (!response?.data || response.data.status !== 200) {
                throw new Error(response?.data?.message || "Invalid server response");
            }

            const apiResponse = response.data;

            const enrichedData = enrichPoliciesWithCategoryNames(
                apiResponse.data || []
            );

            setAllData(enrichedData);
            setReport(apiResponse.report);

            applyFiltersOnData(enrichedData, {
                searchTerm,
                selectedStatus,
                selectedCategory,
                fromDate,
                toDate,
            });

        } catch (err) {
            console.error("Error fetching policies:", err);

            const errorMessage =
                err?.response?.data?.message ||
                err.message ||
                "Network error";

            setError(errorMessage);
            dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));

            setAllData([]);
            setShowPolicies([]);
        } finally {
            setLoading(false);
        }
    }, [
        dispatch,
        fromDate,
        toDate,
        searchTerm,
        selectedCategory,
        selectedStatus,
        enrichPoliciesWithCategoryNames
    ]);


    // Initial fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch policies after categories are loaded
    useEffect(() => {
        if (categories.length > 0) {
            fetchAllPolicies();
        }
    }, [categories, fetchAllPolicies]);

    // Helper: convert selectedStatus string to numeric status
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
            selectedCategory: sCategory = selectedCategory,
            fromDate: fDate = fromDate,
            toDate: tDate = toDate,
        } = opts;

        let filtered = Array.isArray(data) ? [...data] : [];

        // Search - match content and category name (case-insensitive)
        if (sTerm && sTerm.trim() !== "") {
            const q = sTerm.trim().toLowerCase();
            filtered = filtered.filter(item => {
                const content = (item.content || "").toString().toLowerCase();
                const categoryName = (item.category_name || getCategoryNameById(item.category_id)).toString().toLowerCase();
                return content.includes(q) || categoryName.includes(q);
            });
        }

        // Status filter
        const statusVal = statusStringToValue(sStatus);
        if (statusVal !== null) {
            filtered = filtered.filter(item => Number(item.status) === statusVal);
        }

        // Category filter
        if (sCategory !== "" && sCategory !== null && sCategory !== undefined) {
            filtered = filtered.filter(item => String(item.category_id) === String(sCategory));
        }

        // Date range filter on created_on
        if (fDate && fDate.isValid()) {
            const start = dayjs(fDate).startOf('day');
            filtered = filtered.filter(item => {
                const created = dayjs(item.created_on);
                return created.isValid() ? created.isSame(start) || created.isAfter(start) : false;
            });
        }
        if (tDate && tDate.isValid()) {
            const end = dayjs(tDate).endOf('day');
            filtered = filtered.filter(item => {
                const created = dayjs(item.created_on);
                return created.isValid() ? created.isSame(end) || created.isBefore(end) : false;
            });
        }

        setShowPolicies(filtered);
    };

    // When user clicks Apply
    const handleApplyFilters = () => {
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            selectedCategory,
            fromDate,
            toDate
        });
    };

    // Reset filters locally
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedCategory("");
        setFromDate(dayjs().startOf("month"));
        setToDate(dayjs());

        applyFiltersOnData(allData, {
            searchTerm: "",
            selectedStatus: "",
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

    // Refresh data
    const handleRefresh = () => {
        fetchCategories();
        fetchAllPolicies();
    };

    // Dialog handlers
    const handleOpenDialog = (policy = null) => {
        setEditingPolicy(policy);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingPolicy(null);
    };

    // Handle save policy (create or update)
    const handleSavePolicy = async (formData) => {
        setDialogLoading(true);
        try {
            let response;

            if (editingPolicy) {
                // Update existing policy
                response = await api.post(`/api/policy/update-policy/${editingPolicy.id}`, formData);
            } else {
                // Create new policy
                response = await api.post(`/api/policy/add-policy`, formData);
            }

            if (response.data.status === 200 || response.data.status === 201) {
                dispatch(callAlert({
                    message: response.data.message,
                    type: 'SUCCESS'
                }));
                fetchAllPolicies();  // Refresh list
                handleCloseDialog();
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to save policy');
            }
        } catch (err) {
            console.error('Error saving policy:', err);
            const errorMessage = err?.response?.data?.message || err.message || 'Error saving policy';
            dispatch(callAlert({
                message: errorMessage,
                type: 'FAILED'
            }));
            throw new Error(errorMessage);
        } finally {
            setDialogLoading(false);
        }
    };


    // Stats configuration
    const statsCards = [
        {
            label: "Total Policies",
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
            label: "Categories",
            value: categories.length,
            color: "#9C27B0",
            icon: <Article sx={{ fontSize: 24 }} />,
            bgColor: "#F3E5F5"
        }
    ];

    // Chip delete handlers
    const removeSearchChip = () => {
        setSearchTerm('');
        applyFiltersOnData(allData, {
            searchTerm: '',
            selectedStatus,
            selectedCategory,
            fromDate,
            toDate
        });
    };

    const removeStatusChip = () => {
        setSelectedStatus('');
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus: '',
            selectedCategory,
            fromDate,
            toDate
        });
    };

    const removeCategoryChip = () => {
        setSelectedCategory('');
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            selectedCategory: '',
            fromDate,
            toDate
        });
    };

    const removeFromDateChip = () => {
        setFromDate(dayjs().startOf('month'));
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            selectedCategory,
            fromDate: dayjs().startOf('month'),
            toDate
        });
    };

    const removeToDateChip = () => {
        setToDate(dayjs());
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            selectedCategory,
            fromDate,
            toDate: dayjs()
        });
    };

    // Handle delete policy
    const handleDeletePolicy = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                const response = await api.post(`/api/policy/delete-policy/${id}`);
                const decrypted = DataDecrypt(response.data.data);

                if (decrypted.status === 200) {
                    dispatch(callAlert({ message: decrypted.message, type: 'SUCCESS' }));
                    // Refresh the list
                    fetchAllPolicies();
                } else {
                    dispatch(callAlert({ message: decrypted.message, type: 'FAILED' }));
                }
            } catch (err) {
                console.error('Error deleting policy:', err);
                dispatch(callAlert({
                    message: err?.response?.data?.error || 'Error deleting policy',
                    type: 'FAILED'
                }));
            }
        }
    };

    // Handle status change
    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 2 : 1;
            const payload = { status: newStatus };
            const encryptedData = DataEncrypt(JSON.stringify(payload));

            const response = await api.post(`/api/policy/update-policy-status/${id}`, { data: encryptedData });
            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                dispatch(callAlert({ message: decrypted.message, type: 'SUCCESS' }));
                // Refresh the list
                fetchAllPolicies();
            } else {
                dispatch(callAlert({ message: decrypted.message, type: 'FAILED' }));
            }
        } catch (err) {
            console.error('Error updating policy status:', err);
            dispatch(callAlert({
                message: err?.response?.data?.error || 'Error updating status',
                type: 'FAILED'
            }));
        }
    };

    // Handle edit policy
    const handleEditPolicy = (policy) => {
        handleOpenDialog(policy);
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
                        Policies Management
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* <IconButton
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
                        </IconButton> */}

                        {/* <IconButton
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
                        </IconButton> */}

                        <Button
                            variant="contained"
                            onClick={() => handleOpenDialog()}
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
                            Add Policy
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
                            Filter Policies
                        </Typography>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search policies..."
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

                            {/* Category Filter */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
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
                                {selectedCategory && (
                                    <Chip
                                        label={`Category: ${getCategoryNameById(selectedCategory)}`}
                                        size="small"
                                        onDelete={removeCategoryChip}
                                        color="info"
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
                        {`Showing ${showPolicies.length} policies${hasActiveFilters ? ' (filtered)' : ''}${loading ? ' (Loading...)' : ''}`}
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
                <PoliciesTable
                    policies={showPolicies}
                    loading={loading}
                    onDelete={handleDeletePolicy}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditPolicy}
                />

                {/* Policy Dialog */}
                <PolicyDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onSave={handleSavePolicy}
                    policy={editingPolicy}
                    categories={categories}
                    loading={dialogLoading}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(PoliciesReport);