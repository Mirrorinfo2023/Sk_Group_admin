"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import SitesTransactions from "@/components/Sites/new/SitesReport";
import {
    Grid,
    Button,
    Typography,
    Box,
    TextField,
    Card,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
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
    LocationOn,
    CheckCircle,
    HighlightOff,
    DeleteForever,
    CloudUpload,
    Photo,
    Delete,
} from '@mui/icons-material';

function SitesReport(props) {
    const [report, setReport] = useState(null);
    const [allData, setAllData] = useState([]);
    const [showSites, setShowSites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        const activeFilters = Boolean(
            searchTerm ||
            selectedStatus ||
            !fromDate.isSame(dayjs().startOf('month'), 'day') ||
            !toDate.isSame(dayjs(), 'day')
        );
        setHasActiveFilters(activeFilters);
    }, [searchTerm, selectedStatus, fromDate, toDate]);

    // Fetch all sites data
    const fetchAllSites = useCallback(async () => {
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
            const response = await api.post("/api/sksites/c45e18a7d1b93f4c8a55d99e21c7ab90", { data: encryptedReqData });

            if (response.data?.data) {
                const decryptedResponse = DataDecrypt(response.data.data);

                if (decryptedResponse.status === 200) {
                    const normalized = (decryptedResponse.data || []).map((site) => ({
                        ...site,
                        created_date: dayjs(site.created_at).format('DD-MM-YYYY HH:mm A')
                    }));

                    setAllData(normalized);
                    setReport(decryptedResponse.report);
                    applyFiltersOnData(normalized, {
                        searchTerm,
                        selectedStatus,
                        fromDate,
                        toDate,
                    });
                } else {
                    setError(decryptedResponse.message || "Failed to fetch site data");
                    setAllData([]);
                    setShowSites([]);
                }
            } else {
                setError("Failed to fetch site data");
                setAllData([]);
                setShowSites([]);
            }
        } catch (err) {
            console.error("Error fetching sites:", err);
            const errorMessage = err?.response?.data?.error || err.message || "Network error";
            setError(errorMessage);
            dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
            setAllData([]);
            setShowSites([]);
        } finally {
            setLoading(false);
        }
    }, [dispatch, fromDate, toDate, searchTerm, selectedStatus]);

    // Initial fetch
    useEffect(() => {
        fetchAllSites();
    }, []);

    const statusStringToValue = (status) => {
        if (!status) return null;
        if (status === 'active') return 1;
        if (status === 'inactive') return 2;
        const n = Number(status);
        return Number.isNaN(n) ? null : n;
    };

    // Client-side filtering
    const applyFiltersOnData = (data = allData, opts = {}) => {
        const {
            searchTerm: sTerm = searchTerm,
            selectedStatus: sStatus = selectedStatus,
            fromDate: fDate = fromDate,
            toDate: tDate = toDate,
        } = opts;

        let filtered = Array.isArray(data) ? [...data] : [];

        // Search filter
        if (sTerm && sTerm.trim() !== "") {
            const q = sTerm.trim().toLowerCase();
            filtered = filtered.filter(item => {
                const siteName = (item.site_name || "").toString().toLowerCase();
                const location = (item.location || "").toString().toLowerCase();
                const info = (item.information || "").toString().toLowerCase();
                const idStr = (item.id || "").toString().toLowerCase();
                return siteName.includes(q) || location.includes(q) || info.includes(q) || idStr.includes(q);
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
                const created = dayjs(item.created_at);
                return created.isValid() ? created.isSame(start) || created.isAfter(start) : false;
            });
        }
        if (tDate) {
            const end = dayjs(tDate).endOf('day');
            filtered = filtered.filter(item => {
                const created = dayjs(item.created_at);
                return created.isValid() ? created.isSame(end) || created.isBefore(end) : false;
            });
        }

        setShowSites(filtered);
    };

    const handleApplyFilters = () => {
        applyFiltersOnData(allData, {
            searchTerm,
            selectedStatus,
            fromDate,
            toDate
        });
    };

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApplyFilters();
        }
    };

    const handleRefresh = () => {
        fetchAllSites();
    };

    // Photo upload handlers
    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB");
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
                return;
            }

            setUploadedPhoto(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setUploadedPhoto(null);
        setPhotoPreview(null);
    };

    // Upload photo to server
    const uploadPhotoToServer = async () => {
        if (!uploadedPhoto) return null;

        const formData = new FormData();
        formData.append('photo', uploadedPhoto);
        formData.append('site_id', selectedSite.id);

        try {
            setUploading(true);
            const response = await api.post("/api/site/upload-photo", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data?.data) {
                const decrypted = DataDecrypt(response.data.data);
                if (decrypted.status === 200) {
                    return decrypted.photo_url;
                }
            }
            return null;
        } catch (error) {
            console.error("Error uploading photo:", error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Edit dialog handlers
    const handleEditClick = (site) => {
        setSelectedSite(site);
        setUploadedPhoto(null);
        setPhotoPreview(site.photo || null);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedSite(null);
        setUploadedPhoto(null);
        setPhotoPreview(null);
    };

    const handleEditSave = async () => {
        if (!selectedSite) return;

        try {
            setUploading(true);

            // 1️⃣ Prepare payload (must match backend)
            const payload = {
                site_id: selectedSite.id,          // ✅ MUST be site_id
                site_name: selectedSite.site_name,
                location: selectedSite.location,
                information: selectedSite.information
            };

            // 2️⃣ Encrypt payload
            const encryptedData = DataEncrypt(JSON.stringify(payload));

            // 3️⃣ Prepare FormData (REQUIRED for multer)
            const formData = new FormData();
            formData.append("data", encryptedData);

            // 4️⃣ Append photo ONLY if user selected a new one
            if (uploadedPhoto) {
                formData.append("photo", uploadedPhoto);
            }

            // 5️⃣ API call (NO manual headers)
            const response = await api.post(
                "/api/sksites/b23d9c8f4a2e7d19c4a8e91f5b61d333",
                formData
            );

            // 6️⃣ Decrypt response
            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                alert("Site updated successfully ✅");
                handleRefresh();           // reload list
                handleEditDialogClose();   // close modal
            } else {
                alert(decrypted.message || "Failed to update site");
            }

        } catch (error) {
            console.error("Update Site Error:", error);
            alert("Something went wrong while updating site");
        } finally {
            setUploading(false);
        }
    };

    // Stats configuration
    const statsCards = [
        {
            label: "Total Sites",
            value: report?.total_count ?? allData.length ?? 0,
            color: "#FF6B35",
            icon: <LocationOn sx={{ fontSize: 24 }} />,
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
                        Update Sites Report
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
                            href="/add-new-site/"
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
                            Add Site
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
                            Filter Sites
                        </Typography>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search sites..."
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
                            <Button
                                variant={selectedStatus === 'active' ? "contained" : "outlined"}
                                onClick={() => setSelectedStatus(selectedStatus === 'active' ? '' : 'active')}
                                size="small"
                                sx={{ height: 40 }}
                            >
                                Active
                            </Button>
                            <Button
                                variant={selectedStatus === 'inactive' ? "contained" : "outlined"}
                                onClick={() => setSelectedStatus(selectedStatus === 'inactive' ? '' : 'inactive')}
                                size="small"
                                sx={{ height: 40 }}
                            >
                                Inactive
                            </Button>

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
                        {`Showing ${showSites.length} sites${hasActiveFilters ? ' (filtered)' : ''}${loading ? ' (Loading...)' : ''}`}
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
                <SitesTransactions
                    showSites={showSites}
                    loading={loading}
                    onEditClick={handleEditClick}
                />

                {/* Edit Site Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Site: {selectedSite?.site_name || ''}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {selectedSite && (
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                {/* Photo Upload Section */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                        Site Photo
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        mb: 2
                                    }}>
                                        {/* Photo Preview */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Avatar
                                                src={photoPreview || selectedSite.photo}
                                                variant="rounded"
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    border: '2px solid #e0e0e0',
                                                    bgcolor: 'grey.100'
                                                }}
                                            >
                                                <Photo sx={{ fontSize: 40, color: 'grey.400' }} />
                                            </Avatar>

                                            {/* Remove Photo Button (only show if there's a photo) */}
                                            {(photoPreview || selectedSite.photo) && (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleRemovePhoto}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        bgcolor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            bgcolor: 'error.dark',
                                                        }
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>

                                        {/* Upload Controls */}
                                        <Box>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="photo-upload"
                                                type="file"
                                                onChange={handlePhotoUpload}
                                            />
                                            <label htmlFor="photo-upload">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    startIcon={<CloudUpload />}
                                                    sx={{ mb: 1 }}
                                                >
                                                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                                </Button>
                                            </label>
                                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 1 }}>
                                                Upload JPG, PNG, or WebP (Max 5MB)
                                            </Typography>

                                            {/* Show current photo URL if exists */}
                                            {selectedSite.photo && !uploadedPhoto && (
                                                <Typography variant="caption" display="block" sx={{ color: 'info.main', mt: 1 }}>
                                                    Current: <a href={selectedSite.photo} target="_blank" rel="noopener noreferrer">View</a>
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Site Details Form */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Site Name *"
                                        value={selectedSite.site_name || ''}
                                        onChange={(e) => setSelectedSite({
                                            ...selectedSite,
                                            site_name: e.target.value
                                        })}
                                        size="small"
                                        margin="normal"
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Status"
                                        value={selectedSite.status === 1 ? 'Active' : selectedSite.status === 2 ? 'Inactive' : 'Deleted'}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        margin="normal"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Location *"
                                        value={selectedSite.location || ''}
                                        onChange={(e) => setSelectedSite({
                                            ...selectedSite,
                                            location: e.target.value
                                        })}
                                        size="small"
                                        margin="normal"
                                        multiline
                                        rows={2}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Information"
                                        value={selectedSite.information || ''}
                                        onChange={(e) => setSelectedSite({
                                            ...selectedSite,
                                            information: e.target.value
                                        })}
                                        size="small"
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        placeholder="Add detailed information about the site..."
                                    />
                                </Grid>

                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 1 }}>
                        <Button
                            onClick={handleEditDialogClose}
                            color="inherit"
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            variant="contained"
                            color="primary"
                            disabled={uploading || !selectedSite?.site_name || !selectedSite?.location}
                            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {uploading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
}

export default withAuth(SitesReport);