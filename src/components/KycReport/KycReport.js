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
  Link,
     // ✅ added
} from "@mui/material";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import Modal from "@mui/material/Modal";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

const KycTransactions = ({ showServiceTrans }) => {
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

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
      background: "#21BCF3",
      color: "#FFF",
      fontWeight: 700,
      fontSize: 14,
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
      fontSize: 14,
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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.pan_number && row.pan_number.includes(searchTerm)) ||
      // (row.aadhar_number && row.aadhar_number.includes(searchTerm)) ||
      (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
      (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
      (row.nominee_relation && row.nominee_relation.includes(searchTerm)) ||
      (row.account_number && row.account_number.includes(searchTerm))
    );
  });

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);

  const handleTextareaChange = (event) => {
    setRejectionReason(event.target.value);
  };
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

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

  const handleOKButtonClick = async () => {
    if (!addMoneyReqId) {
      alert("addMoneyReqId is missing.");
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

    const requestData = {
      status,
      note,
      id: addMoneyReqId,
      action,
    };

    //console.log("update-kyc-status requested data are:", requestData);

    try {
      const response = await api.post("/api/users/update-kyc-status", requestData);

      if (response.data.status === 200) {
        location.reload();
      } else {
        console.error("Backend error:", response.data);
        alert(`❌ ${response.data.message}\n${response.data.errors?.join("\n") || ""}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`🔥 Request failed: ${error.response?.data?.message || error.message}`);
    }

    handleCloseModal1();
    handleCloseModal2();
  };

  //console.log("showServiceTrans ",showServiceTrans)

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="Otp Report" >
              <TableHead>
                <TableRow style={{ whiteSpace: "nowrap" }}>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Sl No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Username
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    PAN Number
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Aadhaar Number
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Bank Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    IFSC Code
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Account Number
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Nominee Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Nominee Relation
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Address
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    PAN Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Aadhaar Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    AadharBack Image
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Checkbook Image
                  </StyledTableCell>

                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Created Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Modified Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Status
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Action
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Rejection Reason
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ whiteSpace: "nowrap" }}>
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
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.name + " | " + row.mlm_id + " | " + row.mobile}
                      </StyledTableCell>
                      <StyledTableCell>{row.pan_number}</StyledTableCell>
                      <StyledTableCell>{row.aadhar_number}</StyledTableCell>
                      <StyledTableCell>{row.bank_name}</StyledTableCell>
                      <StyledTableCell>{row.ifsc_code}</StyledTableCell>
                      <StyledTableCell>{row.account_number}</StyledTableCell>
                      <StyledTableCell>{row.nominee_name}</StyledTableCell>
                      <StyledTableCell>{row.nominee_relation}</StyledTableCell>
                      <StyledTableCell>{row.address}</StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {row.panImage !== "" ? (
                          <Link
                            href="#"
                            onClick={() => handleLinkClick(row.panImage)}
                          >
                            View PAN
                          </Link>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {row.aadharImage !== "" ? (
                          <Link
                            href="#"
                            onClick={() => handleLinkClick(row.aadharImage)}
                          >
                            View AADHAR(Front)
                          </Link>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {row.aadharBackImage !== "" ? (
                          <Link
                            href="#"
                            onClick={() => handleLinkClick(row.aadharBackImage)}
                          >
                            View AADHAR(Back)
                          </Link>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {row.checkbookImage !== "" ? (
                          <Link
                            href="#"
                            onClick={() => handleLinkClick(row.checkbookImage)}
                          >
                            View CHECKBOOK
                          </Link>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>

                      <StyledTableCell>{row.created_on}</StyledTableCell>
                      <StyledTableCell>{row.modified_on}</StyledTableCell>

                      <StyledTableCell
                        style={{
                          color:
                            row.status === 1
                              ? "Green"
                              : row.status === 2
                                ? "Red"
                                : "Orange",
                        }}
                      >
                        {" "}
                        {row.status === 1
                          ? "Approved"
                          : row.status === 2
                            ? "Rejected"
                            : "Pending"}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          "& button": { mx: 1, my: 3 },
                          display: "flex",
                        }}
                      >
                        <Link
                          href={`/update-kyc/?id=${row.user_id}&kyc_id=${row.id}`}
                        >
                          <a>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              style={{ fontWeight: "bold" }}
                            >
                              Update
                            </Button>
                          </a>
                        </Link>
                        {row.status === 0 && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handleOpenModal1(row.id, 1)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleOpenModal2(row.id, 2)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Modal
                          open={openModal1}
                          onClose={handleCloseModal1}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            sx={style}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <HelpOutlineOutlinedIcon
                              sx={{ fontSize: 40, marginLeft: 20 }}
                              color="warning"
                              alignItems={"center"}
                            />
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              Are you sure to approve the KYC?
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
                                sx={{ marginLeft: 12, marginLeft: 20 }}
                              >
                                OK
                              </Button>
                            </Typography>
                          </Box>
                        </Modal>

                        <Modal
                        fullWidth
                          open={openModal2}
                          onClose={handleCloseModal2}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            sx={{
                              ...style,
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              width:"50%"
                            }}
                          >
                            <HelpOutlineOutlinedIcon
                              sx={{ fontSize: 40, color: "error.main", alignSelf: "center" }}
                            />

                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              align="center"
                              fontWeight="bold"
                            >
                              Are you sure you want to Reject the KYC?
                            </Typography>

                            <Typography variant="body2" color="text.secondary" align="center">
                              Please provide a reason for rejection. This will be visible to the user.
                            </Typography>

                            {/* Styled input box */}
                            <TextField
                              label="Rejection Reason"
                              placeholder="Enter rejection reason..."
                              value={rejectionReason || ""}
                              onChange={handleTextareaChange}
                              fullWidth
                              multiline
                              rows={4}
                              variant="outlined"
                              required
                            />

                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                              <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleCloseModal2}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={handleOKButtonClick}
                              >
                                Reject KYC
                              </Button>
                            </Box>
                          </Box>
                        </Modal>

                      </StyledTableCell>
                      <StyledTableCell>{row.rejection_reason}</StyledTableCell>
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

        <Grid
          container
        // sx={{ background: "#FFF" }}
        ></Grid>
      </Grid>
    </main>
  );
};
export default KycTransactions;
