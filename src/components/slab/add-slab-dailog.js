import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import api from '../../utils/api';

const AddSlabDialog = ({ open, onClose, onSlabAdded }) => {
  const [slabName, setSlabName] = useState('');
  const [intervalDays, setIntervalDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSlab = async () => {
    if (!slabName.trim()) {
      setError('Slab name is required');
      return;
    }

    if (intervalDays <= 0) {
      setError('Interval days must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/slab/add-slab', {
        name: slabName.trim(),
        interval_days: intervalDays
      });

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setSlabName('');
        setIntervalDays(7);
        setError('');
        
        // Notify parent component
        if (onSlabAdded) {
          onSlabAdded(response.data);
        }
        
        // Close dialog
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add slab');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSlabName('');
    setIntervalDays(7);
    setError('');
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Slab</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Slab Name"
            fullWidth
            value={slabName}
            onChange={(e) => setSlabName(e.target.value)}
            placeholder="Enter slab name"
            disabled={loading}
          />
          
          <TextField
            margin="dense"
            label="Interval Days"
            type="number"
            fullWidth
            value={intervalDays}
            onChange={(e) => setIntervalDays(parseInt(e.target.value) || 0)}
            inputProps={{ min: 1 }}
            disabled={loading}
            helperText="Number of days between intervals"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleAddSlab} 
          variant="contained" 
          color="primary"
          disabled={loading || !slabName.trim()}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSlabDialog;