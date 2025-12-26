import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableCell,
    Chip,
    Paper,
    Typography,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Simple color scheme
const COLORS = {
    primary: '#1976d2',
    light: '#f5f5f5',
    white: '#ffffff',
    black: '#000000',
    grey: '#757575'
};

// Styled components
const StyledTableContainer = styled(TableContainer)({
    background: 'white',
    borderRadius: 8,
    border: `1px solid #e0e0e0`,
    marginBottom: 16,
});

const StyledTableHead = styled(TableHead)({
    backgroundColor: COLORS.primary,
});

const StyledTableHeaderCell = styled(TableCell)({
    fontWeight: '600',
    fontSize: '12px',
    padding: '12px 8px',
    color: 'white',
    borderRight: `1px solid rgba(255,255,255,0.2)`,
    whiteSpace: "nowrap"
});

const StyledTableCell = styled(TableCell)({
    padding: '10px 8px',
    borderRight: `1px solid #e0e0e0`,
    fontSize: '12px',
    color: COLORS.black,
    whiteSpace: "nowrap"
});

const StyledTableRow = styled(TableRow)({
    '&:nth-of-type(even)': {
        backgroundColor: '#fafafa',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

// Status chips
const StatusChip = styled(Chip)({
    fontWeight: 500,
    fontSize: '10px',
    height: '20px',
});

const ActiveChip = styled(StatusChip)({
    backgroundColor: '#4caf50',
    color: 'white',
});

const InactiveChip = styled(StatusChip)({
    backgroundColor: '#f44336',
    color: 'white',
});

const ProfitTransactions = ({ showServiceTrans, selectedColumns = {} }) => {
    const getDate = (timeZone) => {
        if (!timeZone) return '-';
        try {
            const dateObject = new Date(timeZone);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");
            return `${day}/${month}/${year}`;
        } catch {
            return '-';
        }
    };

    let rows = [];
    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [...showServiceTrans];
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        const numAmount = parseFloat(amount);

        return `₹${numAmount.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        })}`;
    };

    // All available columns
    const defaultColumns = {
        index: true,
        user_id: true,
        user_name: true,
        mr_id: true,
        mobile: true,
        email: true,
        registration_date: true,
        investment_date: true,
        investment_amount: true,
        user_in: true,
        payout_cycle: true,
        status: true,
        today_earning: true,
        this_month_return: true,
        month_team_earning: true,
        total_return: true,
        total_team_earning: true,
        total_remaining: true
    };

    const columns = { ...defaultColumns, ...selectedColumns };

    return (
        <Box sx={{ padding: 2, backgroundColor: 'primary', minHeight: '100vh' }}>
            <StyledTableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table stickyHeader size="small" sx={{ minWidth: 1600 }}>
                    <StyledTableHead>
                        <TableRow>
                            {columns.index && (
                                <StyledTableHeaderCell sx={{ width: 50, backgroundColor: '#1976d2' }}>#</StyledTableHeaderCell>
                            )}
                            {columns.user_id && (
                                <StyledTableHeaderCell sx={{ width: 70, backgroundColor: '#1976d2' }}>User ID</StyledTableHeaderCell>
                            )}
                            {columns.user_name && (
                                <StyledTableHeaderCell sx={{ width: 120, backgroundColor: '#1976d2' }}>Name</StyledTableHeaderCell>
                            )}
                            {columns.mr_id && (
                                <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#1976d2' }}>MR ID</StyledTableHeaderCell>
                            )}
                            {columns.mobile && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Mobile</StyledTableHeaderCell>
                            )}
                            {columns.email && (
                                <StyledTableHeaderCell sx={{ width: 150, backgroundColor: '#1976d2' }}>Email</StyledTableHeaderCell>
                            )}
                            {columns.registration_date && (
                                <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#1976d2' }}>Reg Date</StyledTableHeaderCell>
                            )}
                            {columns.investment_date && (
                                <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#1976d2' }}>Inv Date</StyledTableHeaderCell>
                            )}
                            {columns.investment_amount && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Investment</StyledTableHeaderCell>
                            )}
                            {columns.user_in && (
                                <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#1976d2' }}>Plan</StyledTableHeaderCell>
                            )}
                            {columns.payout_cycle && (
                                <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#1976d2' }}>Payout</StyledTableHeaderCell>
                            )}
                            {columns.status && (
                                <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#1976d2' }}>Status</StyledTableHeaderCell>
                            )}
                            {columns.today_earning && (
                                <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#1976d2' }}>Today</StyledTableHeaderCell>
                            )}
                            {columns.this_month_return && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Month Return</StyledTableHeaderCell>
                            )}
                            {columns.month_team_earning && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Month Team</StyledTableHeaderCell>
                            )}
                            {columns.total_return && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Total Return</StyledTableHeaderCell>
                            )}
                            {columns.total_team_earning && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Total Team</StyledTableHeaderCell>
                            )}
                            {columns.total_remaining && (
                                <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#1976d2' }}>Remaining</StyledTableHeaderCell>
                            )}
                        </TableRow>
                    </StyledTableHead>

                    <TableBody>
                        {rows.length > 0 ? (
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <StyledTableRow key={index}>
                                        {columns.index && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {index + 1 + page * rowsPerPage}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.user_id && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {row.user_id || "-"}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.user_name && (
                                            <StyledTableCell>
                                                <Tooltip title={row.user_name || "-"}>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 120, fontWeight: '500' }}>
                                                        {row.user_name || "-"}
                                                    </Typography>
                                                </Tooltip>
                                            </StyledTableCell>
                                        )}

                                        {columns.mr_id && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {row.mr_id || "-"}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.mobile && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {row.mobile || "-"}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.email && (
                                            <StyledTableCell>
                                                <Tooltip title={row.email || "-"}>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontWeight: '400' }}>
                                                        {row.email || "-"}
                                                    </Typography>
                                                </Tooltip>
                                            </StyledTableCell>
                                        )}

                                        {columns.registration_date && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="400">
                                                    {getDate(row.registration_date)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.investment_date && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="400">
                                                    {getDate(row.investment_date)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.investment_amount && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {formatCurrency(row.investment_amount)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.user_in && (
                                            <StyledTableCell>
                                                <Chip
                                                    label={
                                                        row.multiplier
                                                            ? `${row.multiplier === 1 ? "2.5x" : row.multiplier.toFixed(1) + "x"}`
                                                            : "-"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        color: "white",
                                                        backgroundColor: COLORS.primary,
                                                        fontSize: "10px",
                                                    }}
                                                />
                                            </StyledTableCell>
                                        )}

                                        {columns.payout_cycle && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="500">
                                                    {row.payout_cycle ? `Cycle ${row.payout_cycle}` : "-"}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.status && (
                                            <StyledTableCell>
                                                {row.status === 'Active' ? (
                                                    <ActiveChip label="Active" size="small" />
                                                ) : row.status === 'Inactive' ? (
                                                    <InactiveChip label="Inactive" size="small" />
                                                ) : (
                                                    <StatusChip label={row.status || "-"} size="small" />
                                                )}
                                            </StyledTableCell>
                                        )}

                                        {columns.today_earning && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {formatCurrency(row.today_earning)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.this_month_return && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {formatCurrency(row.this_month_return)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.month_team_earning && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {formatCurrency(row.month_team_earning)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.total_return && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="700">
                                                    {formatCurrency(row.total_return)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.total_team_earning && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="600">
                                                    {formatCurrency(row.total_team_earning)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}

                                        {columns.total_remaining && (
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight="700">
                                                    {formatCurrency(row.total_remaining)}
                                                </Typography>
                                            </StyledTableCell>
                                        )}
                                    </StyledTableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={Object.values(columns).filter(Boolean).length} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ textAlign: 'center', color: COLORS.grey }}>
                                        <InfoOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom fontWeight="600">
                                            No Records Found
                                        </Typography>
                                        <Typography variant="body2">
                                            Try adjusting your filters or refresh the data
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            {rows.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100, 250, 500]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: `1px solid #e0e0e0`,
                        backgroundColor: 'white',
                        borderRadius: '0 0 8px 8px',
                        border: `1px solid #e0e0e0`,
                        borderTop: 'none',
                    }}
                />
            )}
        </Box>
    );
};

export default ProfitTransactions;