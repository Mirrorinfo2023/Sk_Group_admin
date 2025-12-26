import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption"; // Adjust import path

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
    padding: 10,
    borderRight: '1px solid #e3e3e3',
    letterSpacing: 1,
    textTransform: 'uppercase',
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        background: '#f5faff',
    },
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
        const from_date = `01-${month}-${year}`;
        const to_date = `${day}-${month}-${year}`;
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
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
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

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));


    const [formattedDate, setFormattedDate] = useState('');


    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [openModal3, setOpenModal3] = React.useState(false);
    const [Id, setId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    // const [rejectionReason, setRejectionReason] = useState(null);

    const handleOpenModal1 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleOpenModal3 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
    };

    const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (Id, status) => {
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
        if (!Id) {
            console.error("❌ Id is missing.");
            return;
        }

        let action = "";
        if (status === 0) {
            action = "Delete";
        } else if (status === 1) {
            action = "Active";
        } else {
            action = "Inactive";
        }

        const requestData = {
            status,
            id: Id,
            action
        };

        try {
            // 🔒 Encrypt request data
            const encryptedData = DataEncrypt(JSON.stringify(requestData));
            console.log("🔒 Sending Encrypted Data:", encryptedData);

            // Send encrypted payload
            const response = await api.post("/api/banner/update-banner-status", { data: encryptedData });

            // 🔓 Decrypt backend response
            const decrypted = DataDecrypt(response.data.data);

            console.log("✅ Decrypted Update Response:", decrypted);

            if (decrypted.status === 200) {
                alert(decrypted.message);
                location.reload();
            } else {
                alert("Failed to update");
                console.log("Failed to update status.");
            }
        } catch (error) {
            console.error("❌ Error:", error);
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
                sx={{ padding: 2 }}
            >
                <Grid item={true} xs={12}   >



                    <ThemedTableContainer>

                        <Table aria-label="Banners Report">

                            <TableHead>
                                <TableRow>


                                    <ThemedTableHeadCell nowrap>Sl No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>App Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Banner Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>banner Used For</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>BannersTitle</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Image</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Created Date</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Status</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Action</ThemedTableHeadCell>


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

                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.app_name || '-'}</StyledTableCell>
                                        <StyledTableCell>{row.category}</StyledTableCell>
                                        <StyledTableCell>{row.banner_for}</StyledTableCell>
                                        <StyledTableCell>{row.title}</StyledTableCell>
                                        <StyledTableCell><Link href="#" onClick={() => handleLinkClick(row.img)}>View Image</Link></StyledTableCell>
                                        <StyledTableCell>{row.created_on}</StyledTableCell>
                                        <StyledTableCell style={{ color: row.status === 1 ? 'Green' : (row.status === 2 ? 'Red' : 'Black') }}>
                                            {row.status === 1 ? 'Active' : (row.status === 2 ? 'Inactive' : 'Deleted')}
                                        </StyledTableCell>

                                        <StyledTableCell sx={{ '& button': { m: 1 } }}>
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
                                                            {/* <Button variant="contained" size="small" color="success" onClick={() => handleOpenModal1(row.id, 1)}>
                                                         Edit
                                                    </Button> */}
                                                            <Button variant="contained" size="small" color="warning" onClick={() => handleOpenModal2(row.id, 2)}>
                                                                Inactive
                                                            </Button>
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
                                                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to activate this banner?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>

                                            <Modal
                                                open={openModal2}
                                                onClose={handleCloseModal2}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to in-activate this banner?
                                                    </Typography>
                                                    {/* <TextareaAutosize 
                                                            aria-label="minimum height" 
                                                            minRows={10} 
                                                            placeholder="Enter Rejection Reason" 
                                                            style={{ width: 400}} 
                                                            value={rejectionReason}
                                                          
                                                    /> */}
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>


                                            <Modal
                                                open={openModal3}
                                                onClose={handleCloseModal3}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to delete this Banner?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>



                                        </StyledTableCell>





                                    </ThemedTableRow>

                                )) : (

                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
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
        </main>
    )
}
export default BannersTransactions;