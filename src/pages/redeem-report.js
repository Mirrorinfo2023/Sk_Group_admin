"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RedeemTransactions from "@/components/RedeemReport/RedeemReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

function RedeemReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [report, setReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    getRedeemReport();
  }, [fromDate, toDate, dispatch]);

  const getRedeemReport = async () => {
    setLoading(true);
    try {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      console.log("📤 Original Request Data:", reqData);

      // 🔒 Encrypt before sending
      const encryptedPayload = {
        data: DataEncrypt(JSON.stringify(reqData))
      };

      console.log("🔐 Encrypted Payload:", encryptedPayload);

      const response = await api.post("/api/report/fc65092846f39a738cff7c2b2f630ac01e981980", encryptedPayload);

      console.log("📥 Raw API Response:", response);

      // 🔓 Decrypt response data
      if (response.data?.data) {
        console.log("🔑 Encrypted Response Data:", response.data.data);

        try {
          const decryptedData = DataDecrypt(response.data.data);
          console.log("🔓 Decrypted String:", decryptedData);

          // ✅ FIXED: Check if DataDecrypt returns object or string
          let decryptedResponse;
          if (typeof decryptedData === 'string') {
            decryptedResponse = JSON.parse(decryptedData);
          } else {
            decryptedResponse = decryptedData;
          }

          console.log("📋 Parsed Decrypted Response:", decryptedResponse);

          if (decryptedResponse.status === 200 || response.status === 200) {
            setShowServiceTrans(decryptedResponse.data || []);
            setReport(decryptedResponse.report || {});

            dispatch(
              callAlert({
                message: "Redeem report loaded successfully",
                type: "SUCCESS"
              })
            );
          } else {
            dispatch(
              callAlert({
                message: decryptedResponse.message || "Failed to load data",
                type: "FAILED"
              })
            );
          }
        } catch (decryptError) {
          console.error("❌ Decryption Error:", decryptError);

          // Fallback: Try direct response if decryption fails
          if (response.data.data && Array.isArray(response.data.data)) {
            console.log("🔄 Using direct response data");
            setShowServiceTrans(response.data.data || []);
            setReport(response.data.report || {});
          } else {
            throw new Error("Data decryption failed");
          }
        }
      } else {
        // If no encryption, use direct response
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setReport(response.data.report || {});
        }
      }
    } catch (error) {
      console.error("❌ Error fetching redeem report:", error);
      if (error?.response?.data?.error) {
        dispatch(
          callAlert({
            message: error.response.data.error,
            type: "FAILED"
          })
        );
      } else {
        dispatch(
          callAlert({
            message: error.message || "Failed to fetch redeem report",
            type: "FAILED"
          })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  // ✅ FIXED: Safe filtering with null checks
  const filteredRows = showServiceTrans.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      (row?.first_name?.toLowerCase() || '').includes(searchTermLower) ||
      (row?.last_name?.toLowerCase() || '').includes(searchTermLower) ||
      (row?.mlm_id?.toString() || '').includes(searchTerm) ||
      (row?.mobile?.toString() || '').includes(searchTerm) ||
      (row?.category?.toString() || '').includes(searchTermLower);

    // Convert numeric status into text mapping
    const statusText =
      row?.status === 0 ? "pending" :
        row?.status === 1 ? "approved" :
          row?.status === 2 ? "rejected" :
            "unknown";

    const matchesStatus =
      statusFilter === "all" || statusFilter === statusText;

    return matchesSearch && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await getRedeemReport();
    } catch (e) {
      console.error("Refresh failed:", e);
    }
  };


  // Compact Stats Cards
  const cards = [
    {
      label: "Total Redeem",
      value: report?.total_redeemcount ?? 0,
      color: "#FF6B35",
      icon: <LeaderboardIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF2ED"
    },
    {
      label: "Rejected",
      value: report?.total_rejectedCount ?? 0,
      color: "#F44336",
      icon: <CancelIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFEBEE"
    },
    {
      label: "Pending",
      value: report?.total_pendingCount ?? 0,
      color: "#FF9800",
      icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF3E0"
    },
    {
      label: "Approved",
      value: report?.total_approveCount ?? 0,
      color: "#4CAF50",
      icon: <DeleteForeverIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    }
  ];

  const activeFilterCount = (searchTerm ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <Layout>
      <Box sx={{ p: 1.5 }}>
        {/* Header with Title and Actions */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{
            fontWeight: "bold",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '18px'
          }}>
            Redeem Report
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters ? '#2196f3' : '#f5f5f5',
                color: showFilters ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: showFilters ? '#1976d2' : '#e0e0e0'
                }
              }}
            >
              <TuneIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loading redeem report...
            </Typography>
          </Box>
        )}

        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                backgroundColor: card.bgColor,
                borderLeft: `4px solid ${card.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${card.color}40`,
                  backgroundColor: card.color,
                  '& .card-label': {
                    color: '#fff !important',
                  },
                  '& .card-value': {
                    color: '#fff !important',
                  },
                  '& .card-icon': {
                    color: '#fff !important',
                  }
                }
              }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography className="card-label" variant="subtitle2" sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#666',
                    mb: 0.5,
                    transition: 'color 0.3s ease'
                  }}>
                    {card.label}
                  </Typography>
                  <Typography className="card-value" sx={{
                    color: '#000',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1,
                    transition: 'color 0.3s ease'
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="card-icon" sx={{
                  color: card.color,
                  transition: 'color 0.3s ease'
                }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filters Section */}
        {showFilters && (
          <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Search Field */}
              <TextField
                placeholder="Search name, mobile, ID..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                }}
                sx={{
                  width: "200px",
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              {/* Date Range */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD/MM/YY"
                    onChange={handleFromDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "From",
                        sx: {
                          width: 110,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    format="DD/MM/YY"
                    onChange={handleToDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "To",
                        sx: {
                          width: 110,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* <button
                  onClick={handleRefresh}
                  disabled={loading}
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    height: '36px',
                    minWidth: '80px',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button> */}

                <button
                  onClick={handleResetFilters}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    height: '36px',
                    minWidth: '80px'
                  }}
                >
                  Reset
                </button>

              </Box>
            </Box>
          </Paper>
        )}

        {/* Results Summary */}
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
            Showing {filteredRows.length} of {showServiceTrans.length} requests
          </Typography>

          {/* Active Filter Chips */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Search: ${searchTerm}`}
                size="small"
                onDelete={() => setSearchTerm('')}
              />
            )}
            {statusFilter !== 'all' && (
              <Chip
                label={`Status: ${statusFilter}`}
                size="small"
                onDelete={() => setStatusFilter('all')}
              />
            )}
          </Box>
        </Box>

        {/* Table Section */}
        <RedeemTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(RedeemReport);