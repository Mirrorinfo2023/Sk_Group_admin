import { Box, Button,Divider,Modal, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Link, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import api from "../../../utils/api";

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

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }
    // console.log(showServiceTrans);
    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');

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

      
      const handleLinkClick = (img) => {
        window.open(img, '_blank', 'noopener,noreferrer');
      };
    
      const [openModal1, setOpenModal1] = React.useState(false);
      const [openModal2, setOpenModal2] = React.useState(false);
      const [openModal3, setOpenModal3] = React.useState(false);


      const [Id, setId] = React.useState(null);
      const [status, setStatus] = React.useState(null);
      const [distribd_amount, setdistributed_amount] = useState(null);

      const handleOpenModal1 = (Id,status, distribd_amount) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
        setdistributed_amount(distribd_amount);
      };

      const handleOpenModal2 = (Id,status, distribd_amount) => {
        setId(Id);
        setStatus(status);
        setOpenModal2(true);
      };

      const handleOpenModal3 = (Id,status, distribd_amount) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
      };
    
      const handleCloseModal1 = () => {
        setOpenModal1(false);
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

        let action = '';
        if(status === 2){
            action = 'Accept';
        }else if(status === 3){
            action = 'Hold';
        }else if(status === 4){
            action = 'Reject';
        }

        
        const requestData = {
          status: status,
          user_action_id: Id,
          action: action,
          distribd_amount: distribd_amount
        };

       
        try {
         
            const response = await api.post("/api/leads/update-user-action-status", requestData);
              
            if (response.data.status === 200) {
                location.reload();
             
            }else{
               console.log('Failed to update status.');
                
            }

        } catch (error) {
            console.error("Error:", error);
           
        }
       
        handleCloseModal1();
        handleCloseModal2();
       
      };
     

    // Add DataTable design styled components
    const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(33,150,243,0.08)',
        marginTop: 16,
        marginBottom: 16,
        overflow: 'hidden',
    }));

    const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: 13,
        padding: '6px 8px',
        borderRight: '1px solid #e3e3e3',
        letterSpacing: 1,
        textTransform: 'uppercase',
        minHeight: 32,
        whiteSpace: 'nowrap',
    }));

    const ThemedTableRow = styled(TableRow)(({ theme }) => ({
        '&:hover': {
            background: '#f5faff',
        },
        '& td': {
            padding: '6px 10px',
            height: '40px',
            fontSize: '13px',
        }
    }));

    const NoRecordsBox = styled('div')({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f44336',
        fontWeight: 600,
        fontSize: 16,
        padding: '32px 0',
        width: '100%',
        gap: 8,
    });

    const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
        '.MuiTablePagination-select': {
            color: '#2196f3',
            fontWeight: 600,
            paddingRight: '24px',
        },
        '.MuiTablePagination-selectLabel': {
            color: '#666',
            fontWeight: 500,
        },
        '.MuiTablePagination-displayedRows': {
            color: '#666',
            fontWeight: 500,
        },
        '.MuiTablePagination-actions': {
            '.MuiIconButton-root': {
                color: '#2196f3',
                '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
                '&.Mui-disabled': {
                    color: '#ccc',
                },
            },
        },
        '.MuiTablePagination-selectIcon': {
            color: '#2196f3',
        },
        '.MuiTablePagination-menuItem': {
            padding: '4px 16px',
        },
        '.MuiTablePagination-selectRoot': {
            marginRight: '32px',
        },
        '.MuiTablePagination-toolbar': {
            minHeight: '52px',
            padding: '0 16px',
            flexWrap: 'wrap',
            gap: '4px',
        },
        '.MuiTablePagination-spacer': {
            flex: 'none',
        },
    }));

    return (
        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >
                    <ThemedTableContainer>
                        <Table aria-label="User Details">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell>Sr No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>User Id</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Mobile</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Product Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Product Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Primary Product Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Distribution Amount</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>created Date</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Action</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row, index) => (
                                    <ThemedTableRow 
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>{row.first_name + ' ' + row.last_name}</TableCell>
                                        <TableCell>{row.mlm_id}</TableCell>
                                        <TableCell>{row.mobile}</TableCell>
                                        <TableCell>{row.lead_name}</TableCell>
                                        <TableCell>{row.category_name}</TableCell>
                                        <TableCell>{row.parent_category_name}</TableCell>
                                        <TableCell>{row.distribution_amount}</TableCell>
                                        <TableCell>{row.entry_date}</TableCell>
                                        <TableCell sx={{ '& button': { m: 1 } }}>
                                            <Link href={`/leads-form-data/?form_id=${row.id}`}>
                                            <a>
                                                <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }}>View Form</Button>
                                            </a>
                                            </Link>
                                        </TableCell>
                                    </ThemedTableRow >
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={11} component="th" scope="row">
                                            <NoRecordsBox>
                                                No Records Found.
                                            </NoRecordsBox>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ThemedTableContainer>
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
export default Transactions;