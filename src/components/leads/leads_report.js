import {
  Box,
  Button,
  Divider,
  Modal,
  Grid,
  Paper,
  Table,
  TableBody,
  StyledTableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import api from "../../../utils/api";


const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px 0 rgba(33,150,243,0.08)",
  marginTop: 16,
  marginBottom: 16,
  overflow: "hidden",
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: 10,
  borderRight: "1px solid #e3e3e3",
  letterSpacing: 1,
  textTransform: "uppercase",
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    background: "#f5faff",
  },
}));

const NoRecordsBox = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#f44336",
  fontWeight: 600,
  fontSize: 18,
  padding: "32px 0",
  width: "100%",
  gap: 8,
});

const Transactions = ({ showServiceTrans }) => {
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  // console.log(showServiceTrans);
  const rowsPerPageOptions = [5, 10, 25];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = rows;

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

  const onPageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 100));
    setPage(0);
  };

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

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

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

    let action = "";
    if (status === 0) {
      action = "Inactive";
    } else {
      action = "Active";
    }

    const requestData = {
      status: status,
      lead_id: Id,
      action: action,
    };

    console.log(requestData);

    try {
      const response = await api.post(
        "/api/leads/update-lead-status",
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
          <ThemedTableContainer>
            <Table aria-label="Leads Report">
              <TableHead>
                <TableRow>
                  <ThemedTableHeadCell>Sr No.</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Category Name</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Lead Name</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Lead Field Label</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Image</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Specification</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Description</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Created Date</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Status</ThemedTableHeadCell>
                  <ThemedTableHeadCell>Action</ThemedTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  (rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row, index) => (
                    <ThemedTableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{row.category_name}</TableCell>
                      <TableCell>{row.lead_name}</TableCell>
                      <TableCell>{row.lead_field_lebel}</TableCell>
                      <TableCell>
                        <Link href="#" onClick={() => handleLinkClick(row.img)}>
                          View Image
                        </Link>
                      </TableCell>
                      <TableCell>{row.specification}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.created_on}</TableCell>
                      <TableCell
                        style={{ color: row.status === 1 ? "Green" : "Red" }}
                      >
                        {" "}
                        {row.status === 1 ? "Active" : "InActive"}
                      </TableCell>
                      <TableCell sx={{ "& button": { m: 1 } }}>
                        <Link
                          href={`/add-new-lead/?action=update&lead_id=${row.id}&category_id=${row.category_id}`}
                        >
                          <a>
                            <Button
                              variant="contained"
                              size="small"
                              color="warning"
                              style={{ fontWeight: "bold" }}
                            >
                              Update
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
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            style={{ fontWeight: "bold" }}
                            onClick={() => handleOpenModal2(row.id, 0)}
                          >
                            Inactive
                          </Button>
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
                              Are you sure you want to Active this Product?
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
                      </TableCell>
                    </ThemedTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <NoRecordsBox>
                        <InfoOutlinedIcon color="error" sx={{ fontSize: 28 }} />
                        No Records Found.
                      </NoRecordsBox>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ThemedTableContainer>
          <StyledTablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
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

export default Transactions;
