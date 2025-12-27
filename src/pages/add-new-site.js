"use client";

import {
    Box,
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Chip,
    Alert,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { styled } from "@mui/material/styles";
import ReCAPTCHA from "react-google-recaptcha";
import Layout from "@/components/Dashboard/layout";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const AddNewSite = () => {
    const [formData, setFormData] = useState({
        siteName: "",
        location: "",
        information: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ""
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors({
                    ...errors,
                    photo: "Please upload a valid image file (JPEG, PNG, GIF)"
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({
                    ...errors,
                    photo: "File size must be less than 5MB"
                });
                return;
            }

            setSelectedFile(file);
            // Clear photo error
            if (errors.photo) {
                setErrors({
                    ...errors,
                    photo: ""
                });
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.siteName.trim()) {
            newErrors.siteName = "Site name is required";
        } else if (formData.siteName.trim().length < 3) {
            newErrors.siteName = "Site name must be at least 3 characters";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        } else if (formData.location.trim().length < 5) {
            newErrors.location = "Location must be at least 5 characters";
        }

        if (!formData.information.trim()) {
            newErrors.information = "Site information is required";
        } else if (formData.information.trim().length < 10) {
            newErrors.information = "Please provide more detailed information (at least 10 characters)";
        }

        if (!selectedFile) {
            newErrors.photo = "Site photo is required";
        }

        if (!captchaVerified) {
            newErrors.captcha = "Please verify that you're not a robot";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        setFormSubmitted(true);
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            // Scroll to first error
            const firstErrorField = Object.keys(validationErrors)[0];
            const element = document.querySelector(`[data-field="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }

            return;
        }

        const encryptedPayload = DataEncrypt(
            JSON.stringify({
                site_name: formData.siteName,
                location: formData.location,
                information: formData.information,
            })
        );

        const formDataToSend = new FormData();
        formDataToSend.append("photo", selectedFile);
        formDataToSend.append("data", encryptedPayload);

        try {
            setLoading(true);
            const response = await api.post("/api/sksites/a91f12c3d78b4a1f9f4d22b87d6e5c12", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const decryptedResponse = DataDecrypt(response.data.data);

            if (decryptedResponse.status === 200) {
                alert("Site added successfully");
                window.history.back();
            } else {
                setErrors({
                    ...errors,
                    submit: decryptedResponse.message || "Failed to add site"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            let errorMessage = "Failed to add site. Please try again.";
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setErrors({
                ...errors,
                submit: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    const getFieldStatus = (fieldName) => {
        const hasValue = formData[fieldName] && formData[fieldName].trim().length > 0;
        const hasError = errors[fieldName];

        if (formSubmitted) {
            if (hasError) {
                return {
                    icon: <ErrorOutlineIcon sx={{ color: '#d32f2f', fontSize: 16 }} />,
                    color: 'error'
                };
            }
            if (hasValue) {
                return {
                    icon: <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 16 }} />,
                    color: 'success'
                };
            }
        }
        return null;
    };

    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                            Add New Site
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Fill in all required fields to add a new site
                        </Typography>
                    </Box>


                </Box>

                {/* Error Alert */}
                {errors.submit && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            '& .MuiAlert-icon': {
                                alignItems: 'center'
                            }
                        }}
                        onClose={() => setErrors({ ...errors, submit: "" })}
                    >
                        {errors.submit}
                    </Alert>
                )}

                {/* Form Container */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    }}
                >
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            {/* SITE NAME */}
                            <Grid item xs={12} md={6}>
                                <Box data-field="siteName">
                                    <TextField
                                        fullWidth
                                        label="Site Name"
                                        value={formData.siteName}
                                        onChange={handleChange('siteName')}
                                        required
                                        error={!!errors.siteName}
                                        helperText={errors.siteName}
                                        InputProps={{
                                            endAdornment: getFieldStatus('siteName')?.icon
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: 'white',
                                                '&.Mui-focused': {
                                                    boxShadow: errors.siteName
                                                        ? '0 0 0 3px rgba(211, 47, 47, 0.1)'
                                                        : '0 0 0 3px rgba(102, 126, 234, 0.1)',
                                                }
                                            },
                                            '& .MuiFormHelperText-root': {
                                                ml: 0,
                                                mt: 1
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* LOCATION */}
                            <Grid item xs={12} md={6}>
                                <Box data-field="location">
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={formData.location}
                                        onChange={handleChange('location')}
                                        required
                                        error={!!errors.location}
                                        helperText={errors.location}
                                        InputProps={{
                                            endAdornment: getFieldStatus('location')?.icon
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: 'white',
                                                '&.Mui-focused': {
                                                    boxShadow: errors.location
                                                        ? '0 0 0 3px rgba(211, 47, 47, 0.1)'
                                                        : '0 0 0 3px rgba(102, 126, 234, 0.1)',
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* INFORMATION */}
                            <Grid item xs={12} md={6}>
                                <Box data-field="information">
                                    <TextField
                                        fullWidth
                                        label="Site Information"
                                        value={formData.information}
                                        onChange={handleChange('information')}
                                        multiline
                                        rows={4}
                                        required
                                        error={!!errors.information}
                                        helperText={errors.information}
                                        InputProps={{
                                            endAdornment: getFieldStatus('information')?.icon
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: 'white',
                                                '&.Mui-focused': {
                                                    boxShadow: errors.information
                                                        ? '0 0 0 3px rgba(211, 47, 47, 0.1)'
                                                        : '0 0 0 3px rgba(102, 126, 234, 0.1)',
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* FILE UPLOAD */}
                            <Grid item xs={12} md={6}>
                                <Box data-field="photo">
                                    <Box sx={{ height: '100%' }}>
                                        {/* <Typography variant="subtitle2" sx={{
                                            mb: 1,
                                            fontWeight: 600,
                                            color: errors.photo ? '#d32f2f' : 'text.primary'
                                        }}>
                                            Site Photo *
                                        </Typography> */}

                                        <Box
                                            sx={{
                                                border: `2px dashed ${errors.photo ? '#d32f2f' : '#c4c4c4'}`,
                                                borderRadius: 2,
                                                p: 3,
                                                height: 'calc(100% - 32px)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 2,
                                                backgroundColor: 'white',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: errors.photo ? '#d32f2f' : '#667eea',
                                                    backgroundColor: errors.photo
                                                        ? 'rgba(211, 47, 47, 0.02)'
                                                        : 'rgba(102, 126, 234, 0.02)'
                                                }
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                                id="site-photo-upload"
                                            />
                                            <label htmlFor="site-photo-upload" style={{ cursor: 'pointer' }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <CloudUploadIcon sx={{
                                                        fontSize: 40,
                                                        color: errors.photo ? '#d32f2f' : '#667eea',
                                                        opacity: selectedFile ? 0.7 : 1
                                                    }} />
                                                    <Typography
                                                        variant="body2"
                                                        color={errors.photo ? "error" : "text.secondary"}
                                                        sx={{ textAlign: 'center' }}
                                                    >
                                                        {selectedFile ? 'Change photo' : 'Click to upload site photo'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Max size: 5MB • JPG, PNG, GIF
                                                    </Typography>
                                                </Box>
                                            </label>

                                            {selectedFile && (
                                                <Box sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                        p: 1.5,
                                                        borderRadius: 1,
                                                        width: '100%',
                                                        maxWidth: 300
                                                    }}>
                                                        <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
                                                        <Typography variant="body2" sx={{ flex: 1 }}>
                                                            {selectedFile.name}
                                                        </Typography>
                                                        <Chip
                                                            label="Remove"
                                                            size="small"
                                                            onClick={handleRemoveFile}
                                                            sx={{
                                                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                                color: '#d32f2f',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(211, 47, 47, 0.2)',
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {errors.photo && (
                                            <FormHelperText error sx={{ ml: 0, mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ErrorOutlineIcon sx={{ fontSize: 16 }} />
                                                    {errors.photo}
                                                </Box>
                                            </FormHelperText>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* CAPTCHA */}
                            <Grid item xs={12}>
                                <Box data-field="captcha">
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: errors.captcha ? 'rgba(211, 47, 47, 0.05)' : 'transparent',
                                        border: errors.captcha ? '1px solid rgba(211, 47, 47, 0.3)' : 'none'
                                    }}>
                                        <ReCAPTCHA
                                            sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                                            onChange={() => {
                                                setCaptchaVerified(true);
                                                if (errors.captcha) {
                                                    setErrors({ ...errors, captcha: "" });
                                                }
                                            }}
                                            onExpired={() => {
                                                setCaptchaVerified(false);
                                            }}
                                        />
                                        {errors.captcha && (
                                            <FormHelperText error sx={{ ml: 0, mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ErrorOutlineIcon sx={{ fontSize: 16 }} />
                                                    {errors.captcha}
                                                </Box>
                                            </FormHelperText>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Footer with Submit Button for Mobile */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid rgba(0,0,0,0.1)',
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 5,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                    },
                                }}
                            >
                                {loading ? "Adding Site..." : "Add Site"}
                            </Button>
                        </Box>

                    </Box>
                </Paper>

            </Box>
        </Layout>
    );
};

export default AddNewSite;