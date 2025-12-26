"use client";
import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Link from "next/link";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px 0 rgba(33,150,243,0.08)",
  marginTop: 16,
  marginBottom: 16,
  overflowX: "auto",
  [theme.breakpoints.down("sm")]: {
    boxShadow: "none",
    borderRadius: 8,
  },
}));

const ThemedTableHeadCell = styled(TableCell)({
  background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: 10,
  whiteSpace: "nowrap",
});

const ThemedTableRow = styled(TableRow)({
  "&:hover": { background: "#f5faff" },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const OffersTransactions = ({ showOfferTrans = [], onActionComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialog, setEditDialog] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // 🟦 OPEN EDIT DIALOG
  const handleEditOpen = (offer) => {
    setEditDialog({ ...offer });
  };

  // 🟢 SAVE EDIT CHANGES
  const handleEditSave = async () => {
    try {
      if (!editDialog.title || !editDialog.description) {
        setSnackbar({ open: true, message: "Please fill all required fields", severity: "warning" });
        return;
      }

      const encrypted = DataEncrypt(
        JSON.stringify({
          offer_id: editDialog.id,
          title: editDialog.title,
          description: editDialog.description,
          image: editDialog.image,
          status: editDialog.status,
          start_date: editDialog.start_date,
          end_date: editDialog.end_date,
        })
      );

      const res = await api.post("/api/admin/4euuuuu7986b40e5018b04a71c7df2e04893f789", { data: encrypted });
      const decrypted = DataDecrypt(res.data.data);

      setSnackbar({
        open: true,
        message: decrypted.message || "Offer updated successfully!",
        severity: "success",
      });
      setEditDialog(null);
      onActionComplete ? onActionComplete() : window.location.reload();
    } catch (err) {
      setSnackbar({ open: true, message: `Error updating offer: ${err.message}`, severity: "error" });
    }
  };

  // 🟠 TOGGLE OFFER STATUS
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    const { offer } = confirmDialog;
    try {
      const endpoint = "/api/admin/4ehhhhh7986b40e5018b04a71c7df2e04893f789";
      const payload = {
        offer_id: offer.id,
        status: offer.status === "active" ? "inactive" : "active",
      };

      const encrypted = DataEncrypt(JSON.stringify(payload));
      const res = await api.post(endpoint, { data: encrypted });
      const decrypted = DataDecrypt(res.data.data);

      setSnackbar({
        open: true,
        message: decrypted.message || "Offer status updated!",
        severity: "success",
      });

      setConfirmDialog(null);
      onActionComplete ? onActionComplete() : window.location.reload();
    } catch (err) {
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: "error" });
    }
  };

  // 🗑️ DELETE OFFER
  const handleDeleteOffer = async () => {
    if (!deleteDialog) return;
    const { offer } = deleteDialog;

    try {
      const encrypted = DataEncrypt(JSON.stringify({ offer_id: offer.id }));
      const res = await api.post("/api/admin/4eddddd7986b40e5018b04a71c7df2e04893f789", { data: encrypted });
      const decrypted = DataDecrypt(res.data.data);

      setSnackbar({
        open: true,
        message: decrypted.message || "Offer deleted successfully!",
        severity: "success",
      });
      setDeleteDialog(null);
      onActionComplete ? onActionComplete() : window.location.reload();
    } catch (err) {
      setSnackbar({ open: true, message: `Error deleting offer: ${err.message}`, severity: "error" });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ThemedTableContainer>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <ThemedTableHeadCell>Sl No.</ThemedTableHeadCell>
                <ThemedTableHeadCell>Title</ThemedTableHeadCell>
                <ThemedTableHeadCell>Description</ThemedTableHeadCell>
                <ThemedTableHeadCell>Start Date</ThemedTableHeadCell>
                <ThemedTableHeadCell>End Date</ThemedTableHeadCell>
                <ThemedTableHeadCell>Image</ThemedTableHeadCell>
                <ThemedTableHeadCell>Status</ThemedTableHeadCell>
                <ThemedTableHeadCell>Action</ThemedTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showOfferTrans.length > 0 ? (
                showOfferTrans
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((offer, index) => (
                    <ThemedTableRow key={offer.id || index}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>{offer.title}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>{offer.description}</TableCell>
                      <TableCell>{offer.start_date ? dayjs(offer.start_date).format("DD-MM-YYYY") : "-"}</TableCell>
                      <TableCell>{offer.end_date ? dayjs(offer.end_date).format("DD-MM-YYYY") : "-"}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        {offer.image ? (
                          <Link
                            href={`${BASE_URL}${offer.image}`}
                            target="_blank"
                            style={{ color: "#1976d2", fontWeight: 600, textDecoration: "underline" }}
                          >
                            View
                          </Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            offer.status === "active"
                              ? "green"
                              : offer.status === "inactive"
                                ? "orange"
                                : "red",
                          fontWeight: 600,
                        }}
                      >
                        {offer.status}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Button variant="outlined" size="small" onClick={() => handleEditOpen(offer)}>
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color={offer.status === "active" ? "warning" : "success"}
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => setConfirmDialog({ offer })}
                        >
                          {offer.status === "active" ? "Hide" : "Unhide"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => setDeleteDialog({ offer })}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </ThemedTableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <InfoOutlinedIcon color="error" /> No Offers Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ThemedTableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={showOfferTrans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* ✏️ Edit Dialog */}
        <Dialog open={!!editDialog} onClose={() => setEditDialog(null)} fullWidth maxWidth="md">
          <DialogTitle>Edit Offer</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={editDialog?.title || ""}
              onChange={(e) => setEditDialog({ ...editDialog, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDialog?.description || ""}
              onChange={(e) => setEditDialog({ ...editDialog, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={editDialog?.image || ""}
              onChange={(e) => setEditDialog({ ...editDialog, image: e.target.value })}
              fullWidth
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={editDialog?.start_date ? dayjs(editDialog.start_date) : null}
                onChange={(newValue) =>
                  setEditDialog({
                    ...editDialog,
                    start_date: newValue ? newValue.format("YYYY-MM-DD") : null,
                  })
                }
              />
              <DatePicker
                label="End Date"
                value={editDialog?.end_date ? dayjs(editDialog.end_date) : null}
                onChange={(newValue) =>
                  setEditDialog({
                    ...editDialog,
                    end_date: newValue ? newValue.format("YYYY-MM-DD") : null,
                  })
                }
              />
            </LocalizationProvider>

            <TextField
              select
              label="Status"
              value={editDialog?.status || "active"}
              onChange={(e) => setEditDialog({ ...editDialog, status: e.target.value })}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* ⚠️ Confirm Hide/Unhide */}
        <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              {confirmDialog?.offer?.status === "active" ? "hide" : "unhide"} this offer?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleConfirmAction}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* 🗑️ Confirm Delete */}
        <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
          <DialogTitle>Delete Offer</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this offer permanently?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteOffer}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default OffersTransactions;
