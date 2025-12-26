import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Link, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import api from "../../../utils/api";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 16,
    boxShadow: 24,
    p: 4,
};

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
    fontSize: 14,
    padding: '8px 10px',
    borderRight: '1px solid #e3e3e3',
    letterSpacing: 1,
    textTransform: 'uppercase',
    height: '40px',
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
    fontSize: 18,
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
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = rows.filter(row => {
        return (
            (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [openModal3, setOpenModal3] = React.useState(false);
    const [status, setStatus] = React.useState(null);
    const [Id, setAddMoneyReqId] = React.useState(null);

    const handleOpenModal1 = (addMoneyReqId,status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal1(true);
    };
    const handleOpenModal2 = (addMoneyReqId,status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal2(true);
    };
    const handleOpenModal3 = (addMoneyReqId,status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal3(true);
    };
    const handleCloseModal1 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal1(false);
    };
    const handleCloseModal2 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal2(false);
    };
    const handleCloseModal3 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal3(false);
    };
    
    const handleOKButtonClick = async () => {
        if (!Id) {
            console.error('Id is missing.');
            return;
        }
    
        let action='';
        if (status === 0) {
            action='Delete';
        } else if(status === 1) {
            action='Active';
        }else if(status === 2) {
            action='Inactive';
        }
    
        const requestData = {
            status: status,
            id: Id,
            action:action
        };

        try {
            const response = await api.post("/api/leads/update-status-category", requestData);
            
            if (response.data.status === 200) {
                alert(`${action} successfully.`);
                location.reload();
            }else{
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

    const [selectedOption, setSelectedOption] = useState({});

    const handleOptionChange = (event, rowId) => {
        setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            [rowId]: event.target.value,
        }));
    };

    return (
        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}>
                    <ThemedTableContainer>
                        <Table aria-label="Lead Categories">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell>Sr No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Category Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Parent Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Discount Upto</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Category Image</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Action</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <ThemedTableRow
                                                key={row.id || index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.category_name}</TableCell>
                                                <TableCell>{row.parent_category}</TableCell>
                                                <TableCell>{row.discount_upto}</TableCell>
                                                <TableCell>
                                                    {row.category_image !== '' ? (
                                                        <Link href="#" onClick={() => handleLinkClick(row.category_image)}>View</Link>
                                                    ) : ''}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        onChange={(event) => handleOptionChange(event, index)}
                                                        style={{ width: '100px' , height: '40px'}}
                                                    >
                                                        <MenuItem value="active"><Link style={{ textDecoration: 'none',fontSize: '14px' }}>Active</Link></MenuItem>
                                                        <MenuItem value="inactive"><Link style={{ textDecoration: 'none',fontSize: '14px' }}>Inactive</Link></MenuItem>
                                                        <MenuItem value="edit"><Link href={`/edit-leads-category/?id=${row.id}`} style={{ textDecoration: 'none',fontSize: '14px' }}>Edit</Link></MenuItem>
                                                        <MenuItem value="delete"><Link style={{ textDecoration: 'none',fontSize: '14px' }} onClick={() => handleOpenModal1(row.id, 0)}>Delete</Link></MenuItem>
                                                    </Select>
                                                </TableCell>
                                            </ThemedTableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
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
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid #e0e0e0',
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '0 0 16px 16px',
                            '& .MuiTablePagination-select': {
                                minWidth: '80px',
                            },
                            '& .MuiTablePagination-menu': {
                                '& .MuiPaper-root': {
                                    maxHeight: '200px',
                                }
                            },
                            '& .MuiTablePagination-selectRoot': {
                                marginRight: '32px',
                            },
                            '& .MuiTablePagination-toolbar': {
                                minHeight: '52px',
                            }
                        }}
                    />
                </Grid>
            </Grid>

            <Modal 
                open={openModal1} 
                onClose={handleCloseModal1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure to Delete this category?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'}>
                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 20 }}>OK</Button>
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
                 Are you sure to Inactive this category ?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                    <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                    
                </Typography>
              
                </Box>
            </Modal>
            <Modal 
                open={openModal3} 
                onClose={handleCloseModal1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} alignItems={'center'}  justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40 ,marginLeft:20}} color="warning" alignItems={'center'} />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                 Are you sure to Active this category ?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}  alignItems={'center'} >
                    <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft:20 }}>OK</Button>
                    
                </Typography>
              
                </Box>
            </Modal>
        </main>
    );
}
export default Transactions;