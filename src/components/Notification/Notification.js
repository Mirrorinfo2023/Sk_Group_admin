import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react"; // Add useEffect import
import * as React from "react";
import Link from "next/link";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../../utils/api";

const NotificationTransactions = ({ showServiceTrans }) => {
  // Initialize rows with loading state
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    title: "",
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    data: null,
  });

  // FIX: Initialize rows when showServiceTrans changes
  useEffect(() => {
    if (showServiceTrans && showServiceTrans.length > 0) {
      setRows(
        showServiceTrans.map(row => ({
          ...row,
          isLoading: false,
          isDeleting: false
        }))
      );
    } else {
      setRows([]);
    }
  }, [showServiceTrans]); // This runs whenever showServiceTrans changes

  // Filter rows based on search
  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    return (
      row.title?.toLowerCase().includes(term) ||
      row.body?.toLowerCase().includes(term) ||
      row.app_name?.toLowerCase().includes(term) ||
      row.notification_type?.toLowerCase().includes(term)
    );
  });


  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper function to set loading state
  const setRowLoading = (id, value) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, isLoading: value } : row
    ));
  };

  // ============ API HANDLERS ============

  // Edit Handler
  const handleEdit = (row) => {
    setEditDialog({
      open: true,
      data: { ...row }
    });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.data) return;

    const { id, title, body, image, app_id, type_id } = editDialog.data;

    try {
      setRowLoading(id, true);

      const response = await api.post(
        "/api/notification/a34637968c76992fdbb2911b6025e15e24rd555d",
        {
          id,
          title,
          body,
          image,
          app_id,   // ✅ backend key
          type_id   // ✅ backend key
        }
      );

      if (response.data.status === 200) {
        const updated = response.data.data;

        setRows(prev =>
          prev.map(row =>
            row.id === id
              ? { ...row, ...updated, isLoading: false }
              : row
          )
        );

        setSnackbar({
          open: true,
          message: "Notification updated successfully!",
          severity: "success"
        });

        setEditDialog({ open: false, data: null });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Update failed",
        severity: "error"
      });
    } finally {
      setRowLoading(id, false);
    }
  };



  // Delete Handler
  const handleDeleteClick = (id, title) => {
    setDeleteDialog({
      open: true,
      id: id,
      title: title,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setRowLoading(deleteDialog.id, true);

      // API call to delete using axios
      const response = await api.post("/api/notification/a34637968c76992fdbb2911b6025e15e24r76890", {
        id: deleteDialog.id
      });

      if (response.data.status === 200) {
        // Remove from local state
        setRows(prev => prev.filter(row => row.id !== deleteDialog.id));

        setSnackbar({
          open: true,
          message: "Notification deleted successfully!",
          severity: "success"
        });
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete notification",
        severity: "error"
      });
    } finally {
      setDeleteDialog({ open: false, id: null, title: "" });
      if (deleteDialog.id) {
        setRowLoading(deleteDialog.id, false);
      }
    }
  };

  // Status Toggle Handler
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setRowLoading(id, true);

      const newStatus = currentStatus === 1 ? 0 : 1;

      // API call to update status using axios
      const response = await api.post("/api/notification/a34637968c76992fdbb2911b6025e15e24r6678d", {
        id: id,
        status: newStatus
      });

      if (response.data.status === 200) {
        // Update local state
        setRows(prev => prev.map(row =>
          row.id === id ? { ...row, status: newStatus, isLoading: false } : row
        ));

        setSnackbar({
          open: true,
          message: `Notification ${newStatus === 1 ? "activated" : "deactivated"}!`,
          severity: "success"
        });
      } else {
        throw new Error(response.data.message || "Status update failed");
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update status",
        severity: "error"
      });
      setRowLoading(id, false);
    }
  };

  // Reshoot Handler
  const handleReshoot = async (id) => {
    try {
      setRowLoading(id, true);

      // API call to reshoot using axios
      const response = await api.post("/api/notification/reshoot", {
        id: id
      });

      if (response.data.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.message || "Notification reshoot initiated!",
          severity: "success"
        });
      } else {
        throw new Error(response.data.message || "Reshoot failed");
      }
    } catch (error) {
      console.error("Reshoot error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to reshoot notification",
        severity: "error"
      });
    } finally {
      setRowLoading(id, false);
    }
  };

  // Image Handler
  const handleLinkClick = (img) => {
    if (img) {
      window.open(img, "_blank", "noopener,noreferrer");
    } else {
      setSnackbar({
        open: true,
        message: "No image available",
        severity: "warning"
      });
    }
  };

  // Snackbar Handler
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Edit Dialog Handlers
  const handleEditInputChange = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  // ============ STYLED COMPONENTS ============
  const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    ".MuiTablePagination-select": {
      color: "#2196f3",
      fontWeight: 600,
      paddingRight: "24px",
    },
    ".MuiTablePagination-selectLabel": {
      color: "#666",
      fontWeight: 500,
    },
    ".MuiTablePagination-displayedRows": {
      color: "#666",
      fontWeight: 500,
    },
    ".MuiTablePagination-actions": {
      ".MuiIconButton-root": {
        color: "#2196f3",
        "&:hover": {
          backgroundColor: "rgba(33, 150, 243, 0.08)",
        },
        "&.Mui-disabled": {
          color: "#ccc",
        },
      },
    },
    ".MuiTablePagination-selectIcon": {
      color: "#2196f3",
    },
    ".MuiTablePagination-menuItem": {
      padding: "4px 16px",
    },
    ".MuiTablePagination-selectRoot": {
      marginRight: "32px",
    },
    ".MuiTablePagination-toolbar": {
      minHeight: "52px",
      padding: "0 16px",
      flexWrap: "wrap",
      gap: "4px",
    },
    ".MuiTablePagination-spacer": {
      flex: "none",
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 12,
      textTransform: "uppercase",
      padding: "8px 8px",
      borderRight: "1px solid #e3e3e3",
      whiteSpace: "nowrap",
      letterSpacing: 1,
      "&:last-child": {
        borderRight: "1px solid #e3e3e3",
      },
    },
    "&:first-of-type": {
      borderTopLeftRadius: 6,
    },
    "&:last-of-type": {
      borderTopRightRadius: 6,
      borderRight: "1px solid #e3e3e3",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "8px 8px",
      borderRight: "1px solid #e3e3e3",
      "&:last-child": {
        borderRight: "1px solid #e3e3e3",
      },
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const rowsPerPageOptions = [5, 10, 25, 50];

  return (
    <main className="p-6 space-y-6">
      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search notifications..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Divider />
            <Table aria-label="User Transaction Summary Table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    App Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Notification Type
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Title
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Body
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Status
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Actions
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  (rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows
                  ).map((row, index) => (
                    <StyledTableRow
                      key={row.id || index} // Use row.id if available
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>{row.app_name || "N/A"}</StyledTableCell>
                      <StyledTableCell>{row.notification_type || "N/A"}</StyledTableCell>
                      <StyledTableCell>{row.title || "N/A"}</StyledTableCell>
                      <StyledTableCell>
                        {row.body && row.body.length > 50 ? `${row.body.substring(0, 50)}...` : row.body || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.image ? (
                          <Link href="#" onClick={() => handleLinkClick(row.image)} style={{ textDecoration: 'none' }}>
                            View Image
                          </Link>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            No Image
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{row.created_on || "N/A"}</StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          backgroundColor: row.status === 1 ? '#e8f5e9' : '#fff3e0',
                          color: row.status === 1 ? '#2e7d32' : '#f57c00',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}>
                          {row.status === 1 ? "Active" : "Inactive"}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell sx={{ "& button": { m: 0.5 }, minWidth: '200px' }}>
                        {/* Edit Button */}
                        <Tooltip title="Edit Notification">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(row)}
                            disabled={row.isLoading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete Notification">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(row.id, row.title)}
                            disabled={row.isLoading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* Status Toggle Button */}
                        <Tooltip title={row.status === 1 ? "Deactivate" : "Activate"}>
                          <IconButton
                            size="small"
                            color={row.status === 1 ? "success" : "default"}
                            onClick={() => handleStatusToggle(row.id, row.status)}
                            disabled={row.isLoading}
                          >
                            {row.status === 1 ? (
                              <ToggleOnIcon fontSize="small" />
                            ) : (
                              <ToggleOffIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>

                        {/* Reshoot Button */}
                        {/* <Tooltip title="Reshoot Notification">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleReshoot(row.id)}
                            disabled={row.isLoading}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> */}

                        {/* Loading indicator */}
                        {row.isLoading && (
                          <CircularProgress size={16} sx={{ ml: 1 }} />
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      style={{
                        height: 120,
                        width: "100%",
                        background: "#fff",
                        border: "none",
                      }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <InfoOutlinedIcon
                          sx={{ color: "#F44336", fontSize: 36, mb: 1 }}
                        />
                        <Typography
                          color="#F44336"
                          fontWeight="bold"
                          fontSize={18}
                        >
                          {rows.length === 0 ? "Loading..." : "No Records Found."}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <StyledTablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              marginTop: "32px",
              borderTop: "1px solid #e0e0e0",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "0 0 16px 16px",
              "& .MuiTablePagination-select": {
                minWidth: "80px",
              },
              "& .MuiTablePagination-menu": {
                "& .MuiPaper-root": {
                  maxHeight: "200px",
                },
              },
              "& .MuiTablePagination-selectRoot": {
                marginRight: "32px",
              },
              "& .MuiTablePagination-toolbar": {
                minHeight: "52px",
              },
              "& .MuiTablePagination-spacer": {
                flex: "none",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, title: "" })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the notification {deleteDialog.title}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, title: "" })}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Notification</DialogTitle>
        <DialogContent>
          {editDialog.data && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="App Name"
                value={editDialog.data.app_name || ''}
                onChange={(e) => handleEditInputChange('app_name', e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Notification Type"
                value={editDialog.data.notification_type || ''}
                onChange={(e) => handleEditInputChange('notification_type', e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Title"
                value={editDialog.data.title || ''}
                onChange={(e) => handleEditInputChange('title', e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Body"
                value={editDialog.data.body || ''}
                onChange={(e) => handleEditInputChange('body', e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                margin="dense"
              />
              <TextField
                label="Image URL"
                value={editDialog.data.image || ''}
                onChange={(e) => handleEditInputChange('image', e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, data: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="primary"
            variant="contained"
            disabled={!editDialog.data}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default NotificationTransactions;