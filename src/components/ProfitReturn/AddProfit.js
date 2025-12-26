import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as React from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
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

const AddBannersTransactions = () => {
  const [title, setTitle] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appCategories, setAppCategories] = useState([]);
  const [appType, setAppType] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/banner/66a815be731fee133d7ecc8f240447c14e770b83");
        if (response.status === 200) {
          setAppCategories(response.data.data.notificationApp);
          setCategories(response.data.data.sCategory);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange1 = (event) => {
    setAppType(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = {
      'img': selectedFile,
      'title': title,
      'categoryId': transactionType,
      'app_id': appType
    };

    try {
      const response = await api.post('/api/banner/848c9e6b17fd0bab24254d057a09a88e8db32bcc', formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });

      if (response) {
        window.history.back();
        alert('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                padding: '24px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}
              >
                Add New Banner
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="app-type-label">App Type</InputLabel>
                    <Select
                      labelId="app-type-label"
                      id="app-type"
                      value={appType}
                      label="App Type"
                      onChange={handleChange1}
                      sx={{
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {appCategories.map((appType) => (
                        <MenuItem key={appType.id} value={appType.id}>
                          {appType.app_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="banner-category-label">Banner Category</InputLabel>
                    <Select
                      labelId="banner-category-label"
                      id="banner-category"
                      value={transactionType}
                      label="Banner Category"
                      onChange={handleChange}
                      sx={{
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {(categories || []).map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      Upload Image
                      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                    </Button>
                    {selectedFile && (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Selected: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddBannersTransactions;