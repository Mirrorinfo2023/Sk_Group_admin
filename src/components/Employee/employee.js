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
  Select,
  MenuItem,
  Link,
  Modal,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
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
      (row.email &&
        row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.employee_code &&
        row.employee_code.toLowerCase().includes(searchTerm.toLowerCase()))
      // Add conditions for other relevant columns
    );
  });

  const [openModal1, setOpenModal1] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [role_id, setRoleId] = React.useState(null);

  const handleOpenModal1 = (roleId, status) => {
    setRoleId(roleId);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setRoleId(null);
    setStatus(null);
    setOpenModal1(false);
  };

  const handleOKButtonClick = async () => {
    if (!role_id) {
      console.error("Id is missing.");
      return;
    }

    let action = "";
    if (status === 0) {
      action = "Inactive";
    } else if (status === 1) {
      action = "Active";
    }

    const requestData = {
      status: status,
      role_id: role_id,
      action: action,
    };

    try {
      const response = await api.post("/api/employee/update-role", requestData);

      if (response.data.status === 200) {
        alert(`${action} successfully.`);
        location.reload();
      } else {
        console.log("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    handleCloseModal1();
  };

  const [selectedOption, setSelectedOption] = useState({});

  const handleOptionChange = (event, rowId) => {
    setSelectedOption((prevSelectedOption) => ({
      ...prevSelectedOption,
      [rowId]: event.target.value,
    }));
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
                    SI No.
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Date
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Employee Code
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
                    Address
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    City
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    District
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
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Education
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Role
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                  >
                    Status
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
                      <StyledTableCell>{row.employee_code}</StyledTableCell>
                      <StyledTableCell>
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell>{row.mlm_id}</StyledTableCell>
                      <StyledTableCell>{row.mobile}</StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                      <StyledTableCell>{row.address}</StyledTableCell>
                      <StyledTableCell>{row.city}</StyledTableCell>
                      <StyledTableCell>{row.district}</StyledTableCell>
                      <StyledTableCell>{row.state}</StyledTableCell>
                      <StyledTableCell>{row.pincode}</StyledTableCell>
                      <StyledTableCell>{row.education}</StyledTableCell>
                      <StyledTableCell>{row.role_name}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          style={{
                            color: row.employee_status === 1 ? "Green" : "Red",
                          }}
                        >
                          {row.employee_status === 1 ? "Active" : "Incative"}
                        </span>
                      </StyledTableCell>

                      <StyledTableCell sx={{ "& button": { m: 1 } }}>
                        <Select
                          onChange={(event) => handleOptionChange(event, index)}
                          style={{ width: "100px" }}
                        >
                          <MenuItem value="active">
                            <Link
                              style={{ "text-decoration": "none" }}
                              onClick={() => handleOpenModal1(row.id, 1)}
                            >
                              Active
                            </Link>
                          </MenuItem>
                          <MenuItem value="inactive">
                            <Link
                              style={{ "text-decoration": "none" }}
                              onClick={() => handleOpenModal1(row.id, 0)}
                            >
                              Inactive
                            </Link>
                          </MenuItem>
                          <MenuItem value="view">
                            <Link
                              href={`/view-employee/?id=${row.employee_id}`}
                              style={{ "text-decoration": "none" }}
                            >
                              View
                            </Link>
                          </MenuItem>
                          <MenuItem value="edit">
                            <Link
                              href={`/add-new-employee/?id=${row.employee_id}&action=edit`}
                              style={{ "text-decoration": "none" }}
                            >
                              Edit
                            </Link>
                          </MenuItem>
                          <MenuItem value="delete">
                            <Link
                              onClick={() => handleOpenModal1(row.id, 0)}
                              style={{ "text-decoration": "none" }}
                            >
                              Delete
                            </Link>
                          </MenuItem>
                        </Select>

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
                              Are you sure to Active/Inactive this Employee ?
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
