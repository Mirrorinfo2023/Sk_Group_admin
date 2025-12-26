"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Snackbar,
  Alert,
  TablePagination,
  Modal,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { styled } from "@mui/material/styles";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";

const HiddenInput = styled("input")({
  display: "none",
});

// Styled Components
const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 24px 0 rgba(33,150,243,0.08)',
  marginTop: 16,
  marginBottom: 16,
  overflowX: 'auto',
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
  background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  padding: '8px 12px',
  borderRight: '1px solid rgba(255,255,255,0.3)',
  letterSpacing: 1,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  '&:last-child': {
    borderRight: 'none',
  }
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: 'linear-gradient(90deg, #f5faff 0%, #f0f8ff 100%)'
  },
  transition: 'all 0.2s ease-in-out',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 12,
  padding: '8px 12px',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  whiteSpace: 'nowrap',
  '&:last-child': {
    borderRight: 'none',
  }
}));

const NoRecordsBox = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f44336',
  fontWeight: 600,
  fontSize: 18,
  padding: '32px 0',
  width: '100%',
  gap: 8,
});

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '.MuiTablePagination-select': {
    color: '#2196f3',
    fontWeight: 600,
    paddingRight: '24px'
  },
  '.MuiTablePagination-selectLabel': {
    color: '#666',
    fontWeight: 500
  },
  '.MuiTablePagination-displayedRows': {
    color: '#666',
    fontWeight: 500
  },
  '.MuiTablePagination-actions .MuiIconButton-root': {
    color: '#2196f3'
  },
  borderTop: '1px solid rgba(224, 224, 224, 1)',
}));

const PrimeButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4caf50 0%, #66bb6a 100%)',
  color: 'white',
  fontWeight: 600,
  fontSize: 12,
  padding: '6px 16px',
  borderRadius: 8,
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #43a047 0%, #57a657 100%)',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
    transform: 'translateY(-1px)',
  },
}));

const PasteArea = styled(Paper)(({ theme }) => ({
  border: '2px dashed #2196f3',
  borderRadius: 8,
  padding: 20,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(33, 150, 243, 0.04)',
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderColor: '#1976d2',
  },
}));

const ImagePreview = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  margin: 4,
});

export default function PrimeUserManagement() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPrimeDialog, setOpenPrimeDialog] = useState(false);

  // Prime form fields
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [utrIds, setUtrIds] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar for success message
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const pasteAreaRef = useRef(null);
  const uid = Cookies.get("uid");
  const dispatch = useDispatch();

  // Debug useEffect
  useEffect(() => {
    console.log("🔄 USERS STATE UPDATED - Length:", users.length);
    console.log("📊 USERS DATA:", users);
  }, [users]);

  useEffect(() => {
    console.log("🔄 ALL USERS STATE UPDATED - Length:", allUsers.length);
  }, [allUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Add paste event listener when dialog is open
    if (openPrimeDialog) {
      const handlePaste = (event) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (let item of items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              handleAddImage(file);
            }
          }
        }
      };

      document.addEventListener('paste', handlePaste);
      return () => {
        document.removeEventListener('paste', handlePaste);
      };
    }
  }, [openPrimeDialog]);

  // ✅ SIMPLIFIED AND FIXED API CALL
  const fetchUsers = async () => {
    try {
      console.log("🔄 fetchUsers function called");

      const today = new Date();
      const toDate = today.toISOString().split("T")[0];

      const reqData = {
        from_date: "2024-01-01",
        to_date: toDate,
      };

      console.log("📤 Request Data:", reqData);

      // Encrypt the request
      const encryptedPayload = {
        data: DataEncrypt(JSON.stringify(reqData))
      };

      // Make API call
      const response = await api.post("/api/report/70b12e5fc4d4c51474b2b32706b248af89fce3d4", encryptedPayload);

      console.log("✅ API Response Status:", response.status);
      console.log("📥 Response Data:", response.data);

      // Check if response has data
      if (response.data?.data) {
        console.log("🔑 Encrypted data received");

        // 🔓 FIXED: DataDecrypt already returns parsed object
        const decryptedResult = DataDecrypt(response.data.data);
        console.log("🔓 Decrypted Result:", decryptedResult);
        console.log("🔓 Decrypted Result Type:", typeof decryptedResult);

        // ✅ Check if it's already an object (not string)
        if (typeof decryptedResult === 'object' && decryptedResult !== null) {
          console.log("✅ Already an object, no need to parse JSON");

          if (decryptedResult.status === 200 && Array.isArray(decryptedResult.data)) {
            console.log("🎯 Setting state with", decryptedResult.data.length, "users");
            console.log("📊 First user:", decryptedResult.data[0]);

            // Set the state
            setUsers(decryptedResult.data);
            setAllUsers(decryptedResult.data);

            dispatch(
              callAlert({
                message: `Successfully loaded ${decryptedResult.data.length} users`,
                type: "SUCCESS",
              })
            );
          } else {
            console.error("❌ Invalid data structure:", decryptedResult);
            setUsers([]);
            setAllUsers([]);
          }
        }
        // If it's a string, then parse it
        else if (typeof decryptedResult === 'string') {
          console.log("📝 Decrypted result is string, parsing JSON...");
          try {
            const parsedResult = JSON.parse(decryptedResult);
            console.log("📋 Parsed Result:", parsedResult);

            if (parsedResult.status === 200 && Array.isArray(parsedResult.data)) {
              console.log("🎯 Setting state with", parsedResult.data.length, "users");
              setUsers(parsedResult.data);
              setAllUsers(parsedResult.data);

              dispatch(
                callAlert({
                  message: `Successfully loaded ${parsedResult.data.length} users`,
                  type: "SUCCESS",
                })
              );
            }
          } catch (parseError) {
            console.error("❌ JSON Parse Error:", parseError);
            setUsers([]);
            setAllUsers([]);
          }
        } else {
          console.error("❌ Unexpected decrypted result type:", typeof decryptedResult);
          setUsers([]);
          setAllUsers([]);
        }
      } else {
        console.warn("⚠️ No data in response");
        setUsers([]);
        setAllUsers([]);
      }
    } catch (error) {
      console.error("❌ Error in fetchUsers:", error);
      setUsers([]);
      setAllUsers([]);

      dispatch(
        callAlert({
          message: "Failed to fetch users",
          type: "FAILED",
        })
      );
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setUsers(allUsers);
      return;
    }

    const filtered = Array.isArray(allUsers) ? allUsers.filter((u) => {
      const mlmIdStr = u?.mlm_id ? u.mlm_id.toString().trim().toLowerCase() : '';
      return (
        (u?.first_name?.toLowerCase() || '').includes(term) ||
        (u?.last_name?.toLowerCase() || '').includes(term) ||
        mlmIdStr.includes(term) ||
        (u?.mobile?.toString() || '').includes(term)
      );
    }) : [];


    setUsers(filtered);
    setPage(0);
  };

  const handlePrimeClick = (user) => {
    setSelectedUser(user);
    setOpenPrimeDialog(true);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => handleAddImage(file));
  };

  const handleAddImage = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      dispatch(
        callAlert({
          message: "Please select only image files",
          type: "FAILED",
        })
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        callAlert({
          message: "Image size should be less than 5MB",
          type: "FAILED",
        })
      );
      return;
    }

    setSelectedImages(prev => [...prev, file]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePasteClick = () => {
    dispatch(
      callAlert({
        message: "Now you can paste images (Ctrl+V) anywhere on the page",
        type: "SUCCESS",
      })
    );
  };

  const handleSubmitPrime = async () => {
    if (!selectedUser) return;

    const formData = new FormData();
    formData.append("user_id", selectedUser.id);
    formData.append("sender_user_id", selectedUser.id);
    formData.append("plan_id", "3");
    formData.append("amount", amount);
    formData.append("remark", remark);
    formData.append(
      "utr_id",
      JSON.stringify(utrIds.split(",").map((u) => u.trim()))
    );
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await api.post("/api/70b12e5fc4d4c51474b2b32706b248af89fce000", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        dispatch(
          callAlert({
            message: "Prime request submitted successfully",
            type: "SUCCESS",
          })
        );
        setOpenPrimeDialog(false);
        setOpenSnackbar(true);
        setAmount("");
        setRemark("");
        setUtrIds("");
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Prime API error:", error);
      dispatch(
        callAlert({
          message: "Failed to submit Prime request",
          type: "FAILED",
        })
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = Array.isArray(users)
    ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
      >
        Prime User Management
      </Typography>

      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          onClick={fetchUsers}
          sx={{ mb: 2 }}
        >
          Refresh Users
        </Button>

        <Typography variant="body2" color="text.secondary">
          Total Users: {users.length}
        </Typography>
      </Box>

      {/* Debug Info */}
      <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
        <Typography variant="caption">
          Debug: Users: {users.length} | All Users: {allUsers.length} | Paginated: {paginatedUsers.length}
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid #ddd",
          borderRadius: 2,
        }}
        elevation={0}
      >
        <SearchIcon sx={{ color: "text.secondary" }} />
        <TextField
          placeholder="Search by name, ID, or mobile..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={() => { setSearchTerm(""); setUsers(allUsers); }}>
          Clear
        </Button>
      </Paper>

      <ThemedTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <ThemedTableHeadCell sx={{ width: "80px" }}>
                SR No.
              </ThemedTableHeadCell>
              <ThemedTableHeadCell>User ID</ThemedTableHeadCell>
              <ThemedTableHeadCell>Name</ThemedTableHeadCell>
              <ThemedTableHeadCell>Email</ThemedTableHeadCell>
              <ThemedTableHeadCell>Mobile</ThemedTableHeadCell>
              <ThemedTableHeadCell>Referral</ThemedTableHeadCell>
              <ThemedTableHeadCell align="right">
                Action
              </ThemedTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(paginatedUsers) && paginatedUsers.length > 0 ? (
              paginatedUsers.map((u, index) => (
                <ThemedTableRow key={u?.id || u?.mlm_id || index}>
                  <StyledTableCell sx={{ fontWeight: 600, color: '#2196f3' }}>
                    {(page * rowsPerPage) + index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        fontFamily: 'monospace'
                      }}
                    >
                      {u?.mlm_id || 'N/A'}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {u?.first_name || ''} {u?.last_name || ''}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {u?.email || 'N/A'}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body2">
                      {u?.mobile || 'N/A'}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: u?.ref_first_name && u?.ref_first_name !== '-' ? '#4caf50' : '#999',
                        fontWeight: u?.ref_first_name && u?.ref_first_name !== '-' ? 600 : 400
                      }}
                    >
                      {u?.ref_first_name || "-"}{" "}{u?.ref_last_name || ""}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <PrimeButton
                      size="small"
                      onClick={() => handlePrimeClick(u)}
                    >
                      Add Prime
                    </PrimeButton>
                  </StyledTableCell>
                </ThemedTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ border: 'none' }}>
                  <NoRecordsBox>
                    <WarningIcon />
                    {Array.isArray(users) && users.length === 0 ? "No users available" : "No matching users found"}
                  </NoRecordsBox>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {Array.isArray(users) && users.length > 0 && (
          <StyledTablePagination
            rowsPerPageOptions={[10, 25, 50, 100, 250, 500, 1000]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </ThemedTableContainer>

      {/* Prime Request Dialog */}
      <Dialog
        open={openPrimeDialog}
        onClose={() => setOpenPrimeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Submit Prime Request</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.email} • {selectedUser.mobile}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                margin="dense"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remark"
                margin="dense"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UTR IDs (comma separated)"
                margin="dense"
                value={utrIds}
                onChange={(e) => setUtrIds(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1 }}>Upload Images</InputLabel>

              {/* Paste Area */}
              <PasteArea
                ref={pasteAreaRef}
                onClick={handlePasteClick}
                sx={{ mb: 2 }}
              >
                <ContentPasteIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  Paste Image Here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here and press Ctrl+V to paste images from clipboard
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  or use the file upload below
                </Typography>
              </PasteArea>

              {/* File Upload */}
              <label htmlFor="upload-images">
                <HiddenInput
                  accept="image/*"
                  id="upload-images"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  component="span"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Choose Files
                </Button>
              </label>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Selected Images ({selectedImages.length})
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedImages.map((file, index) => (
                      <Grid item key={index}>
                        <ImagePreview>
                          <Chip
                            label={file.name}
                            onDelete={() => handleRemoveImage(index)}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                            color="primary"
                          />
                        </ImagePreview>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrimeDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPrime}
            disabled={!amount || !remark}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Prime request added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}