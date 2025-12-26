"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import NotificationTransactions from "@/components/Notification/Notification";
import {
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  Card,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search, Refresh, Tune, Add, Leaderboard, CheckCircle, MarkEmailRead } from "@mui/icons-material";

const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "flex-start",
}));

function NotificationReport() {
  const dispatch = useDispatch();

  // Client-safe state
  const [isClient, setIsClient] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs());

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch notification data with encryption
  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      setError("");

      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
        const response = await api.post("/api/notification/5dfe9b4e98a6db4b15d381d44d2ebaa1b965a70f", {
          data: encryptedPayload,
        });

        if (response.data && response.data.data) {
          const decryptedData = DataDecrypt(response.data.data);
          setShowServiceTrans(decryptedData.notificationResult || []);
          setMasterReport(decryptedData.report || {});
        } else {
          setError("Failed to fetch notification data");
        }
      } catch (err) {
        const errorMessage = err?.response?.data?.error || err.message || "Network error";
        setError(errorMessage);
        dispatch(callAlert({ message: errorMessage, type: "FAILED" }));
      } finally {
        setLoading(false);
      }
    };

    if (fromDate || toDate) {
      getNotifications();
    }
  }, [fromDate, toDate, dispatch]);

  // Filter data based on search term
  const filteredRows = showServiceTrans.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.keys(row).some((key) =>
      row[key]?.toString().toLowerCase().includes(term)
    );
  });

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    setToDate(dayjs());
  };

  // Refresh data
  const handleRefresh = () => window.location.reload();

  // Stats cards
  const statsCards = [
    {
      label: "Total Notifications",
      value: masterReport.totalCount ?? 0,
      color: "#667eea",
      icon: <Leaderboard sx={{ fontSize: 24 }} />,
      bgColor: "#F0F2FF",
    },
    {
      label: "Successfully Sent",
      value: masterReport.totalSuccessFcm ?? 0,
      color: "#4CAF50",
      icon: <CheckCircle sx={{ fontSize: 24 }} />,
      bgColor: "#E8F5E8",
    },
    {
      label: "Received",
      value: masterReport.totalReceivedFcm ?? 0,
      color: "#FF9800",
      icon: <MarkEmailRead sx={{ fontSize: 24 }} />,
      bgColor: "#FFF3E0",
    },
  ];

  const hasDateFilter =
    isClient &&
    (fromDate?.startOf("month")?.valueOf() !== dayjs().startOf("month").valueOf() ||
      toDate?.valueOf() !== dayjs().valueOf());

  const activeFilterCount = [searchTerm].filter(Boolean).length;

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Notification Report
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: showFilters ? "primary.main" : "grey.100",
                color: showFilters ? "white" : "grey.700",
                "&:hover": {
                  bgcolor: showFilters ? "primary.dark" : "grey.200",
                },
              }}
            >
              <Tune fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                bgcolor: "grey.100",
                color: "grey.700",
                "&:hover": { bgcolor: "grey.200" },
                "&:disabled": { opacity: 0.5 },
              }}
            >
              {loading ? <CircularProgress size={20} /> : <Refresh fontSize="small" />}
            </IconButton>

            <Button
              variant="contained"
              href="/add-new-notification/"
              startIcon={<Add />}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                px: 2,
                py: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                },
              }}
            >
              Add New
            </Button>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <IconButton size="small" onClick={() => setError("")}>
                <CheckCircle fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  p: 2,
                  backgroundColor: card.bgColor,
                  borderLeft: `4px solid ${card.color}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#666",
                      mb: 0.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "#000",
                      lineHeight: 1.1,
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ color: card.color, ml: 1 }}>{card.icon}</Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        {showFilters && (
          <Card sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <TextField
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "grey.500", mr: 1 }} />,
                }}
                sx={{ minWidth: 200 }}
                size="small"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <DatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small", label: "From Date", sx: { width: 140 } } }}
                  />
                  <Typography variant="body2" sx={{ color: "grey.600", mx: 1 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    onChange={setToDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small", label: "To Date", sx: { width: 140 } } }}
                  />
                </Box>
              </LocalizationProvider>

              {(activeFilterCount > 0 || hasDateFilter) && (
                <Box
                  onClick={handleResetFilters}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "grey.600",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    "&:hover": { color: "grey.800" },
                  }}
                >
                  <Refresh fontSize="small" />
                  Clear Filters
                </Box>
              )}
            </Box>
          </Card>
        )}

        {/* Results summary */}
        {isClient && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "grey.600" }}>
              Showing {filteredRows.length} of {showServiceTrans.length} notifications
              {hasDateFilter && ` (filtered by date range)`}
              {loading && " (Loading...)"}
            </Typography>
          </Box>
        )}

        {/* Table */}
        <NotificationTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(NotificationReport);
