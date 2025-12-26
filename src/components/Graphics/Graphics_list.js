import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography,Link } from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';



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
  '&:first-of-type': {
    borderTopLeftRadius: 14,
  },
  '&:last-of-type': {
    borderTopRightRadius: 14,
    borderRight: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 10,
    border: 'none',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 18,
  boxShadow: '0 2px 12px 0 rgba(33, 203, 243, 0.10)',
  background: '#fff',
  marginBottom: 16,
  '& table': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  '& th:first-of-type': {
    borderTopLeftRadius: 14,
  },
  '& th:last-of-type': {
    borderTopRightRadius: 14,
  },
  '& tr:last-child td:first-of-type': {
    borderBottomLeftRadius: 14,
  },
  '& tr:last-child td:last-of-type': {
    borderBottomRightRadius: 14,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  background: '#fff',
  borderBottomLeftRadius: 14,
  borderBottomRightRadius: 14,
  borderTop: '1px solid #e0e0e0',
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

const GraphicsTransactions = ({ showServiceTrans }) => {

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
        const from_date=`01-${month}-${year}`;
        const to_date=`${day}-${month}-${year}`;
        return formattedDateTime;
    };


    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
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
    }, [`&.${tableCellClasses.head}`]: {
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

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));
   
    const [formattedDate, setFormattedDate] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = rows.filter(row => {
      return (
          (row.cat_group && row.cat_group.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (row.graphics_name && row.graphics_name.includes(searchTerm)) ||
          (row.category_name && row.category_name.includes(searchTerm)) 
        
        // Add conditions for other relevant columns
      );
  });
  const [openModal1, setOpenModal1] = React.useState(false);
  const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  const handleOpenModal1 = (addMoneyReqId,status) => {
    setAddMoneyReqId(addMoneyReqId);
    setStatus(status);
    setOpenModal1(true);
  };

  const handleCloseModal1 = () => {
    setAddMoneyReqId(null);
    setStatus(null);
    setOpenModal1(false);
  };

  
  const handleOKButtonClick = async () => {
    // alert(status);
    if (!addMoneyReqId) {
      console.error('addMoneyReqId is missing.');
      return;
    }
    let note = '';
    let action='';
    if (status === 1) {
        note = 'Approve';
        action='Approve';
      } else if (status === 2) {
        note = rejectionReason; // Use the rejectionReason state
        action='Reject';
      } else {
        note='';
        action='';
      }
    
    const requestData = {
      status: status,
      note: note,
      id: addMoneyReqId,
      action:action
    };

    try {
        const response = await api.post("/api/graphics/update-graphics-status", requestData);
        if (response.data.status === 200) {
            alert(response.data.message);
            location.reload();
        }else{
           console.log('Failed to update status.');
        }

    } catch (error) {
        console.error("Error:", error);
    }
    handleCloseModal1();
  };


     
     


    const handleLinkClick = (img) => {
      
        window.open(img, '_blank', 'noopener,noreferrer');
      };
    
    return (

        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4} sx={{ padding: "0px 16px" }}
            >
                <Grid item={true} xs={12}   >
                    
                            

                    <StyledTableContainer>
                        <Table aria-label="Banners Report">
                            <TableHead>
                                <TableRow>
                                    <GradientTableCell nowrap>SI No.</GradientTableCell>
                                    <GradientTableCell nowrap>Category Name</GradientTableCell>
                                    <GradientTableCell nowrap>Category Group</GradientTableCell>
                                    <GradientTableCell nowrap>Graphics Name</GradientTableCell>
                                    <GradientTableCell nowrap>Image</GradientTableCell>
                                    <GradientTableCell nowrap>Like Count</GradientTableCell>
                                    <GradientTableCell nowrap>Share Count</GradientTableCell>
                                    <GradientTableCell nowrap>Created Date</GradientTableCell>
                                    <GradientTableCell nowrap>Status</GradientTableCell>
                                    <GradientTableCell nowrap>Action</GradientTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row, index) => (
                                    <StyledTableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.category_name}</StyledTableCell>
                                        <StyledTableCell>{row.cat_group}</StyledTableCell>
                                        <StyledTableCell>{row.graphics_name}</StyledTableCell>
                                        <StyledTableCell><Link href="#" onClick={() => handleLinkClick(row.image)}>View Image</Link></StyledTableCell>
                                        <StyledTableCell>{row.like_count}</StyledTableCell>
                                        <StyledTableCell>{row.share_count}</StyledTableCell>
                                        <StyledTableCell>{row.created_on}</StyledTableCell>
                                        <StyledTableCell style={{ color:row.status === 1 ? 'Green' : 'Red' }} >
                                            {row.status === 1 ? 'Active' : 'Inactive'}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ '& button': { m: 1 } }}>
                                            <Link href={`/update-graphics/?id=${row.id}`}>
                                            <a>
                                                <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }}>Update</Button>
                                            </a>
                                            </Link>
                                            {row.status === 1 && (
                                            <>
                                            <Button variant="contained" size="small" color="error"  style={{ fontWeight: 'bold' }} onClick={() => handleOpenModal1(row.id,0)}>Delete</Button> 
                                            {/* <Button variant="contained" size="small" color="error" onClick={()=> handleOpenModal2(row.id,2)}>Reject</Button>   */}
                                            
                                            </>
                                            )}
                                            <Modal 
                                                    open={openModal1} 
                                                    onClose={handleCloseModal1}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style} alignItems={'center'}  justifyContent={'space-between'}>
                                                        <HelpOutlineOutlinedIcon sx={{ fontSize: 40 ,marginLeft:20}} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                     Are you sure to Delete this post?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                                                        
                                                    </Typography>
                                                  
                                                    </Box>
                                                </Modal>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center" style={{ height: 120, background: '#fff', border: 'none' }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                                <InfoOutlinedIcon sx={{ color: '#F44336', fontSize: 36, mb: 1 }} />
                                                <Typography color="#F44336" fontWeight="bold" fontSize={18}>
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
            </Grid>
        </main>
    )
}

export default GraphicsTransactions;