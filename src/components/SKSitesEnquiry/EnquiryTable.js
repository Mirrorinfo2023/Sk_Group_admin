import { Box, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
    cursor: 'pointer',
    '&:hover': {
        background: 'linear-gradient(90deg, #1e88e5 0%, #1e9fe5 100%)',
    },
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
        status === 'active' ? 'rgba(76, 175, 80, 0.1)' :
            status === 'pending' ? 'rgba(255, 193, 7, 0.1)' :
                status === 'resolved' ? 'rgba(33, 150, 243, 0.1)' :
                    status === 'rejected' ? 'rgba(244, 67, 54, 0.1)' :
                        status === 'open' ? 'rgba(76, 175, 80, 0.1)' :
                            status === 'closed' ? 'rgba(33, 150, 243, 0.1)' :
                                'rgba(158, 158, 158, 0.1)',
    color:
        status === 'active' ? '#2e7d32' :
            status === 'pending' ? '#ff9800' :
                status === 'resolved' ? '#1976d2' :
                    status === 'rejected' ? '#d32f2f' :
                        status === 'open' ? '#2e7d32' :
                            status === 'closed' ? '#1976d2' :
                                '#616161',
}));

const EnquiryTable = ({ rows, onSort, sortField, sortDirection }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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

    // Helper function to render sort icon
    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc'
            ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
            : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />;
    };

    // Fixed getStatusChip function - handles both string and number status
    const getStatusChip = (status) => {
        // Convert to string and handle null/undefined
        const statusStr = String(status || 'unknown').toLowerCase();

        // Define status mapping
        const statusMap = {
            '0': { text: 'Pending', color: 'pending' },
            '1': { text: 'Active', color: 'active' },
            '2': { text: 'Resolved', color: 'resolved' },
            '3': { text: 'Cancelled', color: 'rejected' },
            'pending': { text: 'Pending', color: 'pending' },
            'active': { text: 'Active', color: 'active' },
            'resolved': { text: 'Resolved', color: 'resolved' },
            'open': { text: 'Open', color: 'active' },
            'closed': { text: 'Closed', color: 'resolved' },
            'completed': { text: 'Completed', color: 'resolved' },
            'cancelled': { text: 'Cancelled', color: 'rejected' },
            'rejected': { text: 'Rejected', color: 'rejected' },
            'new': { text: 'New', color: 'pending' },
            'in progress': { text: 'In Progress', color: 'active' }
        };

        const statusInfo = statusMap[statusStr] || {
            text: statusStr.charAt(0).toUpperCase() + statusStr.slice(1),
            color: 'unknown'
        };

        return (
            <StatusChip status={statusInfo.color}>
                {statusInfo.text}
            </StatusChip>
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table size="small" aria-label="Enquiries Report">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell width="5%" onClick={() => onSort("id")}>
                                       Sr.No.
                                        {renderSortIcon("id")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="15%" onClick={() => onSort("full_name")}>
                                        Full Name
                                        {renderSortIcon("full_name")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="10%" onClick={() => onSort("mobile")}>
                                        Mobile
                                        {renderSortIcon("mobile")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="15%" onClick={() => onSort("email")}>
                                        Email
                                        {renderSortIcon("email")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="20%" onClick={() => onSort("reason")}>
                                        Reason
                                        {renderSortIcon("reason")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="15%" onClick={() => onSort("status")}>
                                        Status
                                        {renderSortIcon("status")}
                                    </ThemedTableHeadCell>
                                    <ThemedTableHeadCell width="10%" onClick={() => onSort("createdAt")}>
                                        Date
                                        {renderSortIcon("createdAt")}
                                    </ThemedTableHeadCell>
                                  
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows && rows.length > 0 ? (
                                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <ThemedTableRow key={row.id || index} sx={{ height: '40px' }}>
                                            <StyledTableCell>
                                                {index + 1 + page * rowsPerPage}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <span>{truncateText(row.full_name, 20)}</span>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title={row.mobile || '-'} arrow>
                                                    <span>{row.mobile || '-'}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title={row.email || '-'} arrow>
                                                    <span>{truncateText(row.email, 25)}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title={row.reason || '-'} arrow>
                                                    <span>{truncateText(row.reason, 40)}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {getStatusChip(row.status)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatDate(row.created_at)}
                                            </StyledTableCell>
                                          
                                        </ThemedTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#f44336' }}>
                                                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                                                <Typography variant="body2" fontWeight={600}>
                                                    No Enquiries Found
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
                        count={rows?.length || 0}
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
                </Grid>
            </Grid>
        </Box>
    );
};

export default EnquiryTable;