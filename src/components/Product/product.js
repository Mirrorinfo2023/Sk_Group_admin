import { Box, Button,Divider,TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Link } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const GradientTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
    padding: '10px 12px',
    border: 'none',
    letterSpacing: 0.5,
    borderRight: '1.5px solid #fff',
  },
  '&:first-of-type': {
    borderTopLeftRadius: 16,
  },
  '&:last-of-type': {
    borderTopRightRadius: 16,
    borderRight: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 10,
    border: 'none',
  },
}));

const BannersTransactions = ({ showServiceTrans }) => {

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
   
    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);


    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
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
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: '#ccc',
          color: theme.palette.common.black,
          fontSize: 12,
          linHeight: 15,
          padding: 7,
          borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
      }));
      
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));


    const [formattedDate, setFormattedDate] = useState('');

  
    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [openModal3, setOpenModal3] = React.useState(false);
    const [Id, setId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    // const [rejectionReason, setRejectionReason] = useState(null);

    const handleOpenModal1 = (Id,status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
      };

      const handleOpenModal3 = (Id,status) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
      };
    
      const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
      };
    
      const handleOpenModal2 = (Id,status) => {
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
          console.error('Id is missing.');
          return;
        }
        let note = '';
        let action='';
        if (status === 0) {
             action='Delete';
             
          } else if (status === 1) {
           
            action='Active';
          } 
          else {
            action='Inactive';
          }
        
        const requestData = {
          status: status,
          product_id: Id,
          action:action
        };

  
        try {

            const response = await api.post("/api/product/update-product-status", requestData);
              
            if (response.data.status === 200) {
                alert(response.data.message);
                location.reload();
             
            }else{
                alert('Failed to update');
               console.log('Failed to update status.');
                
            }

        } catch (error) {
            console.error("Error:", error);
           
        }
       
        handleCloseModal1();
        handleCloseModal2();
        handleCloseModal3();
      };

     


    const handleLinkClick = (img) => {
      
        window.open(img, '_blank', 'noopener,noreferrer');
      };
    
    return (

        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: 2,}}
            >
                <Grid item={true} xs={12}  >
                    
                            

                    <TableContainer component={Paper} style={{borderRadius: 14}}  >

                        <Table aria-label="Banners Report">

                            <TableHead>
                                <TableRow>
                                    <GradientTableCell nowrap width="5%">Sl No.</GradientTableCell>
                                    <GradientTableCell nowrap width="15%">Product Name</GradientTableCell>
                                    <GradientTableCell nowrap width="8%">Unit Price</GradientTableCell>
                                    <GradientTableCell nowrap width="10%">Purchase Price</GradientTableCell>
                                    <GradientTableCell nowrap width="15%">Details</GradientTableCell>
                                    <GradientTableCell nowrap width="10%">Benefits</GradientTableCell>
                                    <GradientTableCell nowrap width="10%">Created Date</GradientTableCell>
                                    <GradientTableCell nowrap width="5%">Status</GradientTableCell>
                                    <GradientTableCell nowrap width="15%">Action</GradientTableCell>
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
                                        <GradientTableCell>{index + 1 + page * rowsPerPage}</GradientTableCell>
                                        <GradientTableCell>{row.name}</GradientTableCell>
                                        <GradientTableCell>{row.unit_price}</GradientTableCell>
                                        <GradientTableCell>{row.purchase_price}</GradientTableCell>
                                        <GradientTableCell>{row.details}</GradientTableCell>
                                        <GradientTableCell>
                                            {row.benefits ? (
                                                <ul style={{ paddingLeft: '10px' }}>
                                                    {row.benefits.map((benefit, i) => (
                                                        <li key={i}>{benefit}</li>
                                                    ))}
                                                </ul>
                                            ) : ''}
                                        </GradientTableCell>
                                        <GradientTableCell>{row.entry_date}</GradientTableCell>
                                        <GradientTableCell style={{ color: row.status === 1 ? 'Green' : (row.status === 2 ? 'Red' : 'Black') }}>
                                            {row.status === 1 ? 'Active' : (row.status === 2 ? 'Inactive' : 'Deleted')}
                                        </GradientTableCell>
                                        <GradientTableCell sx={{ '& button': { m: 1 } }}>
                                            {row.status === 0 ? null : (
                                                <>
                                                    {row.status === 2 && (
                                                        <>
                                                            <Button variant="contained" size="small" color="primary" onClick={() => handleOpenModal1(row.id, 1)}>
                                                                Active
                                                            </Button>
                                                            <Button variant="contained" size="small" color="error" onClick={() => handleOpenModal3(row.id, 0)}>
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                    {row.status === 1 && (
                                                        <>
                                                            <Button variant="contained" size="small" color="warning" onClick={() => handleOpenModal2(row.id, 2)}>
                                                                Inactive
                                                            </Button>
                                                            <Link href={`/add-new-product/?action=update&product_id=${row.id}`}>
                                                                <a>
                                                                    <Button variant="contained" size="small" color="info">Edit</Button>
                                                                </a>
                                                            </Link>
                                                        </>
                                                    )}
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
                                                        Are you sure you want to activate?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                            <Modal
                                                open={openModal2} 
                                                onClose={handleCloseModal2}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'}  justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40 ,marginLeft:20}} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to in-activate?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12 ,marginLeft:20}}>OK</Button>
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                            <Modal 
                                                open={openModal3} 
                                                onClose={handleCloseModal3}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'}  justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40 ,marginLeft:20}} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to delete?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                        </GradientTableCell>
                                    </StyledTableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" style={{ background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, height: 120 }}>
                                            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                                                <InfoOutlinedIcon sx={{ color: 'red', fontSize: 28, mr: 1 }} />
                                                <Typography color="error" fontWeight="bold" fontSize={18}>No Records Found.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <StyledTablePagination
                        rowsPerPageOptions={[5, 10,20, 25]}
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
    )
}
export default BannersTransactions;