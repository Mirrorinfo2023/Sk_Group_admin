import {
  Button,
  Divider,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import * as React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";

const Transactions = ({ showServiceTrans }) => {
  const [loading, setLoading] = useState(true);
  let rows;
  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  useEffect(() => {
    if (showServiceTrans) {
      setLoading(false);
    }
  }, [showServiceTrans]);

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

  const [openModal1, setOpenModal1] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [Id, setId] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  const handleOpenModal1 = (Id, status) => {
    setId(Id);
    setStatus(status);
    setOpenModal1(true);
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
    // alert(status);
    if (!Id) {
      console.error("Id is missing.");
      return;
    }

    // let action='';
    //     if (status === 0) {
    //         action='Inactive';
    //     } else {
    //         action='Active';
    //   }

    // const requestData = {
    //   status: status,
    //   id: Id,
    //   action:action
    // };

    // try {

    //     const response = await api.post("/api/setting/get-setting", requestData);

    //     if (response.data.status === 200) {
    //         location.reload();

    //     }else{
    //        console.log('Failed to update status.');

    //     }

    // } catch (error) {
    //     console.error("Error:", error);

    // }

    handleCloseModal1();
    handleCloseModal2();
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Divider />
                <Table aria-label="User Details" sx={{ size: 2 }} mt={2}>
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
                        Instance Id
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      >
                        Access Token
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      >
                        Last Modified
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      >
                        Last Modified Date
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
                        ? rows.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : rows
                      ).map((row, index) => (
                        <StyledTableRow
                          key={index}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <StyledTableCell>
                            {index + 1 + page * rowsPerPage}
                          </StyledTableCell>
                          <StyledTableCell>{row.instance_id}</StyledTableCell>
                          <StyledTableCell>{row.access_token}</StyledTableCell>
                          <StyledTableCell>{row.updated_on}</StyledTableCell>
                          <StyledTableCell>{row.created_on}</StyledTableCell>
                          <StyledTableCell
                            sx={{ "& button": { m: 1 } }}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Link href={`/whatsapp-update/?whatsapp_id=${row.id}`}>
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
                count={rows.length}
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
            </>
          )}
        </Grid>
      </Grid>
    </main>
  );
};

export default Transactions;
