"use client";
import React from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
} from "@mui/material";

export default function TopEarnersReport({ topEarners = [] }) {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                Top Earners
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Paper sx={{ p: 2, borderRadius: 3, maxHeight: 450, overflow: "hidden" }}>
                {/* Scrollable Table */}
                <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>Sr.No</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>User Name</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>Mobile</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>City</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>Refer By</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>Investment Amount</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", backgroundColor: "#F0F3FF" }}>Earned Amount</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {topEarners.map((user, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{user.user_name}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{user.mobile}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{user.circle || "-"}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{user.referred_by_name}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        ₹{parseFloat(user.investment_amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        ₹{parseFloat(user.earned_amount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        </Box>
    );
}
