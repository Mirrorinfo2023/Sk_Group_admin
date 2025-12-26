"use client";
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function StatSummary({ stats, type = "user" }) {
    const statItems =
        type === "user"
            ? [
                { label: "Total Users", value: stats.total_users },
                { label: "Today's Users", value: stats.today_joined },
                { label: "This Week", value: stats.week_joined },
                { label: "This Month", value: stats.month_joined },
                { label: "Active", value: stats.active_users },
                { label: "Inactive", value: stats.inactive_users },
                { label: "On Hold", value: stats.hold_users },
            ]
            : [
                { label: "Total Investors", value: stats.total_investors },
                {
                    label: "Total Investment",
                    value: `₹${(stats.total_investment || 0).toLocaleString()}`,
                },
                {
                    label: "Total Return",
                    value: `₹${(stats.total_return || 0).toLocaleString()}`,
                },
            ];

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            {statItems.map((item, index) => (
                <Paper
                    key={index}
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
                        {item.value ?? 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {item.label}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}
