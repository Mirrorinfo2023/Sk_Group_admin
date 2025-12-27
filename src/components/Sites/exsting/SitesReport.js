import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Tooltip, IconButton } from "@mui/material";
import { useState } from "react";
import api from "../../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DataEncrypt, DataDecrypt } from "../../../../utils/encryption";
import EditIcon from '@mui/icons-material/Edit';
import PhotoIcon from '@mui/icons-material/Photo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};

const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.05)',
    marginTop: 1,
    marginBottom: 1,
    overflow: 'hidden',
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 12,
    padding: '8px 4px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        background: '#f8fafc',
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e3f2fd',
        color: theme.palette.common.black,
        fontSize: 12,
        padding: '6px 4px',
        borderRight: "1px solid rgba(224, 224, 224, 0.8)"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11,
        padding: '4px 4px',
        borderRight: "1px solid rgba(224, 224, 224, 0.8)",
        lineHeight: 1.2,
    },
}));

const StatusChip = styled(Box)(({ status }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 600,
    backgroundColor:
        status === 1 ? 'rgba(76, 175, 80, 0.1)' :
            status === 2 ? 'rgba(244, 67, 54, 0.1)' :
                'rgba(158, 158, 158, 0.1)',
    color:
        status === 1 ? '#2e7d32' :
            status === 2 ? '#d32f2f' :
                '#616161',
}));

const CompactButton = styled(IconButton)(({ theme, color }) => ({
    padding: 3,
    margin: '0 1px',
    fontSize: 10,
    minWidth: 'auto',
    '& .MuiSvgIcon-root': {
        fontSize: 14,
    },
    backgroundColor: color ? `${theme.palette[color].main}15` : 'transparent',
    '&:hover': {
        backgroundColor: color ? `${theme.palette[color].main}25` : 'rgba(0,0,0,0.04)',
    }
}));

const SitesTransactions = ({ showSites, onEditClick, loading }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    const [Id, setId] = useState(null);
    const [status, setStatus] = useState(null);

    let rows = showSites && showSites.length > 0 ? [...showSites] : [];

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
            const encryptedData = DataEncrypt(JSON.stringify(requestData));
            const response = await api.post("/api/site/update-site-status", { data: encryptedData });
            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                alert(decrypted.message);
                location.reload();
            } else {
                alert("Failed to update");
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

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '-';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Handle edit button click
    const handleEdit = (row) => {
        if (onEditClick) {
            onEditClick(row);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table size="small" aria-label="Sites Report">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell width="5%">#</ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="15%">Site Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="20%">Location</ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="20%">Information</ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="10%">Photo</ThemedTableHeadCell>

                                    <ThemedTableHeadCell width="10%">Status</ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="10%">Action</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showSites.length > 0 ? (
                                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <ThemedTableRow key={index} sx={{ height: '40px' }}>
                                            <StyledTableCell>
                                                {index + 1 + page * rowsPerPage}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <span>{truncateText(row.site_name, 20)}</span>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title={row.location || '-'} arrow>
                                                    <span>{truncateText(row.location, 25)}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title={row.information || '-'} arrow>
                                                    <span>{truncateText(row.information, 30)}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.photo ? (
                                                    <Link href="#" onClick={() => handleLinkClick(row.photo)}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <PhotoIcon sx={{ fontSize: 12, color: '#2196f3' }} />
                                                            <span style={{ fontSize: 10 }}>View</span>
                                                        </Box>
                                                    </Link>
                                                ) : '-'}
                                            </StyledTableCell>

                                            <StyledTableCell>
                                                <StatusChip status={row.status}>
                                                    {row.status === 1 ? 'Active' : row.status === 2 ? 'Inactive' : 'Deleted'}
                                                </StatusChip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Tooltip title="Edit">
                                                        <CompactButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() => handleEdit(row)}
                                                            disabled={loading}
                                                        >
                                                            <EditIcon fontSize="inherit" />
                                                        </CompactButton>
                                                    </Tooltip>

                                                    {row.status !== 0 && (
                                                        <>
                                                            {row.status === 2 && (
                                                                <>
                                                                    <Tooltip title="Activate">
                                                                        <CompactButton
                                                                            size="small"
                                                                            color="success"
                                                                            onClick={() => handleOpenModal1(row.id, 1)}
                                                                            disabled={loading}
                                                                        >
                                                                            <CheckCircleIcon fontSize="inherit" />
                                                                        </CompactButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete">
                                                                        <CompactButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleOpenModal3(row.id, 0)}
                                                                            disabled={loading}
                                                                        >
                                                                            <DeleteIcon fontSize="inherit" />
                                                                        </CompactButton>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                            {row.status === 1 && (
                                                                <Tooltip title="Deactivate">
                                                                    <CompactButton
                                                                        size="small"
                                                                        color="warning"
                                                                        onClick={() => handleOpenModal2(row.id, 2)}
                                                                        disabled={loading}
                                                                    >
                                                                        <CancelIcon fontSize="inherit" />
                                                                    </CompactButton>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </StyledTableCell>
                                        </ThemedTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#f44336' }}>
                                                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                                                <Typography variant="body2" fontWeight={600}>
                                                    No Sites Found
                                                </Typography>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ThemedTableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid #e0e0e0',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            fontSize: 12,
                        }}
                    />

                    {/* Modals */}
                    <Modal open={openModal1} onClose={handleCloseModal1}>
                        <Box sx={style}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <HelpOutlineOutlinedIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Box>
                            <Typography align="center" variant="h6" component="h2" gutterBottom>
                                Activate this site?
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button size="small" variant="outlined" onClick={handleCloseModal1}>Cancel</Button>
                                <Button size="small" variant="contained" color="success" onClick={handleOKButtonClick}>OK</Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Modal open={openModal2} onClose={handleCloseModal2}>
                        <Box sx={style}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <HelpOutlineOutlinedIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Box>
                            <Typography align="center" variant="h6" component="h2" gutterBottom>
                                Deactivate this site?
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button size="small" variant="outlined" onClick={handleCloseModal2}>Cancel</Button>
                                <Button size="small" variant="contained" color="success" onClick={handleOKButtonClick}>OK</Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Modal open={openModal3} onClose={handleCloseModal3}>
                        <Box sx={style}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <HelpOutlineOutlinedIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Box>
                            <Typography align="center" variant="h6" component="h2" gutterBottom>
                                Delete this site?
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button size="small" variant="outlined" onClick={handleCloseModal3}>Cancel</Button>
                                <Button size="small" variant="contained" color="success" onClick={handleOKButtonClick}>OK</Button>
                            </Box>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SitesTransactions;