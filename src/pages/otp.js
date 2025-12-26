"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import OtpTransactions from "@/components/Otp/Otp";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Paper
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import MessageIcon from "@mui/icons-material/Message";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";

function OtpReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [masterReport, setmasterReport] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      setLoading(true);
      try {
        const response = await api.post("/api/report/7a20aecd2cb38bc00e301d11d10224588104c366");

        console.log("Encrypted API Response:", response.data);

        if (response.status === 200) {
          // 🔓 Decrypt the encrypted payload
          const decryptedData = DataDecrypt(response.data.data);

          console.log("Decrypted Data:", decryptedData);

          // Extract values after decryption
          setShowServiceTrans(decryptedData.otpResult || []);
          setmasterReport(decryptedData.report || {});
        } else {
          console.error("Failed to fetch OTP data");
        }
      } catch (error) {
        console.error("Error fetching OTP data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      getTnx();
    }
  }, [uid]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedCategory("");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/report/7a20aecd2cb38bc00e301d11d10224588104c366");
      if (response.status === 200) {
        setShowServiceTrans(response.data.otpResult || []);
        setmasterReport(response.data.report || {});
      }
    } catch (error) {
      console.error("Error refreshing OTP data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from OTP data
  const uniqueCategories = [...new Set(showServiceTrans.map(otp => otp.category))].filter(Boolean);

  // Filter OTP data based on search term, status, and category
  const filteredOtpData = showServiceTrans.filter(otp => {
    const matchesSearch =
      otp.mobile?.includes(searchTerm) ||
      otp.otp?.includes(searchTerm) ||
      otp.first_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      otp.last_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      otp.mlm_id?.toLowerCase()?.includes(searchTerm.toLowerCase());

    // Status mapping based on your data: 0 = expired, 1 = active
    const matchesStatus = selectedStatus === "" ||
      (selectedStatus === "active" && otp.status === 1) ||
      (selectedStatus === "expired" && otp.status === 0);

    const matchesCategory = selectedCategory === "" || otp.category === selectedCategory;

    // Date filtering based on created_on field
    const otpDate = dayjs(otp.created_on);
    const matchesFromDate = !fromDate || otpDate.isAfter(fromDate.subtract(1, 'day'));
    const matchesToDate = !toDate || otpDate.isBefore(toDate.add(1, 'day'));

    return matchesSearch && matchesStatus && matchesCategory && matchesFromDate && matchesToDate;
  });

  // Compact Stats Cards with hover effects
  const cards = [
    {
      label: "Total OTP",
      value: masterReport.totalSms ?? 0,
      color: "#FF6B35",
      icon: <MessageIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF2ED"
    },
    {
      label: "Expired",
      value: masterReport.totalExpsms ?? 0,
      color: "#5C6BC0",
      icon: <TimerOffIcon sx={{ fontSize: 20 }} />,
      bgColor: "#F0F2FF"
    },
    {
      label: "Active",
      value: masterReport.totalActivesms ?? 0,
      color: "#26A69A",
      icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    }
  ];

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedCategory ? 1 : 0);

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
            OTP Report
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
              onClick={handleRefreshData}
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

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Loading OTP data...
            </Typography>
          </Box>
        )}

        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={4} key={index}>
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
                placeholder="Search mobile, OTP, name..."
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
                  value={selectedStatus}
                  label="Status"
                  onChange={handleStatusChange}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active (Status 1)</MenuItem>
                  <MenuItem value="expired">Expired (Status 0)</MenuItem>
                </Select>
              </FormControl>

              {/* Category Filter */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {uniqueCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
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
                {activeFilterCount > 0 && (
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
                )}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Results Summary */}
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
            Showing {filteredOtpData.length} of {showServiceTrans.length} OTP records
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
            {selectedStatus && (
              <Chip
                label={`Status: ${selectedStatus}`}
                size="small"
                onDelete={() => setSelectedStatus('')}
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${selectedCategory}`}
                size="small"
                onDelete={() => setSelectedCategory('')}
              />
            )}
          </Box>
        </Box>


      </Box>
      {/* Table Section */}
      <OtpTransactions
        showServiceTrans={filteredOtpData}
        searchTerm={searchTerm}
      />
    </Layout>
  );
}

export default withAuth(OtpReport);