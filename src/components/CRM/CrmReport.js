"use client"
import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Modal, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import CheckCircle from '@mui/icons-material/CheckCircle';
import HighlightOff from '@mui/icons-material/HighlightOff';
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import Link from "next/link";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";

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
    borderRadius: 2,
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
    padding: 12,
    borderRight: '1px solid #e3e3e3',
    letterSpacing: 1,
    textTransform: 'uppercase',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ccc',
        color: theme.palette.common.black,
        fontSize: 12,
        padding: 10,
        borderRight: "1px solid rgba(224, 224, 224, 1)"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 10,
        borderRight: "1px solid rgba(224, 224, 224, 1)"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#f5faff',
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

const CrmTransactions = ({ showCrmLinks, loading, onRefresh }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'delete', 'edit', 'status'
    const [selectedId, setSelectedId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [editData, setEditData] = useState({ crm_name: '', link: '' });

    // For Edit Modal
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleOpenModal = (id, type, status = null) => {
        setSelectedId(id);
        setModalType(type);
        setSelectedStatus(status);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedId(null);
        setModalType('');
        setSelectedStatus(null);
    };

    const handleOpenEditModal = (crm) => {
        setEditingId(crm.id);
        setEditData({
            crm_name: crm.crm_name || '',
            link: crm.link || ''
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditingId(null);
        setEditData({ crm_name: '', link: '' });
    };

    const handleUpdateCrm = async () => {
        if (!editingId || !editData.crm_name || !editData.link) {
            alert("Please fill all fields");
            return;
        }

        try {
            const requestData = {
                crm_id: editingId,
                crm_name: editData.crm_name,
                link: editData.link
            };

            const encryptedData = DataEncrypt(JSON.stringify(requestData));
            const response = await api.post("/api/admin/f3a1b9c4e8d71b22d901f6a0a4e5cc9812ab44de", { data: encryptedData });

            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                alert(decrypted.message);
                handleCloseEditModal();
                onRefresh(); // Refresh the list
            } else {
                alert("Failed to update CRM link");
            }
        } catch (error) {
            console.error("Error updating CRM:", error);
            alert("Error updating CRM link");
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedId || selectedStatus === null) return;

        let action = "";
        if (selectedStatus === 0) action = "deleted";
        else if (selectedStatus === 1) action = "activated";
        else action = "deactivated";

        try {
            const requestData = {
                crm_id: selectedId,
                status: selectedStatus,
                action: action
            };

            const encryptedData = DataEncrypt(JSON.stringify(requestData));
            const response = await api.post("/api/admin/1c2b6e94fbb4a981d53e9b7f8c22aa7d119bc990", { data: encryptedData });

            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                alert(decrypted.message);
                handleCloseModal();
                onRefresh(); // Refresh the list
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        }
    };

    const handleDeleteCrm = async () => {
        if (!selectedId) return;

        try {
            const requestData = { crm_id: selectedId };
            const encryptedData = DataEncrypt(JSON.stringify(requestData));
            const response = await api.post("/api/admin/1c2b6e94fbb4a981d53e9b7f8c22aa7d119bc445", { data: encryptedData });

            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                alert(decrypted.message);
                handleCloseModal();
                onRefresh(); // Refresh the list
            } else {
                alert("Failed to delete CRM link");
            }
        } catch (error) {
            console.error("Error deleting CRM:", error);
            alert("Error deleting CRM link");
        }
    };

    const handleConfirmAction = () => {
        if (modalType === 'delete') {
            handleDeleteCrm();
        } else if (modalType === 'status') {
            handleStatusUpdate();
        }
    };

    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const getFormattedDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const rows = showCrmLinks || [];

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table aria-label="CRM Links Report">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell>Sr No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Date</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>CRM Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Link</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Status</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Actions</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length > 0 ? (
                                    rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell>
                                                    {index + 1 + page * rowsPerPage}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {getFormattedDate(row.created_on)}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {row.crm_name || '-'}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<OpenInNewIcon />}
                                                        onClick={() => handleLinkClick(row.link)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        View Link
                                                    </Button>
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    style={{
                                                        color: row.status === 1 ? 'Green' :
                                                            row.status === 2 ? 'Red' :
                                                                'Gray',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {row.status === 1 ? 'Active' :
                                                        row.status === 2 ? 'Inactive' :
                                                            'Deleted'}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {row.status !== 0 && (
                                                            <>
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => handleOpenEditModal(row)}
                                                                    title="Edit"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>

                                                                {row.status === 2 ? (
                                                                    <IconButton
                                                                        color="success"
                                                                        size="small"
                                                                        onClick={() => handleOpenModal(row.id, 'status', 1)}
                                                                        title="Activate"
                                                                    >
                                                                        <CheckCircle fontSize="small" />
                                                                    </IconButton>
                                                                ) : (
                                                                    <IconButton
                                                                        color="warning"
                                                                        size="small"
                                                                        onClick={() => handleOpenModal(row.id, 'status', 2)}
                                                                        title="Deactivate"
                                                                    >
                                                                        <HighlightOff fontSize="small" />
                                                                    </IconButton>
                                                                )}

                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() => handleOpenModal(row.id, 'delete')}
                                                                    title="Delete"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )}
                                                    </Box>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <NoRecordsBox>
                                                <InfoOutlinedIcon color="error" sx={{ fontSize: 28 }} />
                                                {loading ? 'Loading...' : 'No Records Found'}
                                            </NoRecordsBox>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ThemedTableContainer>

                    {rows.length > 0 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                            '& .MuiTablePagination-root': {
                                width: '100%'
                            }
                        }}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={onPageChange}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    '& .MuiTablePagination-selectLabel': {
                                        color: '#666',
                                    },
                                    '& .MuiTablePagination-displayedRows': {
                                        color: '#666',
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Delete/Status Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        {modalType === 'delete' ? 'Confirm Delete' : 'Confirm Status Change'}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mb: 3 }}>
                        {modalType === 'delete'
                            ? 'Are you sure you want to delete this CRM link? This action cannot be undone.'
                            : selectedStatus === 1
                                ? 'Are you sure you want to activate this CRM link?'
                                : 'Are you sure you want to deactivate this CRM link?'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseModal}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color={modalType === 'delete' ? 'error' : 'primary'}
                            onClick={handleConfirmAction}
                            sx={{ textTransform: 'none' }}
                        >
                            {modalType === 'delete' ? 'Delete' : 'Confirm'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-modal-title"
                fullWidth
            >
                <Box sx={style}>
                    <Typography id="edit-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                        Edit CRM Link
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <TextField
                            label="CRM Name"
                            value={editData.crm_name}
                            onChange={(e) => setEditData({ ...editData, crm_name: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Link"
                            value={editData.link}
                            onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                            fullWidth
                            size="small"
                            placeholder="https://example.com"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseEditModal}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateCrm}
                            sx={{ textTransform: 'none' }}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    );
};

export default CrmTransactions;