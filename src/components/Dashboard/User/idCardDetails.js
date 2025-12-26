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
  Modal,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import api from "../../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
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

const Transactions = ({ showServiceTrans }) => {
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase()))
      // Add conditions for other relevant columns
    );
  });

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [idCardReqId, setidCardReqId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [buttonHidden, setButtonHidden] = useState(false);

  const handleTextareaChange = (event) => {
    setRejectionReason(event.target.value);
  };
  const handleOpenModal1 = (idCardReqId, status) => {
    setidCardReqId(idCardReqId);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setidCardReqId(null);
    setStatus(null);
    setOpenModal1(false);
  };

  const handleOpenModal2 = (idCardReqId, status) => {
    setidCardReqId(idCardReqId);

    setStatus(status);
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleOKButtonClick = async () => {
    setButtonHidden(true);
    if (!idCardReqId) {
      console.error("idCardReqId is missing.");
      return;
    }
    let note = "";
    let action = "";
    if (status === 2) {
      action = "Approve";
      note = "Approve";
    } else if (status === 3) {
      note = rejectionReason; // Use the rejectionReason state
      action = "Reject";
    }

    const requestData = {
      status: status,
      note: note,
      idCard_id: idCardReqId,
      action: action,
    };
    try {
      const response = await api.post(
        "/api/report/update-idCard-status",
        requestData
      );
      if (response.data.status === 200) {
        location.reload();
      } else {
        console.log("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    handleCloseModal1();
    handleCloseModal2();
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper} exportButton={true}>
            <Divider />
            <Table
              aria-label="User Transaction Summary Table"
              exportButton={true}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Sl No.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Date
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    User Name
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    User Id
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Mobile No.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Email
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Shipping Address
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Shipping contact no.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Reference No.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Transaction Id
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Reject Reason
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Action
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
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>{row.entry_date}</StyledTableCell>
                      <StyledTableCell>
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell>{row.mlm_id}</StyledTableCell>
                      <StyledTableCell>{row.mobile}</StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                      <StyledTableCell>
                        Name:- {row.shipping_name}
                        <br />
                        {row.address_type} address:- {row.shipping_address}{" "}
                        <br />
                        {row.shipping_city} {row.shipping_state} <br />
                        Pincode:- {row.shipping_pincode}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.shipping_mobile_no}
                      </StyledTableCell>
                      <StyledTableCell>{row.order_id}</StyledTableCell>
                      <StyledTableCell>{row.transaction_id}</StyledTableCell>
                      <StyledTableCell
                        style={{
                          color:
                            row.status === 1
                              ? "blue"
                              : row.status === 2
                              ? "green"
                              : row.status === 3
                              ? "red"
                              : "blue",
                        }}
                      >
                        {row.status === 1
                          ? "Pending"
                          : row.status === 2
                          ? "Issued"
                          : row.status === 3
                          ? "Rejected"
                          : "Pending"}
                      </StyledTableCell>
                      <StyledTableCell>{row.rejection_reason}</StyledTableCell>
                      <StyledTableCell sx={{ "& button": { m: 1 } }}>
                        {row.status === 1 && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handleOpenModal1(row.id, 2)}
                            >
                              Issue
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleOpenModal2(row.id, 3)}
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
                              Are you sure you want to issue id card?
                            </Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                              alignItems={"center"}
                            >
                              {!buttonHidden && (
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="success"
                                  onClick={handleOKButtonClick}
                                  sx={{ marginLeft: 12, marginLeft: 20 }}
                                >
                                  OK
                                </Button>
                              )}
                            </Typography>
                          </Box>
                        </Modal>
                        <Modal
                          open={openModal2}
                          onClose={handleCloseModal2}
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
                              Are you sure to Reject id card?
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={10}
                              placeholder="Enter Rejection Reason"
                              style={{ width: 400 }}
                              value={rejectionReason}
                              onBlur={handleTextareaChange}
                            />
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                              alignItems={"center"}
                            >
                              {!buttonHidden && (
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="success"
                                  onClick={handleOKButtonClick}
                                  sx={{ marginLeft: 12, marginLeft: 20 }}
                                >
                                  OK
                                </Button>
                              )}
                            </Typography>
                          </Box>
                        </Modal>
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

        <Grid
          container
          // sx={{ background: "#FFF" }}
        ></Grid>
      </Grid>
    </main>
  );
};
export default Transactions;
