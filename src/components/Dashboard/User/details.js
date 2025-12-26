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
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import api from "../../../../utils/api";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { useRouter } from "next/router";

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
  const router = useRouter();
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  const [searchTerm, setSearchTerm] = useState("");

  // const filteredRows = rows.filter(row => {
  //     return (
  //       (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //       (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
  //       (row.mobile && row.mobile.includes(searchTerm)) ||
  //       (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //       (row.ref_first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //       (row.ref_mlm_id && row.mlm_id.includes(searchTerm)) ||
  //       (row.ref_mobile && row.mobile.includes(searchTerm)) ||
  //       (row.ref_email && row.email.toLowerCase().includes(searchTerm.toLowerCase()))
  //       // Add conditions for other relevant columns
  //     );
  // });

  const filteredRows = rows;

  const onPageChange = (event, newPage) => {
    //console.log(newPage);
    setPage(newPage);

    //router.push(`/user-details?page=${newPage}`); // Update the URL with the new page number
  };

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
      whiteSpace: "nowrap",
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

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [Id, setId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [buttonHidden, setButtonHidden] = useState(false);

  const handleOpenModal1 = (Id, status) => {
    setId(Id);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleTextareaChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleOpenModal2 = (Id, status) => {
    setId(Id);
    setStatus(status);
    setOpenModal2(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal1(false);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };
  const handleOKButtonClick = async () => {
    setButtonHidden(true);
    if (!Id) {
      console.error("Id is missing.");
      return;
    }

    let action = "";
    if (status === 0) {
      action = "Inactive";
    } else {
      action = "Active";
    }

    const requestData = {
      status: status,
      id: Id,
      action: action,
      reason: rejectionReason,
    };

    try {
      const response = await api.post(
        "/api/users/7e0f025e644befa1fce101beb075a6acc6360b16",
        requestData
      );

      if (response.data.status === 200) {
        alert(response.data.message);
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
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "400px",     // fixed height of table
              height: "400px",        // optional but recommended
              overflowY: "auto",
            }}
          >

            <Table aria-label="User Details" sx={{ size: 2 }} mt={2}>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Sr No.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Registration Date
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    User name
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    {" "}
                    User Id
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Mobile number
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Email
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Plan
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Referral name
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Referral Id
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Referral Mobile
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Referral Email
                  </StyledTableCell>
                  {/* <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Referral Plan</StyledTableCell> */}
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    City
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    State
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Pincode
                  </StyledTableCell>

                  {/* <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Wallet balance</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Prime balance</StyledTableCell> */}
                  {/* <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Cashback</StyledTableCell> */}
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Affiliate balance
                  </StyledTableCell>
                  {/* <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Month transaction</StyledTableCell> */}
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Total referal
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Total team count
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Income history
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Rank
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Show Portfolio
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Inactive Reason
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
                      <StyledTableCell>{row.registration_date}</StyledTableCell>
                      <StyledTableCell>
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell>{row.mlm_id}</StyledTableCell>
                      <StyledTableCell>{row.mobile}</StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                      <StyledTableCell>
                        {row.plan_name
                          ? row.plan_name + "(" + row.plan_amount + ")"
                          : ""}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.ref_first_name + " " + row.ref_last_name}
                      </StyledTableCell>
                      <StyledTableCell>{row.ref_mlm_id}</StyledTableCell>
                      <StyledTableCell>{row.ref_mobile}</StyledTableCell>
                      <StyledTableCell>{row.ref_email}</StyledTableCell>
                      {/* <StyledTableCell>{row.ref_plan_name ? row.ref_plan_name + '('+ row.ref_plan_amount+')': ''}</StyledTableCell> */}
                      <StyledTableCell>{row.circle}</StyledTableCell>
                      <StyledTableCell>{row.region}</StyledTableCell>
                      <StyledTableCell>{row.pincode}</StyledTableCell>

                      {/* <StyledTableCell style={{ textAlign: 'center' }}>{row.wallet_balance}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.prime_balance}</StyledTableCell> */}
                      {/* <StyledTableCell style={{ textAlign: 'center' }}>{row.cashback_balance}</StyledTableCell> */}

                      <StyledTableCell></StyledTableCell>
                      {/* <StyledTableCell></StyledTableCell> */}
                      <StyledTableCell>
                        <Link
                          href={`/user-referrals/?id=${row.id}`}
                          target="_blank"
                        >
                          <a>View</a>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link href={`/user-team/?id=${row.id}`} target="_blank">
                          <a>View</a>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link
                          href={`/user-dashboard/?id=${row.id}`}
                          target="_blank"
                        >
                          <a>View</a>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ color: row.status === 1 ? "Green" : "Red" }}
                      >
                        {" "}
                        {row.status === 1 ? "Active" : "InActive"}
                      </StyledTableCell>
                      <StyledTableCell>{row.rank}</StyledTableCell>
                      <StyledTableCell>
                        {row.is_portfolio === 1 ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell>{row.inactive_reason}</StyledTableCell>

                      <StyledTableCell
                        sx={{ "& button": { m: 1 } }}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Link href={`/update-user-info/?id=${row.id}`}>
                          <a>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              style={{ fontWeight: "bold" }}
                            >
                              Update User Info
                            </Button>
                          </a>
                        </Link>

                        {row.status === 0 ? (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              style={{ fontWeight: "bold" }}
                              onClick={() => handleOpenModal1(row.id, 1)}
                            >
                              Active
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                              href={`/id-wise-credit-amount/?id=${row.id}`}
                            >
                              {" "}
                              Income Credit{" "}
                            </Button>
                            {/* 
                                            <Button variant="contained"  size="small" color="success"
                                            style={{ fontWeight: 'bold', marginRight: '10px' }}
                                            href={`/update-user-info/?id=${row.id}`}> Update User Info </Button> */}
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              style={{ fontWeight: "bold" }}
                              onClick={() => handleOpenModal2(row.id, 0)}
                            >
                              Inactive
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                              mr={2}
                              href={`/id-wise-credit-amount/?id=${row.id}`}
                            >
                              {" "}
                              Income Credit{" "}
                            </Button>

                            {/* <Button variant="contained"  size="small" color="success"
                                            style={{ fontWeight: 'bold' , marginRight: '10px' }}
                                            href={`/update-user-info/?id=${row.id}`}> Update User Info </Button> */}
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
                              Are you sure you want to Active this user?
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={10}
                              placeholder="Enter Reason"
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
                              Are you sure you want to inactive this user?
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
