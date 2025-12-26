// components/AddVendorForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from '../../utils/api'; // Adjust the import path as necessary
import { callAlert } from '../../redux/actions/alert';
import { useDispatch } from 'react-redux';

const AddVendorForm = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        service_name: '',
        service_url: '',
        callback_url: '',
        status_code: '',
        error_message: '',
        priority: 1,
        status: 1,
        executable_fun: '',
        short_name: '',
        is_cashback: 1,
        operator_ids: ''
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/api/setting/add-vendor', formData);
            if (response) {
                alert('added successfully');
                window.history.back();
            } 
        } catch (error) {
            dispatch(callAlert({ message: error?.response?.data?.error || error.message, type: 'FAILED' }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Service Name"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Service URL"
                        name="service_url"
                        value={formData.service_url}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Callback URL"
                        name="callback_url"
                        value={formData.callback_url}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Status Code"
                        name="status_code"
                        value={formData.status_code}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Error Message"
                        name="error_message"
                        value={formData.error_message}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Priority"
                        name="priority"
                        type="number"
                        value={formData.priority}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Executable Function"
                        name="executable_fun"
                        value={formData.executable_fun}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Short Name"
                        name="short_name"
                        value={formData.short_name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Is Cashback"
                        name="is_cashback"
                        type="number"
                        value={formData.is_cashback}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Operator IDs"
                        name="operator_ids"
                        value={formData.operator_ids}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add Vendor
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVendorForm;
