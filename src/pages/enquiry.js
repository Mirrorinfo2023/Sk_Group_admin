"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Dashboard/layout";
import withAuth from "../../utils/withAuth";
import api from "../../utils/api";

import {
    Grid,
    Typography,
    Box,
    Card,
    IconButton,
    Alert,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";

import {
    Leaderboard,
    Search,
    Refresh,
    Tune
} from "@mui/icons-material";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import EnquiryTable from "@/components/SKSitesEnquiry/EnquiryTable";

dayjs.extend(isBetween);

function EnquiryReport() {
    const today = dayjs();

    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [filterColumn, setFilterColumn] = useState("all");
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    const [fromDate, setFromDate] = useState(today.startOf("month"));
    const [toDate, setToDate] = useState(today);

    // 🔹 Stats
    const calculateStats = (data) => ({
        total_count: data.length,
    });

    // 🔹 Fetch enquiries
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const payload = {
                    from_date: fromDate ? fromDate.format("YYYY-MM-DD") : null,
                    to_date: toDate ? toDate.format("YYYY-MM-DD") : null,
                };

                const res = await api.post(
                    "/api/sksites/get-enquiries-report",
                    payload
                );

                if (res.status === 200) {
                    setAllData(res.data.data || []);
                    setFilteredData(res.data.data || []);
                    setReport(res.data.report || {});
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load enquiries");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fromDate, toDate]); // 👈 re-fetch when date changes


    // 🔹 Filters
    useEffect(() => {
        let data = [...allData];

        // Date filter
        if (fromDate && toDate) {
            data = data.filter((row) =>
                dayjs(row.createdAt).isBetween(
                    fromDate.startOf("day"),
                    toDate.endOf("day"),
                    null,
                    "[]"
                )
            );
        }

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter((row) => {
                if (filterColumn === "all") {
                    return (
                        row.full_name?.toLowerCase().includes(term) ||
                        row.mobile?.includes(term) ||
                        row.email?.toLowerCase().includes(term) ||
                        row.reason?.toLowerCase().includes(term)
                    );
                }
                return row[filterColumn]?.toString().toLowerCase().includes(term);
            });
        }

        // Sort
        if (sortColumn) {
            data.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                x = x ? x.toString().toLowerCase() : "";
                y = y ? y.toString().toLowerCase() : "";
                return sortDirection === "asc" ? x.localeCompare(y) : y.localeCompare(x);
            });
        }

        setFilteredData(data);
        setReport(calculateStats(data));
    }, [allData, searchTerm, filterColumn, sortColumn, sortDirection, fromDate, toDate]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilterColumn("all");
        setSortColumn("");
        setSortDirection("asc");
        setFromDate(today.startOf("month"));
        setToDate(today);
    };

    return (
        <Layout>
            <Box p={3}>
                <Typography variant="h4" fontWeight={800} mb={3}>
                    Enquiry Report
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {/* Stats */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ p: 2 }}>
                            <Typography>Total Enquiries</Typography>
                            <Typography variant="h4">{report.total_count || 0}</Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            placeholder="Search enquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <Search /> }}
                        />
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Search In</InputLabel>
                            <Select
                                value={filterColumn}
                                label="Search In"
                                onChange={(e) => setFilterColumn(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="full_name">Full Name</MenuItem>
                                <MenuItem value="mobile">Mobile</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="reason">Reason</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="From" value={fromDate} onChange={setFromDate} />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="To" value={toDate} onChange={setToDate} />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={1}>
                        <Button fullWidth onClick={resetFilters}>Reset</Button>
                    </Grid>
                </Grid>

                {loading && <CircularProgress />}

                {/* Table */}
                <EnquiryTable
                    rows={filteredData}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(EnquiryReport);
