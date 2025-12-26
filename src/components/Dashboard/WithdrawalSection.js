"use client";
import React, { useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Card Component
function StatCard({ label, value, bgcolor, index }) {
    return (
        <Paper
            sx={{
                flex: "1 1 120px",
                p: 2,
                borderRadius: 2,
                backgroundColor: bgcolor || (index % 2 === 0 ? "#e0f2fe" : "#fef9c3"),
                textAlign: "center",
                border: "1px solid #e5e7eb",
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {value ?? 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {label}
            </Typography>
        </Paper>
    );
}

// ✅ Refactored WithdrawalSection
export default function WithdrawalSection({ summary = {}, report = [] }) {
    const chartData = useMemo(
        () => ({
            labels: ["Today's Withdrawal", "This Month", "Total Withdrawal"],
            datasets: [
                {
                    label: "Withdrawal Amount",
                    data: [
                        summary.today_withdrawal || 0,
                        summary.month_withdrawal || 0,
                        summary.total_withdrawal || 0,
                    ],
                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderWidth: 2,
                    borderRadius: 5,
                    maxBarThickness: 80,
                },
            ],
        }),
        [summary]
    );

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Withdrawal Overview" },
            tooltip: {
                callbacks: {
                    label: (context) => `₹${context.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`,
                },
            },
        },
    };

    return (
        <Box sx={{ width: "100%", mt: 3 }}>
            {/* Cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <StatCard
                    label="Today's Withdrawal"
                    value={`₹${(summary.today_withdrawal || 0).toLocaleString()}`}
                    index={0}
                />
                <StatCard
                    label="This Month"
                    value={`₹${(summary.month_withdrawal || 0).toLocaleString()}`}
                    index={1}
                />
                <StatCard
                    label="Total Withdrawal"
                    value={`₹${(summary.total_withdrawal || 0).toLocaleString()}`}
                    index={2}
                />
            </Box>

            {/* Chart + Table */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 350 }}>
                    <Bar data={chartData} options={chartOptions} />
                </Paper>

                <Paper
                    sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 350, overflowY: "auto" }}
                >
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        Withdrawal Report
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#F0F3FF" }}>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Sr.</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Mobile</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Refer By</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Amount</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((row, i) => (
                                <TableRow key={i} hover>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{i + 1}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.user_name}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.mobile}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{row.refer_by || "-"}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>₹{Number(row.withdrawal_amount || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{new Date(row.created_on).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
}
