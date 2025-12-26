import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  TableContainer,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import * as React from "react";

const AddRoleTransactions = () => {
  const [role, setRole] = useState("");
  const handleCancel = async () => {
    window.history.back();
  };
  const handleSubmit = async () => {
    const formData = {
      role_name: role,
    };

    try {
      const response = await api.post("/api/employee/add-role", formData);

      if (response) {
        window.history.back();
        alert("Role Created successfully");
      } else {
        console.error("Failed to save");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
                Add New Role
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Role Name"
                    variant="outlined"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleCancel}
                      sx={{
                        ml: 2,
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
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

export default AddRoleTransactions;

    