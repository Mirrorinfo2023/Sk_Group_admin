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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Card Component
function StatCard({ label, value, index }) {
    return (
        <Paper
            sx={{
                flex: "1 1 120px",
                p: 2,
                borderRadius: 2,
                backgroundColor: index % 2 === 0 ? "#e0f2fe" : "#fef9c3",
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

export default function ProfitReturnSection({ summary = {}, report = [] }) {
    // ---- Profit/Return Chart ----
    const chartData = useMemo(() => {
        const today = summary.today_earning || 0;
        const month = summary.this_month_return || 0;
        const total = summary.total_return || 0;

        // ensure minimum visible height
        const safeValue = (v) => (v === 0 ? 0.5 : v);

        return {
            labels: ["Today's Earning", "This Month Return", "Total Return"],
            datasets: [
                {
                    label: "Profit / Return",
                    data: [safeValue(today), safeValue(month), safeValue(total)],
                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderWidth: 1,
                    borderRadius: 6,
                    maxBarThickness: 80,
                },
            ],
        };
    }, [summary]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Profit / Return Overview" },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                font: { weight: "bold", size: 12 },
                formatter: (value, context) => {
                    // show ₹ + original value, not the 0.5
                    const original = [
                        summary.today_earning || 0,
                        summary.this_month_return || 0,
                        summary.total_return || 0,
                    ][context.dataIndex];
                    return `₹${original.toLocaleString()}`;
                },
            },
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
            x: {
                grid: { display: false },
            },
        },
    };

    // ---- Cycle Summary (5, 15, 25) ----
    const cycleSummary = useMemo(() => {
        const result = {
            "5": { count: 0, totalInvestment: 0 },
            "15": { count: 0, totalInvestment: 0 },
            "25": { count: 0, totalInvestment: 0 },
        };

        report.forEach((r) => {
            const cycle = String(r.payout_cycle || "").trim();
            const invest = parseFloat(r.investment_amount) || 0;
            if (result[cycle]) {
                result[cycle].count += 1;
                result[cycle].totalInvestment += invest;
            }
        });

        return result;
    }, [report]);

    return (
        <Box sx={{ width: "100%", mt: 3 }}>
            {/* Summary Cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <StatCard
                    label="Today's Earning"
                    value={`₹${(summary.today_earning || 0).toLocaleString()}`}
                    index={0}
                />
                <StatCard
                    label="This Month Return"
                    value={`₹${(summary.this_month_return || 0).toLocaleString()}`}
                    index={1}
                />
                <StatCard
                    label="Total Return"
                    value={`₹${(summary.total_return || 0).toLocaleString()}`}
                    index={2}
                />

                {/* ✅ 3 Cards for Cycle Summary */}
                {["5", "15", "25"].map((cycle, idx) => {
                    const data = cycleSummary[cycle] || { count: 0, totalInvestment: 0 };
                    return (
                        <StatCard
                            key={cycle}
                            label={`${cycle}th Cycle (${data.count})`}
                            value={`₹${data.totalInvestment.toLocaleString()}`}
                            index={idx + 3}
                        />
                    );
                })}
            </Box>

            {/* Chart + Table */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 300, height: 400 }}>
                    <Bar data={chartData} options={chartOptions} />
                </Paper>

                <Paper
                    sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 3,
                        minWidth: 300,
                        height: 400,
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        Profit Return Report
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#F0F3FF" }}>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Sr.No.</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Name</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>MR ID</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Mobile</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Cycle</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Status</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Todays Earning</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>This Month Return</TableCell>
                                <TableCell sx={{whiteSpace:"nowrap"}}>Total Return</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((row, i) => (
                                <TableRow key={row.user_id} hover>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{i + 1}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{row.user_name}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{row.mr_id}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{row.mobile}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{row.payout_cycle}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>{row.status}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>₹{(row.today_earning || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>₹{(row.this_month_return || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{whiteSpace:"nowrap"}}>₹{(row.total_return || 0).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
}
