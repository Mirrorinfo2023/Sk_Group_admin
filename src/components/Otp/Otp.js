import {
  Box,
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
} from "@mui/material";
import { useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Dummy data for otpResult
const dummyOtpResult = [
  {
    first_name: "John",
    last_name: "Doe",
    mlm_id: "MLM001",
    mobile: "9876543210",
    otp: "123456",
    category: "Login",
    status: 1,
    otp_date: "2024-03-20 10:30 AM",
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    mlm_id: "MLM002",
    mobile: "9876543211",
    otp: "654321",
    category: "Registration",
    status: 0,
    otp_date: "2024-03-20 11:45 AM",
  },
  {
    first_name: "Mike",
    last_name: "Johnson",
    mlm_id: "MLM003",
    mobile: "9876543212",
    otp: "789012",
    category: "Password Reset",
    status: 1,
    otp_date: "2024-03-20 12:15 PM",
  },
];

const OtpTransactions = ({ showServiceTrans, searchTerm }) => {
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
  const filteredRows = Array.isArray(showServiceTrans)
    ? showServiceTrans.filter((row) => {
        const searchString = (searchTerm || "").toLowerCase();
        return (
          (row.first_name + " " + row.last_name)
            .toLowerCase()
            .includes(searchString) ||
          row.mlm_id.toLowerCase().includes(searchString) ||
          row.mobile.includes(searchString) ||
          row.otp.includes(searchString) ||
          row.category.toLowerCase().includes(searchString)
        );
      })
    : [];
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

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Divider />
            <Table aria-label="Otp Report">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    User Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Mr. Id
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Mobile
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Otp
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    OTP For
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Status
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} nowrap>
                    Date
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
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell>
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell>{row.mlm_id}</StyledTableCell>
                      <StyledTableCell>{row.mobile}</StyledTableCell>
                      <StyledTableCell>{row.otp}</StyledTableCell>
                      <StyledTableCell>{row.category}</StyledTableCell>
                      <StyledTableCell
                        style={{ color: row.status === 1 ? "green" : "black" }}
                      >
                        {row.status === 1 ? "Active" : "Expired"}
                      </StyledTableCell>
                      <StyledTableCell>{row.otp_date}</StyledTableCell>
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
              marginBottom: "15px",
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

export default OtpTransactions;
