import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 10,
});

const AddPackages = () => {
    const [package_name, setPackageName] = useState('');
    const [package_amount, setPackageAmount] = useState('');
    const [package_details, setPackageDetails] = useState('');
    const [gst, setGst] = useState('');
    const [without_gst, setWithoutGst] = useState('');
    const [status, setStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!package_name || !package_amount || !package_details || !gst || !without_gst || !status) {
            alert("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('package_name', package_name);
        formData.append('package_amount', package_amount);
        formData.append('package_details', package_details);
        formData.append('gst', gst);
        formData.append('without_gst', without_gst);
        formData.append('status', status);

        setLoading(true);

        try {
            const response = await api.post('/api/package/fcf270b419b51742e676be61ce846f5bcba40329', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('Package added successfully');
                // Optionally reset the form here
                // Reset fields
                setPackageName('');
                setPackageAmount('');
                setPackageDetails('');
                setGst('');
                setWithoutGst('');
                setStatus('');
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Error uploading package:', error);
            alert('Failed to add package. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box display='inline-block' justifyContent='space-between' alignItems='right' mt={1} mb={1} sx={{ width: '30%' }}>
                            <Typography variant="h5" sx={{ padding: 2 }}>Add New Package</Typography>
                        </Box>

                        <Grid spacing={2} sx={{ padding: 2 }} container>
                            {['Package Name', 'Package Amount', 'Package Details', 'GST', 'Without GST', 'Status'].map((label, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <TextField
                                        required
                                        fullWidth
                                        label={label}
                                        variant="outlined"
                                        value={
                                            label === 'Package Name' ? package_name :
                                            label === 'Package Amount' ? package_amount :
                                            label === 'Package Details' ? package_details :
                                            label === 'GST' ? gst :
                                            label === 'Without GST' ? without_gst :
                                            status
                                        }
                                        onChange={(e) => {
                                            if (label === 'Package Name') setPackageName(e.target.value);
                                            else if (label === 'Package Amount') setPackageAmount(e.target.value);
                                            else if (label === 'Package Details') setPackageDetails(e.target.value);
                                            else if (label === 'GST') setGst(e.target.value);
                                            else if (label === 'Without GST') setWithoutGst(e.target.value);
                                            else if (label === 'Status') setStatus(e.target.value);
                                        }}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                        Upload file
                                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                    </Button>
                                    {selectedFile && (
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            {selectedFile.name}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" mr={2} mt={1}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </main>
    );
};

export default AddPackages;
