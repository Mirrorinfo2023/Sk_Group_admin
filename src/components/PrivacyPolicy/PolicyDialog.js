"use client"
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    CircularProgress,Typography
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const PolicyDialog = ({ open, onClose, onSave, policy, categories, loading = false }) => {
    const [formData, setFormData] = useState({
        category_id: '',
        content: '',
        status: 1
    });
    const [errors, setErrors] = useState({});
    const [saveError, setSaveError] = useState('');

    // Initialize form when policy changes or dialog opens
    useEffect(() => {
        if (policy) {
            setFormData({
                category_id: policy.category_id || '',
                content: policy.content || '',
                status: policy.status || 1
            });
        } else {
            setFormData({
                category_id: '',
                content: '',
                status: 1
            });
        }
        setErrors({});
        setSaveError('');
    }, [policy, open]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.category_id) {
            newErrors.category_id = 'Please select a category';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await onSave(formData);
            handleClose();
        } catch (error) {
            setSaveError(error.message || 'Failed to save policy');
        }
    };

    const handleClose = () => {
        setErrors({});
        setSaveError('');
        onClose();
    };

    const handleContentChange = (e) => {
        const content = e.target.value;
        setFormData(prev => ({ ...prev, content }));

        // Clear error if content is added
        if (errors.content && content.trim()) {
            setErrors(prev => ({ ...prev, content: '' }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minHeight: '60vh'
                }
            }}
        >
            <DialogTitle sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600
            }}>
                {policy ? 'Edit Policy' : 'Add New Policy'}
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {saveError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {saveError}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    {/* Category Selection */}
                    <FormControl fullWidth error={!!errors.category_id}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                            value={formData.category_id}
                            label="Category *"
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <MenuItem value="">
                                <em>Select a category</em>
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.category_name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.category_id && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {errors.category_id}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Status Selection */}
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status}
                            label="Status"
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={2}>Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Content Editor */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Content *
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={12}
                            value={formData.content}
                            onChange={handleContentChange}
                            error={!!errors.content}
                            helperText={errors.content || "Enter policy content (HTML supported)"}
                            variant="outlined"
                            placeholder="Enter policy content here..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                            Tip: You can use HTML tags for formatting (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;)
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    startIcon={<Cancel />}
                    variant="outlined"
                    sx={{ px: 3 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    variant="contained"
                    sx={{
                        px: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }
                    }}
                >
                    {loading ? 'Saving...' : (policy ? 'Update' : 'Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PolicyDialog;