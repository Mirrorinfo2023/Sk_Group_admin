import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import dayjs from "dayjs";
import Link from "next/link";

const MeetingTransactions = ({ showServiceTrans, searchTerm = "" }) => {
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

  
  const data = showServiceTrans ;

  // Filter rows by search term (name or description)
  const filteredRows = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowsPerPageOptions = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onPageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    background: "#fff",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTop: "1px solid #e0e0e0",
    marginTop: 0,
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
  const GradientTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      padding: 10,
      borderRight: "1px solid #e3e3e3",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    "&:first-of-type": {
      borderTopLeftRadius: 14,
    },
    "&:last-of-type": {
      borderTopRightRadius: 14,
      borderRight: "none",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
      padding: 10,
      border: "none",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));

  const [formattedDate, setFormattedDate] = useState("");

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: 18,
    boxShadow: "0 2px 12px 0 rgba(33, 203, 243, 0.10)",
    background: "#fff",
    marginBottom: 16,
    "& table": {
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    "& th:first-of-type": {
      borderTopLeftRadius: 14,
    },
    "& th:last-of-type": {
      borderTopRightRadius: 14,
    },
    "& tr:last-child td:first-of-type": {
      borderBottomLeftRadius: 14,
    },
    "& tr:last-child td:last-of-type": {
      borderBottomRightRadius: 14,
    },
  }));

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <StyledTableContainer>
            <Table aria-label="Meeting Report">
              <TableHead>
                <TableRow>
                  <GradientTableCell nowrap>Sl No.</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Name</GradientTableCell>
                  <GradientTableCell nowrap>Description</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Date</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Time</GradientTableCell>
                  <GradientTableCell nowrap>Image</GradientTableCell>
                  <GradientTableCell nowrap>Link</GradientTableCell>
                  <GradientTableCell nowrap>Created Date</GradientTableCell>
                  <GradientTableCell nowrap>Status</GradientTableCell>
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
                      <TableCell>
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.meeting_date}</TableCell>
                      <TableCell>{row.meeting_time}</TableCell>
                      <TableCell>
                        <Link
                          href="#"
                          onClick={() => handleLinkClick(row.image)}
                        >
                          View Image
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href="#"
                          onClick={() => handleLinkClick(row.meeting_link)}
                        >
                          View Link
                        </Link>
                      </TableCell>
                      <TableCell>{row.meeting_created_date}</TableCell>
                      <TableCell
                        style={{ color: row.status === 1 ? "Green" : "Red" }}
                      >
                        {row.status === 1 ? "Active" : "Inactive"}
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={17}
                      align="center"
                      style={{
                        background: "#fff",
                        borderBottomLeftRadius: 18,
                        borderBottomRightRadius: 18,
                        height: 120,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <InfoOutlinedIcon
                          sx={{ color: "red", fontSize: 28, mr: 1 }}
                        />
                        <Typography
                          color="error"
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
          </StyledTableContainer>

          <StyledTablePagination
            rowsPerPageOptions={[5, 10, 20, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </main>
  );
};
export default MeetingTransactions;
