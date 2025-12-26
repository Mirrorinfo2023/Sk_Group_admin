import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import Modal from "@mui/material/Modal";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption'; // your encryption file

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddMoneyRequestTransactions = ({ showServiceTrans }) => {
  const rowsPerPageOptions = [5, 10, 25, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Filter rows based on search term
  const filteredRows = (showServiceTrans || []).filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      (row.user_name && row.user_name.toLowerCase().includes(term)) ||
      // (row.user_id && row.user_id.toLowerCase().includes(term)) ||
      // (row.mobile && row.mobile.includes(term)) ||
      // (row.transaction_id && row.transaction_id.toLowerCase().includes(term)) ||
      (row.amount && row.amount.toString().includes(term))
    );
  });

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
      whiteSpace: "nowrap",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const handleOpenModal1 = (addMoneyReqId, status) => {
    setAddMoneyReqId(addMoneyReqId);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setAddMoneyReqId(null);
    setStatus(null);
    setOpenModal1(false);
  };

  const handleOpenModal2 = (addMoneyReqId, status) => {
    setAddMoneyReqId(addMoneyReqId);
    setStatus(status);
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleTextareaChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleOKButtonClick = async () => {
    if (!addMoneyReqId) {
      console.error("addMoneyReqId is missing.");
      return;
    }

    let note = "";
    let action = "";

    if (status === 1) {
      note = "Approve";
      action = "Approve";
    } else if (status === 2) {
      note = rejectionReason;
      action = "Reject";
    }

    const payload = {
      status,
      note,
      add_money_req_id: addMoneyReqId,
      action
    };

    try {
      // ✅ Encrypt request
      const encryptedData = DataEncrypt(JSON.stringify(payload));

      const response = await api.post(
        "/api/add_money/5242f89dd23b3e850a2e8eb1d935b80206bff9e0",
        { data: encryptedData }
      );

      // ✅ Decrypt response
      let decryptedResponse;
      try {
        decryptedResponse = DataDecrypt(response.data.data); // assuming backend sends { data: <encrypted_string> }
      } catch (err) {
        console.error("Failed to decrypt response:", err);
        decryptedResponse = response.data;
      }

      console.log("Decrypted Response:", decryptedResponse);

      if (decryptedResponse.status === 200) {
        alert("💰 Money request processed successfully!");
        window.location.reload();
      } else {
        alert(decryptedResponse.message || "Request failed on server side");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }

    handleCloseModal1();
    handleCloseModal2();
  };


  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={2} sx={{ padding: "0px 6px" }}>
        <Grid item xs={12}>
          {/* Search Box */}
          {/* <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mb={2}
          >
            <TextField
              size="small"
              placeholder="Search by name, ID, mobile, txn, amount..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ width: 320 }}
            />
          </Box> */}
          <TableContainer
            component={Paper}
            sx={{
              border: "1px solid #bdbdbd",
              borderRadius: 2,
              maxHeight: 400, // <-- fixed height
              overflowY: "auto", // scroll vertically
            }}
          >
            <Table aria-label="Add Money Request Report" size="small" stickyHeader>

              <TableHead>
                <TableRow>
                  <StyledTableCell>SI No.</StyledTableCell>
                  <StyledTableCell>User Name</StyledTableCell>
                  <StyledTableCell>User ID</StyledTableCell>
                  <StyledTableCell>Mobile</StyledTableCell>
                  <StyledTableCell>Payment Mode</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Transaction ID</StyledTableCell>
                  <StyledTableCell>UPI ID</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Remarks</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <StyledTableRow key={row.id || index}>
                        <StyledTableCell>
                          {index + 1 + page * rowsPerPage}
                        </StyledTableCell>
                        <StyledTableCell>{row.first_name} {row.last_name} </StyledTableCell>
                        <StyledTableCell>{row.user_id}</StyledTableCell>
                        <StyledTableCell>{row.mobile}</StyledTableCell>
                        <StyledTableCell>{row.category}</StyledTableCell>
                        <StyledTableCell>{row.amount}</StyledTableCell>
                        <StyledTableCell>{row.trans_no}</StyledTableCell>
                        <StyledTableCell>{row.trans_no || "-"}</StyledTableCell>
                        <StyledTableCell>{row.created_on}</StyledTableCell>
                        <StyledTableCell>{row.remarks || "-"}</StyledTableCell>
                        <StyledTableCell
                          style={{
                            color:
                              row.status === 1
                                ? "green"
                                : row.status === 2
                                  ? "red"
                                  : "blue",
                            fontWeight: 600,
                          }}
                        >
                          {row.status === 1
                            ? "Approved"
                            : row.status === 2
                              ? "Rejected"
                              : "Pending"}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box
                            display="flex"
                            gap={1}
                            alignItems="center"
                            justifyContent="center"
                          >
                            {row.status === 0 && (
                              <>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="success"
                                  style={{ minWidth: 80, fontWeight: 600 }}
                                  onClick={() => handleOpenModal1(row.id, 1)}
                                >
                                  APPROVE
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  style={{ minWidth: 80, fontWeight: 600 }}
                                  onClick={() => handleOpenModal2(row.id, 2)}
                                >
                                  REJECT
                                </Button>
                              </>
                            )}
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={17}
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

      <Modal
        open={openModal1}
        onClose={handleCloseModal1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} alignItems={"center"} justifyContent={"space-between"}>
          <HelpOutlineOutlinedIcon
            sx={{ fontSize: 40, marginLeft: 20 }}
            color="warning"
            alignItems={"center"}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure to approve the money request?
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleOKButtonClick}
              sx={{ marginLeft: 20 }}
            >
              OK
            </Button>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openModal2}
        onClose={handleCloseModal2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} alignItems={"center"} justifyContent={"space-between"}>
          <HelpOutlineOutlinedIcon
            sx={{ fontSize: 40, marginLeft: 20 }}
            color="warning"
            alignItems={"center"}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure to Reject the money request?
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={10}
            placeholder="Enter Rejection Reason"
            style={{ width: 400 }}
            value={rejectionReason}
            onChange={handleTextareaChange}
          />
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleOKButtonClick}
              sx={{ marginLeft: 20 }}
            >
              OK
            </Button>
          </Typography>
        </Box>
      </Modal>
    </main>
  );
};

export default AddMoneyRequestTransactions;
