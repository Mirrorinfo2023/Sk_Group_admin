import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '120px',
  padding: '12px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '16px',
  fontFamily: 'inherit',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
  },
}));

const AddPageTransactions = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const formData = {
        title: title,
        content: content,
      };
      const response = await api.post("/api/page/add-page", formData);

      if (response) {
        window.history.back();
        alert("Pages Added successfully");
      } else {
        console.error("Failed to upload Page");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
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
                Add New Page
              </Typography>
            </Box>

            <Box sx={{ padding: '24px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Page Name"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextarea
                    placeholder="Enter your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
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

export default AddPageTransactions;
