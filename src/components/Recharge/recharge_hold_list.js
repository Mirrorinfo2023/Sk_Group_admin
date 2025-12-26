import { Box, Button,Divider,TextField, Container, Grid, Paper, Table,Link,Modal, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import api from "../../../utils/api";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

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


const Transactions = ({ showServiceTrans }) => {
    const uid = Cookies.get('uid');
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

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = rows.filter(row => {
        return (
          (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
          (row.mobile && row.mobile.includes(searchTerm)) ||
          (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (row.ref_first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (row.ref_mlm_id && row.mlm_id.includes(searchTerm)) ||
          (row.ref_mobile && row.mobile.includes(searchTerm)) ||
          (row.ref_email && row.email.toLowerCase().includes(searchTerm.toLowerCase()))
          // Add conditions for other relevant columns
        );
    });

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 100));
        setPage(0);
    };

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


        const approveClick = async (id, user_id,transaction_id) => {


           const confirmed = window.confirm("Are you sure you want to approve?");
            if (confirmed) 
            {
                const requestData = {
                    user_id: user_id,
                    transaction_id: transaction_id,
                };
          
                 
                try {
                
                    const response = await api.post("/api/recharge/recharge-hold-approved", requestData);
                    console.log(response);
                    if (response.data.status === 200) {
                        alert(response.data.message);
                        location.reload();
                    
                    }else{
                        alert(response.data.error);
                        console.log('Failed to Approve');
                        
                    }
        
                } catch (error) {
                    console.error("Error:", error);
                    
                }
            } 
        };

         const [openModal2, setOpenModal2] = React.useState(false);
         const [rejectionReason, setRejectionReason] = useState(null);
         const [user_id, setuser_id] = useState(null);
         const [transaction_id, settransaction_id] = useState(null);
    

           const handleOpenModal2 = (id, user_id,transaction_id) => {
            setuser_id(user_id);
            settransaction_id(transaction_id);
            setOpenModal2(true);
          };
         
          const handleCloseModal1 = () => {
            setuser_id(null);
            settransaction_id(null);
            setOpenModal2(false);
          };

           const handleTextareaChange = (event) => {
             setRejectionReason(event.target.value);
           };
     
           const handleCloseModal2 = () => {
             setOpenModal2(false);
           };
     
           const handleOKButtonClick = async () => {
             
    
                const requestData = {
                    user_id: user_id,
                    transaction_id: transaction_id,
                    admin_user_id: uid,
                    reject_reason: rejectionReason
                };
          
                 
                try {
                
                    const response = await api.post("/api/recharge/recharge-reject", requestData);
                    console.log(response);
                    if (response.data.status === 200) {
                        alert(response.data.message);
                        location.reload();
                    
                    }else{
                        alert(response.data.error);
                        console.log('Failed to Approve');
                        
                    }
        
                } catch (error) {
                    console.error("Error:", error);
                    
                }
            
             handleCloseModal1();
             handleCloseModal2();
           };
     

    return (
        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >


                    <TableContainer component={Paper} >
                        
                        {/* <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={2} mb={2} sx={{ padding: 2 }}>
                            <TextField id="standard-basic" label="Search" variant="standard" style={{width: '50%'}} value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)} />
                        </Box> */}
                        <Divider />
                        <Table aria-label="User Details" sx={{ size: 2 }} mt={2}>
                            <TableHead>
                                <TableRow>

                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >User name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Consumer Number</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Operator</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Reference No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Tranx Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Transaction No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Amount</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Debit</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Cashback</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Prime Cashback</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Ip Address</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >API</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Description</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filteredRows
                                ).map((row, index) => (

                                    <StyledTableRow 
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.recharge_date}</StyledTableCell>
                                        <StyledTableCell>{row.first_name + ' ' + row.last_name + ' | '+ row.mlm_id + ' | '+ row.mobile}</StyledTableCell>
                                        <StyledTableCell>{row.ConsumerNumber}</StyledTableCell>
                                        <StyledTableCell>{row.operator_name}</StyledTableCell>
                                        <StyledTableCell fontWeight="bold" style={{ color:row.recharge_status === 'SUCCESS' ? 'Green' : row.recharge_status === 'PROCESS' ? 'blue' : row.recharge_status === 'FAILURE' ? 'Red': 'orange' }} >{row.recharge_status}</StyledTableCell>
                                        <StyledTableCell>{row.reference_no}</StyledTableCell>
                                        <StyledTableCell>{row.trax_id}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.transaction_id}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.main_amount}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.amount}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.cashback_amount}</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'center' }}>{row.service_amount}</StyledTableCell>
                                        <StyledTableCell>{row.ip_address}</StyledTableCell>
                                        <StyledTableCell>{row.service_name}</StyledTableCell>
                                        <StyledTableCell>{row.description}</StyledTableCell>
                                        <StyledTableCell sx={{ '& button': { m: 1 } }} style={{whiteSpace: 'nowrap' }} >
                                            {row.status === 4 ? (
                                                <>
                                                    <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }} onClick={() => approveClick(row.id, row.user_id, row.transaction_id)} >Approve</Button>
                                                    <Button variant="contained" size="small" color="error" style={{ fontWeight: 'bold' }} onClick={() => handleOpenModal2(row.id, row.user_id, row.transaction_id)} >Reject</Button>
                                                </>
                                            ):(
                                                <>
                                                
                                                </>
                                            )}

                                            <Modal
                                                open={openModal2} 
                                                onClose={handleCloseModal2}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'}  justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40 ,marginLeft:20}} color="warning" alignItems={'center'} />
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Are you sure to Reject?
                                                </Typography>
                                                <TextareaAutosize 
                                                        aria-label="minimum height" 
                                                        minRows={10} 
                                                        placeholder="Enter Rejection Reason" 
                                                        style={{ width: 400}} 
                                                        value={rejectionReason}
                                                        onBlur={handleTextareaChange}
                                                        
                                                />
                                                <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                    <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12 ,marginLeft:20}}>Reject</Button>
                                                    
                                                </Typography>
                                                
                                                </Box>
                                            </Modal>
                                        
                                        </StyledTableCell>
                                    </StyledTableRow >
                                )) : (

                                    <TableRow>
                                        <TableCell colSpan={11} component="th" scope="row">
                                            <Typography color={'error'}>No Records Found.</Typography>
                                        </TableCell>
                                    </TableRow>

                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={{}}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>

                <Grid
                    container
                // sx={{ background: "#FFF" }}
                >



                </Grid>
            </Grid>
        </main>
    )
}
export default Transactions;