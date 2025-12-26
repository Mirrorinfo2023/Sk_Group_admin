import { Box, Button,Divider,TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography ,Link} from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    //transform: 'translate(-50%, -50%)',
    width: 500,
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


    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    const [searchTerm, setSearchTerm] = useState('');
   

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

      const [openModal1, setOpenModal1] = React.useState(false);
      const [openModal2, setOpenModal2] = React.useState(false);
      const [Id, setId] = React.useState(null);
      const [status, setStatus] = React.useState(null);
      const [rejectionReason, setRejectionReason] = useState(null);

      const handleOpenModal1 = (Id,status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
      };

      const handleTextareaChange = (event) => {
        setRejectionReason(event.target.value);
      };

      const handleOpenModal2 = (Id,status) => {
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
          console.error('Id is missing.');
          return;
        }
      
        let action='';
            if (status === 0) {
                action='Inactive';
            } else {
                action='Active';
          }
        
        const requestData = {
          status: status,
          id: Id,
          action:action,
          reason:rejectionReason
        };

       
        // try {
         
        //     const response = await api.post("/api/users/7e0f025e644befa1fce101beb075a6acc6360b16", requestData);
              
        //     if (response.data.status === 200) {
        //         alert(response.data.message);
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
      const filteredRows = rows.filter(row => {
        return (
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.email && row.email.includes(searchTerm)) ||
            (row.ins_no && row.ins_no.includes(searchTerm)) ||
            (row.ins_type && row.ins_type.includes(searchTerm)) 
            // Add conditions for other relevant columns
        );
    });


    const [company, setcompany] = useState([]);
      const [editingCompanyIndex, setEditingCompanyIndex] = useState(null);
      const [newcompanyRow, setNewcompanyRow] = useState({ company_name: '', link: '' });
    
      const newcompanyhandleChange = (e) => {
        const { name, value } = e.target;
        setNewcompanyRow((prev) => ({ ...prev, [name]: value }));
      };
    
      const addNewcompanyRow = () => {
        const updatedRows = [...company, { id: company.length + 1, ...newcompanyRow }];
        setcompany(updatedRows);
        setNewcompanyRow({ company_name: '', link: '' });
      };

      const handleEditCompany = (index) => {
        setEditingCompanyIndex(index);
        setNewcompanyRow({ ...company[index] });
      };
    
      const handleUpdateCompany = () => {
        const updatedRows = [...company];
        updatedRows[editingCompanyIndex] = { ...newcompanyRow };
        setcompany(updatedRows);
        setEditingCompanyIndex(null);
        setNewcompanyRow({ company_name: '', link: '' });
      };
    
      const handleDeleteCompany = (index) => {
        const updatedRows = [...company];
        updatedRows.splice(index, 1);
        setcompany(updatedRows);
      };

      const [distribd_amount, setdistributed_amount] = useState(null);


    return (
        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >


                    <TableContainer component={Paper} >
                        
                        <Table aria-label="User Details" sx={{ size: 2 }} mt={2}>
                            <TableHead>
                                <TableRow>

                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Sr No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Insurance Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >User name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >User Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Mobile number</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Email</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Insurance No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} >Insurance Type</StyledTableCell>
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
                                        <StyledTableCell>{row.entry_date}</StyledTableCell>
                                        <StyledTableCell>{row.first_name + ' ' + row.last_name}</StyledTableCell>
                                        <StyledTableCell>{row.mlm_id}</StyledTableCell>
                                        <StyledTableCell>{row.mobile}</StyledTableCell>
                                        <StyledTableCell>{row.email}</StyledTableCell>
                                        <StyledTableCell>{row.ins_no}</StyledTableCell>
                                        <StyledTableCell>{row.ins_type}</StyledTableCell>
                                        <StyledTableCell sx={{ '& button': { m: 1 } }} style={{whiteSpace: 'nowrap' }} >

                                            {/* <Link href={`/view-insurance-details/?id=${row.id}`}>
                                            <a>
                                                <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }}>View</Button>
                                            </a>
                                            </Link> */}

                                            <Button variant="contained" size="small" color="warning" 
                                                style={{ fontWeight: 'bold' }}
                                                onClick={() => handleOpenModal1(row.id, 1)} >
                                                Pending
                                            </Button>

                                            <Modal
                                                sm={style}
                                                open={openModal1} 
                                                onClose={handleCloseModal1}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                                                    <Typography variant="h6"  sx={{ padding: 2 }}>Add Company</Typography>
                                                    <div style={{ marginTop: '16px' }}>  
                                                        <TextField fullWidth
                                                        name="company_name"
                                                        label="Company Name"
                                                        variant="outlined"
                                                        onChange={newcompanyhandleChange}
                                                        />
                                                        </div>
                                                        <div style={{ marginTop: '16px' }}>
                                                        <TextField fullWidth
                                                            name="link"
                                                            label="link"
                                                            variant="outlined"
                                                            onChange={newcompanyhandleChange}
                                                        />
                                                        </div>
                                                        <div style={{ marginTop: '10px' }}>
                                                        <TextField required size="normal"
                                                            fullWidth label="Distributed Amount" 
                                                            variant="outlined" display={'inline-block'}
                                                            value={distribd_amount} 
                                                            mr={3}
                                                            onChange={(e) => setdistributed_amount(e.target.value)}  />
                                                        </div>
                                            
                                                        <Button variant="contained" onClick={addNewcompanyRow} style={{ marginTop: '8px' }}>Add Row</Button>
                                                        <br/>
                                                        <br/>
                                                        <TableContainer component={Paper}>
                                                        <Table>
                                                            <TableHead>
                                                            <TableRow>
                                                                <TableCell>Sl No.</TableCell>
                                                                <TableCell>Company Name</TableCell>
                                                                <TableCell>Link</TableCell>
                                                                <TableCell>Insurance Amount</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                            {company.map((row, index) => (
                                                                <TableRow key={index}>
                                                                <TableCell>{row.id}</TableCell>
                                                                <TableCell>{index === editingCompanyIndex ? <TextField fullWidth name="company_name" variant="outlined" value={newcompanyRow.company_name} onChange={(e) => setNewcompanyRow({ ...newcompanyRow, company_name: e.target.value })} /> : row.company_name}</TableCell>
                                                                <TableCell>{index === editingCompanyIndex ? <TextField fullWidth name="link" variant="outlined" value={newcompanyRow.link} onChange={(e) => setNewcompanyRow({ ...newcompanyRow, link: e.target.value })} /> : row.link}</TableCell>
                                                                <TableCell>
                                                                    {index === editingCompanyIndex ? (
                                                                        <>
                                                                        <Button variant="contained" onClick={handleUpdateCompany} color="warning" style={{ marginRight: '8px' }}>Update</Button>
                                                                        <Button variant="contained" onClick={setEditingCompanyIndex} color="error" style={{ marginRight: '8px' }}>Cancel</Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                        <Button variant="contained" onClick={() => handleEditCompany(index)} color="warning" style={{ marginRight: '8px' }}>Edit</Button>
                                                                        <Button variant="contained" onClick={() => handleDeleteCompany(index)} color="error" style={{ marginRight: '8px' }}>Delete</Button>
                                                                        </>
                                                                    )}
                                                                </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            </TableBody>
                                                        </Table>
                                                        </TableContainer>
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