import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./MeetingReport.module.css"
// Dummy data for copy-paste

const MeetingDetailsTransactions = ({ showServiceTrans }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rows by search term (name or description)
  const filteredRows = Array.isArray(showServiceTrans) ? showServiceTrans.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const rowsPerPageOptions = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onPageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenerateReport = () => {
    alert('Report generation will be implemented here');
  };

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

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

  const [formattedDate, setFormattedDate] = useState("");

  const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));

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
      fontSize: 11,
      whiteSpace: "nowrap",
      padding: 8,
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
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#ccc",
      color: theme.palette.common.black,
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
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

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} className={styles.container}>
        <Grid item xs={12}>
 


          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table aria-label="Meeting Report" className={styles.table}>
              <TableHead>
                <TableRow className={styles.tableHeadRow}>
                  <TableCell>Sl No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Meeting Date</TableCell>
                  <TableCell>Meeting Time</TableCell>
                  <TableCell>Meeting Link</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>User Id</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Is Enroll</TableCell>
                  <TableCell>Is Invite</TableCell>
                  <TableCell>Is Join</TableCell>
                  <TableCell>Meeting Created Date</TableCell>
                  <TableCell>Meeting Enroll Date</TableCell>
                  <TableCell>Status</TableCell>
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
                    <TableRow key={index} className={styles.tableRow}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.meeting_date}</TableCell>
                      <TableCell>{row.meeting_time}</TableCell>
                      <TableCell>
                        <Link href="#" onClick={() => handleLinkClick(row.meeting_link)}>
                          View Link
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href="#" onClick={() => handleLinkClick(row.image)}>
                          View Image
                        </Link>
                      </TableCell>
                      <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                      <TableCell className={styles.userIdCell}>{row.mlm_id}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell
                        className={
                          row.is_enroll === 1 ? styles.statusApproved : styles.statusRejected
                        }
                      >
                        {row.is_enroll === 1 ? "Enroll" : "Not Enroll"}
                      </TableCell>
                      <TableCell
                        className={
                          row.is_invite === 1 ? styles.statusApproved : styles.statusRejected
                        }
                      >
                        {row.is_invite === 1 ? "Invite" : "Not Invite"}
                      </TableCell>
                      <TableCell
                        className={
                          row.is_join === 1 ? styles.statusApproved : styles.statusRejected
                        }
                      >
                        {row.is_join === 1 ? "Join" : "Not Join"}
                      </TableCell>
                      <TableCell>{row.meeting_created_date}</TableCell>
                      <TableCell>{row.meeting_enroll_date}</TableCell>
                      <TableCell
                        className={
                          row.meeting_status === 1
                            ? styles.statusApproved
                            : styles.statusRejected
                        }
                      >
                        {row.meeting_status === 1 ? "Active" : "Inactive"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={17} className={styles.noRecordsCell}>
                      <Box className={styles.noRecordsBox}>
                        <InfoOutlinedIcon className={styles.noRecordsIcon} />
                        <Typography className={styles.noRecordsText}>
                          No Records Found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
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
export default MeetingDetailsTransactions;
