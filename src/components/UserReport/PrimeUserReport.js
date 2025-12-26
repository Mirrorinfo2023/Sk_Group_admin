import {
  Button,
  Grid,
  Box,
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
import dayjs from "dayjs";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const PrimeUserTransactions = ({ showServiceTrans }) => {
  const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
    const from_date = `01-${month}-${year}`;
    const to_date = `${day}-${month}-${year}`;
    return formattedDateTime;
  };

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
    },
    "&:first-of-type": {
      borderTopLeftRadius: 6,
    },
    "&:last-of-type": {
      borderTopRightRadius: 6,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: "8px 8px",
      borderRight: "1px solid #e3e3e3",
      whiteSpace: "nowrap",
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    }

  }));

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.plan && row.plan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.referal_name &&
        row.referal_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.refer_id &&
        row.refer_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.refer_mobile &&
        row.refer_mobile.toLowerCase().includes(searchTerm.toLowerCase()))
      // Add conditions for other relevant columns
    );
  });

  const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));

  const [formattedDate, setFormattedDate] = useState("");

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [openModal3, setOpenModal3] = React.useState(false);
  const [Id, setId] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  // const [rejectionReason, setRejectionReason] = useState(null);

  const handleOpenModal1 = (Id, status) => {
    setId(Id);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleOpenModal3 = (Id, status) => {
    setId(Id);
    setStatus(status);
    setOpenModal3(true);
  };

  const handleCloseModal1 = () => {
    setId(null);
    setStatus(null);
    setOpenModal1(false);
  };

  const handleOpenModal2 = (Id, status) => {
    setId(Id);

    setStatus(status);
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleCloseModal3 = () => {
    setOpenModal3(false);
  };

  const handleOKButtonClick = async () => {
    // alert(status);
    if (!Id) {
      console.error("Id is missing.");
      return;
    }
    let note = "";
    let action = "";
    if (status === 0) {
      // note = 'Approve';
      action = "Delete";
    } else if (status === 1) {
      // note = rejectionReason;
      action = "Resolve";
    } else if (status === 3) {
      // note = rejectionReason;
      action = "Hold";
    } else {
      // note='';
      action = "Pending";
    }

    const requestData = {
      status: status,
      //   note: note,
      id: Id,
      action: action,
    };

    try {
      const response = await api.post(
        "/api/feedback/update-feedback",
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
    handleCloseModal3();
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "450px",
              overflowY: "auto",
            }}
          >
            <Table aria-label="Otp Report" stickyHeader>

              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Registration Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    User Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Prime
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Amount
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Prime Date
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Refer User Name
                  </StyledTableCell>
                  {/* <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Wallet Balance</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Cashback Balance</StyledTableCell> */}
                  {/* <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Reedem Balance
                  </StyledTableCell> */}
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Distribution Link
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    api
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

                    >
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>{row.registration_date}</StyledTableCell>
                      <StyledTableCell>
                        {row.name + " | " + row.mlm_id + " | " + row.mobile}
                      </StyledTableCell>
                      <StyledTableCell>{row.plan}</StyledTableCell>
                      <StyledTableCell>{row.amount}</StyledTableCell>
                      <StyledTableCell>{row.prime_date}</StyledTableCell>
                      <StyledTableCell>
                        {row.referal_name +
                          " | " +
                          row.refer_id +
                          " | " +
                          row.refer_mobile}
                      </StyledTableCell>
                      {/* <StyledTableCell>{row.wallet_balance}</StyledTableCell> */}
                      {/* <StyledTableCell>{row.cashback_balance}</StyledTableCell>
                                        <StyledTableCell>{row.reedem_balance}</StyledTableCell> */}
                      <StyledTableCell>
                        <Link href={`/prime-distribution/?id=${row.user_id}`} passHref>
                          <Button variant="contained" color="primary" size="small">
                            View Distribution
                          </Button>
                        </Link>
                      </StyledTableCell>


                      <StyledTableCell>
                        <Link href={`/prime-distribution/?id=${row.user_id}`}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                          >
                            Reshoot{" "}
                          </Button>
                        </Link>
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
export default PrimeUserTransactions;
