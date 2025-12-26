// components/AddVendorForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, getStackUtilityClass } from '@mui/material';
import api from '../../../utils/api'; // Adjust the import path as necessary
import { callAlert } from '../../../redux/actions/alert';
import { useDispatch } from 'react-redux';

const AddPackage = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        package_name: '',
        package_amount: '',
        gst: '',
        without_gst: '',
        status: '',
        image: '',
       
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/api/package/fcf270b419b51742e676be61ce846f5bcba40329', formData);
            if (response.status === 200) {
                dispatch(callAlert({ type: 'SUCCESS', message: 'Package added successfully' }));
                onClose(); // Close the form after successful submission
            }
        } catch (error) {
            dispatch(callAlert({ type: 'FAILED', message: error?.response?.data?.error || error.message }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md" // or any other size you prefer
            PaperProps={{
                sx: {
                    width: '50%', // Ensures the dialog takes full width
                maxWidth: '50%', // Optional: Set maximum width to 100%
                }
            }}
        >
            <DialogTitle>Add New Package</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Package name"
                        name="package_name"
                        value={formData.package_name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Package amount"
                        name="package_amount"
                        value={formData.package_amount}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="gst"
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="without gst"
                        name="without_gst"
                        value={formData.without_gst}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="image"
                        name="image"
                       
                        value={formData.image}
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
                    Add Package
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPackage;
