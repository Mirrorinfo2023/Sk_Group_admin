import { Box, Button, Divider, TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Link from "next/link";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import api from "../../../utils/api";
import styles from "./Leads.module.css";

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

const LeadsTrackDetailsHistory = ({ showServiceTrans }) => {

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



    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [rejectionReason, setRejectionReason] = useState(null);


    const handleOpenModal1 = (addMoneyReqId, status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (addMoneyReqId, status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
    };

    const handleOKButtonClick = async () => {
        // alert(status);
        if (!addMoneyReqId) {
            console.error('Id is missing.');
            return;
        }
        let note = '';
        let action = '';
        if (status === 1) {
            note = 'Approve';
            action = 'Approve';
        } else if (status === 2) {
            note = rejectionReason; // Use the rejectionReason state
            action = 'Reject';
        } else {
            note = '';
            action = '';
        }

        const requestData = {
            status: status,
            note: note,
            id: addMoneyReqId,
            action: action
        };


        try {
            console.log(requestData);
            const response = await api.post("/api/leads/update-lead-status", requestData);

            if (response.data.status === 200) {
                location.reload();

            } else {
                console.log('Failed to update status.');

            }

        } catch (error) {
            console.error("Error:", error);

        }

        handleCloseModal1();
        handleCloseModal2();
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={3} className={styles.container}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table aria-label="User Details" className={styles.table}>
                            <TableHead>
                                <TableRow className={styles.tableHeadRow}>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>User Name</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>User Id</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length > 0 ? (
                                    (rowsPerPage > 0
                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows
                                    ).map((row, index) => (
                                        <TableRow
                                            key={index}
                                            className={styles.tableRow}
                                        >
                                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                            <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                                            <TableCell>{row.mobile}</TableCell>
                                            <TableCell className={styles.userIdCell}>{row.mlm_id}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell className={styles.redeemDate}>{row.created_on}</TableCell>
                                            <TableCell
                                                className={
                                                    row.status === 0
                                                        ? styles.statusPending
                                                        : row.status === 1
                                                            ? styles.statusApproved
                                                            : styles.statusRejected
                                                }
                                            >
                                                {row.status === 0
                                                    ? "Pending"
                                                    : row.status === 1
                                                        ? "Approved"
                                                        : "Rejected"}
                                            </TableCell>
                                            <TableCell className={styles.actionButtons}>
                                                {row.status === 0 && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleOpenModal1(row.id, 1)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleOpenModal2(row.id, 2)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {/* Approve Modal */}
                                                <Modal
                                                    open={openModal1}
                                                    onClose={handleCloseModal1}
                                                    aria-labelledby="modal-approve-title"
                                                >
                                                    <Box className={styles.modalBox}>
                                                        <HelpOutlineOutlinedIcon
                                                            className={styles.modalIcon}
                                                            color="warning"
                                                        />
                                                        <Typography id="modal-approve-title" variant="h6">
                                                            Are you sure to approve the Leads?
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            size="large"
                                                            color="success"
                                                            onClick={handleOKButtonClick}
                                                            className={styles.modalOkButton}
                                                        >
                                                            OK
                                                        </Button>
                                                    </Box>
                                                </Modal>

                                                {/* Reject Modal */}
                                                <Modal
                                                    open={openModal2}
                                                    onClose={handleCloseModal2}
                                                    aria-labelledby="modal-reject-title"
                                                >
                                                    <Box className={styles.modalBox}>
                                                        <HelpOutlineOutlinedIcon
                                                            className={styles.modalIcon}
                                                            color="warning"
                                                        />
                                                        <Typography id="modal-reject-title" variant="h6">
                                                            Are you sure to Reject the Leads?
                                                        </Typography>
                                                        <TextareaAutosize
                                                            minRows={10}
                                                            placeholder="Enter Rejection Reason"
                                                            className={styles.textarea}
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            size="large"
                                                            color="success"
                                                            onClick={handleOKButtonClick}
                                                            className={styles.modalOkButton}
                                                        >
                                                            OK
                                                        </Button>
                                                    </Box>
                                                </Modal>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className={styles.noRecordsBox}>
                                            <Typography className={styles.noRecordsText}>
                                                No Records Found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
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
}
export default LeadsTrackDetailsHistory;