import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Box,
    Typography,
    Button,
    Chip,
    Card,
    CardContent,
} from "@mui/material";
import { Edit, Delete, Refresh, VisibilityOff } from "@mui/icons-material";

import api from "../../../utils/api";
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function UpdatesTable({ updates, loading, onEdit, onDelete, onRefresh, handleHide }) {
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }
    console.log("updates", updates)



    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight="bold">
                        Todays Updates ({updates.length})
                    </Typography>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={onRefresh}>
                        Refresh
                    </Button>
                </Box>

                {updates.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography color="text.secondary">No updates found</Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }}>Title</TableCell>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }}>Tags</TableCell>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }}>Image</TableCell>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }}>Date</TableCell>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }}>status</TableCell>
                                    <TableCell sx={{ fontSize: 13, py: 0.5 }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updates.map((u, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={{ fontSize: 13, py: 0.7 }}>{u.title}</TableCell>
                                        <TableCell sx={{ fontSize: 13, py: 0.7 }}>
                                            {u.tags
                                                ? u.tags.split(",").map((tag, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={tag.trim()}
                                                        size="small"
                                                        sx={{ mr: 0.5, height: 20, fontSize: 10 }}
                                                    />
                                                ))
                                                : "-"}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.7 }}>
                                            {u.image_url ? (
                                                <Button

                                                    size="small"
                                                    onClick={() => window.open(baseurl + u.image_url, "_blank")}
                                                    sx={{ fontSize: 10, textTransform: "none" }}
                                                >
                                                    View Image
                                                </Button>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>

                                        <TableCell sx={{ fontSize: 13, py: 0.7 }}>
                                            {formatDate(u.created_on || new Date())}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.7 }}>
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    px: 1.5,
                                                    py: 0.3,
                                                    borderRadius: 1,
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: u.is_active === 1 ? "green" : "red",
                                                    border: `1px solid ${u.is_active === 1 ? "green" : "red"}`,
                                                    textAlign: "center",
                                                    minWidth: 60
                                                }}
                                            >
                                                {u.is_active === 1 ? "Active" : "Inactive"}
                                            </Box>
                                        </TableCell>


                                        <TableCell align="center" sx={{ py: 0.7 }}>
                                            <Button
                                                color="warning"
                                                size="small"
                                                startIcon={<VisibilityOff />}
                                                sx={{ minWidth: 0, fontSize: 13, mr: 0.5 }}
                                                onClick={() => handleHide(u.id)}
                                            >

                                            </Button>


                                            <Button
                                                color="primary"
                                                size="small"
                                                startIcon={<Edit />}
                                                sx={{ minWidth: 0, fontSize: 13, mr: 0.5 }}
                                                onClick={() => onEdit(u)}
                                            >

                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                startIcon={<Delete />}
                                                sx={{ minWidth: 0, fontSize: 13 }}
                                                onClick={() => onDelete(u.id)}
                                            >

                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                )}
            </CardContent>
        </Card>
    );
}
