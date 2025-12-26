import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const FeedbackTransactions = ({ showServiceTrans, onStatusUpdate, refreshData }) => {
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  console.log("showServiceTrans ", showServiceTrans)
  const rowsPerPageOptions = [5, 10, 25, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  // State for dialogs
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openViewNoteDialog, setOpenViewNoteDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [note, setNote] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);

  // Open dialog for resolve/hold actions
  const handleOpenNoteDialog = (id, status, rowData) => {
    setCurrentId(id);
    setCurrentStatus(status);
    setCurrentRowData(rowData);
    setNote(rowData.admin_note || "");

    // Set dialog title based on action
    if (status === 1) {
      setDialogTitle("Resolve Feedback");
    } else if (status === 2) {
      setDialogTitle("Hold Feedback");
    }

    setOpenNoteDialog(true);
  };

  // Open dialog to view note
  const handleOpenViewNoteDialog = (rowData) => {
    setCurrentRowData(rowData);
    setCurrentNote(rowData.admin_note || "No note available");
    setOpenViewNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
    setCurrentId(null);
    setCurrentStatus(null);
    setNote("");
    setCurrentRowData(null);
  };

  const handleCloseViewNoteDialog = () => {
    setOpenViewNoteDialog(false);
    setCurrentNote("");
    setCurrentRowData(null);
  };

  // Handle submitting the status update with note
  const handleSubmitStatus = async () => {
    if (!currentId || currentStatus === null) {
      console.error("Missing ID or status");
      return;
    }

    try {
      const requestData = {
        id: currentId,
        status: currentStatus,
        admin_note: note.trim() || (currentStatus === 1 ? "Resolved" : "Hold")
      };

      const response = await api.post(
        "/api/feedback/update-feedback",
        requestData
      );

      if (response.data.status === 200) {
        alert("Status updated successfully!");
        handleCloseNoteDialog();
        if (refreshData) {
          refreshData();
        } else {
          location.reload();
        }
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.last_name &&
        row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.usermobile && row.usermobile.includes(searchTerm)) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.reason_name &&
        row.reason_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mobile &&
        row.mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.admin_note &&
        row.admin_note.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

  // Render note with truncation and view button
  const renderNoteCell = (note, rowData) => {
    const truncatedNote = note && note.length > 50
      ? `${note.substring(0, 50)}...`
      : note || " ";

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {truncatedNote}
        </Typography>
        {(note && note.length > 50) && (
          <Tooltip title="View full note">
            <IconButton
              size="small"
              onClick={() => handleOpenViewNoteDialog(rowData)}
              sx={{ p: 0.5 }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  return (
    <main className="p-6 space-y-6">
      {/* Note Dialog for Resolve/Hold */}
      <Dialog open={openNoteDialog} onClose={handleCloseNoteDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {/* {currentRowData && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Feedback Details:
              </Typography>
              <Typography variant="body2">
                <strong>User:</strong> {currentRowData.first_name} {currentRowData.last_name}
              </Typography>
              <Typography variant="body2">
                <strong>Issue:</strong> {currentRowData.problem_description}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {currentRowData.category_name}
              </Typography>
            </Box>
          )} */}

          <Typography variant="body2" gutterBottom>
            {currentStatus === 1
              ? "Please add a note about how you resolved this feedback:"
              : "Please add a note explaining why this feedback is on hold:"}
          </Typography>
          <TextareaAutosize
            aria-label="note"
            minRows={6}
            placeholder={
              currentStatus === 1
                ? "Enter resolution details..."
                : "Enter reason for holding..."
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              fontFamily: "inherit",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
            }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitStatus} color="primary" variant="contained">
            {currentStatus === 1 ? "Mark as Resolved" : "Mark as Hold"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={openViewNoteDialog} onClose={handleCloseViewNoteDialog} maxWidth="md" fullWidth>
        <DialogTitle>Admin Note</DialogTitle>
        <DialogContent>
          {currentRowData && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Feedback Details:
              </Typography>
              <Typography variant="body2">
                <strong>User:</strong> {currentRowData.first_name} {currentRowData.last_name}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{" "}
                {currentRowData.status === 1
                  ? "Resolved"
                  : currentRowData.status === 2
                    ? "Hold"
                    : currentRowData.status === 3
                      ? "Pending"
                      : "Deleted"}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" gutterBottom color="text.secondary">
            Admin Note:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: '#f9f9f9',
              minHeight: '100px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {currentNote}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewNoteDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="Feedback Report">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    User Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    User ID
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Mobile
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Category Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Reason Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Contact Mobile
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Problem Description
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Created Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Status
                  </StyledTableCell>

                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Action
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Admin Note
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showServiceTrans.length > 0 ? (
                  (rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows
                  ).map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.mlm_id}</StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.usermobile}</StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.category_name}</StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.reason_name}</StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.mobile}</StyledTableCell>

                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        {row.img && row.img !== "" ? (
                          <Link
                            href="#"
                            onClick={() => handleLinkClick(row.img)}
                            style={{ textDecoration: 'none', color: '#2196f3' }}
                          >
                            View Image
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No Image
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        <Tooltip title={row.problem_description}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                            {row.problem_description}
                          </Typography>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        {(() => {
                          const d = new Date(row.created_on);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = d.toLocaleString("en-GB", { month: "short" });
                          const year = d.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </StyledTableCell>


                      <StyledTableCell
                        sx={{
                          color:
                            row.status === 1
                              ? "green"
                              : row.status === 2
                                ? "#FF9800"
                                : row.status === 3
                                  ? "#2196f3"
                                  : "#f44336",
                          fontWeight: row.status === 1 || row.status === 2 ? 'bold' : 'normal'
                        }}
                      >
                        {row.status === 1
                          ? "Resolved"
                          : row.status === 2
                            ? "Hold"
                            : row.status === 3
                              ? "Pending"
                              : "Deleted"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}> {/* gap adds space between buttons */}
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleOpenNoteDialog(row.id, 1, row)}
                            sx={{ minWidth: '100px' }}
                          >
                            Resolve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="warning"
                            onClick={() => handleOpenNoteDialog(row.id, 2, row)}
                            sx={{ minWidth: '100px' }}
                          >
                            Hold
                          </Button>
                        </Box>
                      </StyledTableCell>


                      <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                        {renderNoteCell(row.admin_note, row)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={13}
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
                          No Records Found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
    </main>
  );
};

export default FeedbackTransactions;