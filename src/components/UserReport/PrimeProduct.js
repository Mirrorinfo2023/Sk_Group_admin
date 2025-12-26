import { Box, Button,Divider,TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Alert from '@mui/material/Alert';
 
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


      const [searchTerm, setSearchTerm] = useState('');

      const filteredRows = rows;

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));


    const [formattedDate, setFormattedDate] = useState('');

  
    const [openModal1, setOpenModal1] = React.useState(false);
    const [remarks, setRemarks] = React.useState(false);
    const [message, setMessage] = React.useState(false);
    const [ppId, setId] = React.useState(null);
    const [ppstatus, setStatus] = React.useState(null);

    const handleOpenModal1 = (Id,status, message) => {
        setId(Id);
        setStatus(status);
        setMessage(message);
        setOpenModal1(true);
        setRemarks(message);
      };

    
      const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
      };
    

      const handleOKButtonClick = async () => {
        // alert(status);
        if (!ppId) {
          console.error('Id is missing.');
          return;
        }

        
        const requestData = {
          status: ppstatus,
          purchase_id: ppId,
          remarks:remarks
        };

       
        try {

            const response = await api.post("/api/referral/plan/update-prime-purchase-status", requestData);
              
            if (response.data.status === 200) {
                location.reload();
             
            }else{
               console.log('Failed to update status.');
                
            }

        } catch (error) {
            console.error("Error:", error);
           
        }
       
        handleCloseModal1();
      };

    return (

        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >

                    <TableContainer component={Paper}>
                        <Table aria-label="Otp Report">

                            <TableHead>
                                <TableRow>
             
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Mobile</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Plan</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Amount</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Prime Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Transaction No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Address</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Remarks</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Action</StyledTableCell>
                                   
                                    
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
                                        <StyledTableCell>{row.mlm_id}</StyledTableCell>
                                        <StyledTableCell>{row.first_name+' '+ row.last_name }</StyledTableCell> 
                                        <StyledTableCell>{row.mobile}</StyledTableCell>
                                        <StyledTableCell>{row.plan_name}</StyledTableCell>
                                        <StyledTableCell>{row.amount}</StyledTableCell>
                                        <StyledTableCell>{row.entry_date}</StyledTableCell>
                                        <StyledTableCell>{row.transaction_id}</StyledTableCell>
                                        <StyledTableCell>{row.address?row.address:''+' '+ row.block+' '+ row.district+' '+ row.circle}</StyledTableCell>
                                        <StyledTableCell style={{ color:row.order_status === 0 ? 'Blue' : row.order_status === 1 ? 'Green' :  row.order_status === 2 ? 'Orange' : row.order_status === 3 ? 'Red':'Red'  }} > {row.order_status === 0 ? 'Order Placed' : row.order_status === 1 ? 'Order Delivered' :  row.order_status === 2 ? 'Order in transit' : row.order_status === 3 ? 'Order Cancelled':'' }</StyledTableCell>
                                        <StyledTableCell>{row.order_remarks}</StyledTableCell>
                                        <StyledTableCell>
                                            {row.order_status != 1 ? (
                                            <>

                                                <Button variant="contained" size="small" color="warning" 
                                                    style={{  marginRight:'5px' }}
                                                    onClick={() => handleOpenModal1(row.id, 2, 'Order in transit')} >
                                                    Transit
                                                </Button>

                                                <Button variant="contained" size="small" color="success" 
                                                    style={{  marginRight:'5px' }}
                                                    onClick={() => handleOpenModal1(row.id, 1, 'Order Deliver')} >
                                                    Deliver
                                                </Button>

                                                <Button variant="contained" size="small" color="error" 
                                                    style={{  marginRight:'5px' }}
                                                    onClick={() => handleOpenModal1(row.id, 3, 'Order Cancel')} >
                                                    Cancel
                                                </Button>
                                                
                                            </>
                                            ) : (
                                                <>

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
                                                    Are you sure you want to {message}?
                                                </Typography>
                                                <br/>
                                                <TextField required size="normal"
                                                    fullWidth label="Remarks" 
                                                    variant="outlined" display={'inline-block'}
                                                    value={remarks} 
                                                    mr={3}
                                                    onChange={(e) => setRemarks(e.target.value)}  />
                                                <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                                                    <Button variant="contained" size="small" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                                                    
                                                </Typography>
                                                
                                                </Box>
                                            </Modal>
                                            
                                        </StyledTableCell>


                                    </StyledTableRow>
                                  
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
export default PrimeUserTransactions;