"use client"
import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Modal,
    Switch,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Edit,
    Delete,
    HelpOutline,
    InfoOutlined,
    InsertDriveFile,
} from '@mui/icons-material';

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

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#ffffff',
    },
    '&:nth-of-type(even)': {
        backgroundColor: '#f5f5f5',
    },
    '&:hover': {
        backgroundColor: '#e3f2fd',
    },
}));

const PoliciesTable = ({ policies, loading, onDelete, onStatusChange, onEdit }) => {
    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [modalType, setModalType] = useState(''); // 'delete' or 'status'

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
            lineHeight: '15px',
            padding: 7,
            border: '1px solid rgba(224, 224, 224, 1)',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            lineHeight: '15px',
            padding: 7,
            border: '1px solid rgba(224, 224, 224, 1)',
        },
    }));


    const getStatusChip = (status) => {
        switch (parseInt(status)) {
            case 1:
                return {
                    label: "Active",
                    color: "Green",
                    bgColor: "#e8f5e9"
                };
            case 2:
                return {
                    label: "Inactive",
                    color: "Red",
                    bgColor: "#ffebee"
                };
            default:
                return {
                    label: "Unknown",
                    color: "Black",
                    bgColor: "#f5f5f5"
                };
        }
    };

    const truncateContent = (content, length = 100) => {
        if (!content) return "";
        if (content.length <= length) return content;
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > length
            ? plainText.substring(0, length) + '...'
            : plainText;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleOpenModal = (policy, type) => {
        setSelectedPolicy(policy);
        setModalType(type);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPolicy(null);
        setModalType('');
    };

    const handleConfirmAction = () => {
        if (modalType === 'delete' && selectedPolicy) {
            onDelete(selectedPolicy.id);
        } else if (modalType === 'status' && selectedPolicy) {
            onStatusChange(selectedPolicy.id, parseInt(selectedPolicy.status));
        }
        handleCloseModal();
    };

    const getModalContent = () => {
        if (modalType === 'delete') {
            return {
                title: `Are you sure you want to delete "${selectedPolicy?.category_name}" policy?`,
                buttonText: "Delete"
            };
        } else if (modalType === 'status') {
            const newStatus = selectedPolicy?.status === '1' ? 'Inactive' : 'Active';
            return {
                title: `Are you sure you want to ${newStatus.toLowerCase()} this policy?`,
                buttonText: "Confirm"
            };
        }
        return { title: "", buttonText: "" };
    };

    const modalContent = getModalContent();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const rows = policies || [];

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table aria-label="Policies Report">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell nowrap>Sr. No</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Content Preview</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Status</ThemedTableHeadCell>
                                    {/* <ThemedTableHeadCell nowrap>Created On</ThemedTableHeadCell>
                                    <ThemedTableHeadCell nowrap>Updated On</ThemedTableHeadCell> */}
                                    <ThemedTableHeadCell nowrap>Actions</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length > 0 ? (
                                    rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((policy, index) => {
                                            const statusChip = getStatusChip(policy.status);
                                            return (
                                                <ThemedTableRow
                                                    key={policy.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                                    <StyledTableCell>
                                                        <Chip
                                                            label={policy.category_name}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#e3f2fd',
                                                                color: '#1976d2',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ maxWidth: 300 }}>
                                                        <Typography variant="body2" sx={{
                                                            color: '#555',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}>
                                                            {truncateContent(policy.content)}
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Switch
                                                                checked={parseInt(policy.status) === 1}
                                                                onChange={() => handleOpenModal(policy, 'status')}
                                                                color="success"
                                                                size="small"
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: statusChip.color,
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {statusChip.label}
                                                            </Typography>
                                                        </Box>
                                                    </StyledTableCell>
                                                    {/* <StyledTableCell>
                                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                                            {formatDate(policy.created_on)}
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                                            {policy.updated_on ? formatDate(policy.updated_on) : "Never"}
                                                        </Typography>
                                                    </StyledTableCell> */}
                                                    <StyledTableCell sx={{ '& button': { m: 0.5 } }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => onEdit(policy)}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                                                boxShadow: 'none',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(90deg, #1e88e5 0%, #1cb5e0 100%)',
                                                                    boxShadow: 'none',
                                                                },
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>

                                                        {/* <Tooltip title="Delete Policy">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenModal(policy, 'delete')}
                                                                sx={{
                                                                    bgcolor: '#ffebee',
                                                                    color: '#d32f2f',
                                                                    '&:hover': {
                                                                        bgcolor: '#ffcdd2'
                                                                    }
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </StyledTableCell>
                                                </ThemedTableRow>
                                            );
                                        })
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={7} align="center">
                                            <NoRecordsBox>
                                                <InfoOutlined color="error" sx={{ fontSize: 28 }} />
                                                No Records Found.
                                            </NoRecordsBox>
                                        </StyledTableCell>
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

                    {/* Confirmation Modal */}
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                            <HelpOutline sx={{ fontSize: 40, marginLeft: 'auto', marginRight: 'auto', display: 'block' }} color="warning" />
                            <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={{ mt: 2 }}>
                                {modalContent.title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color={modalType === 'delete' ? 'error' : 'primary'}
                                    onClick={handleConfirmAction}
                                >
                                    {modalContent.buttonText}
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </main>
    );
};

export default PoliciesTable;