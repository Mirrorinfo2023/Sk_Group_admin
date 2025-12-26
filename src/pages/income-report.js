"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import IncomeTransactions from "@/components/IncomeReport/IncomeReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  IconButton,
  Chip,
  Button
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RedeemIcon from "@mui/icons-material/Redeem";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

// Custom hook for debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

function IncomeReport(props) {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedValue, setSelectedValue] = useState("");

  const getTnx = useCallback(async () => {
    setLoading(true);
    setStatsLoading(true);

    try {
      // 1️⃣ Create payload
      const payload = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      // 2️⃣ Encrypt request
      const reqData = {
        data: DataEncrypt(JSON.stringify(payload)),
      };

      // 3️⃣ API request
      const response = await api.post("/api/refferal-report/94321e354e0da498f5c5792bf3f1be0e5d993d1f", reqData);

      if (response.status === 200) {

        // 4️⃣ Decrypt backend response
        const decryptedString = DataDecrypt(response.data.data);
        const decrypted = decryptedString;
        console.log("decrypted ", decrypted)
        setShowServiceTrans(decrypted.data || []);
        setReport(decrypted.report || null);
      }

    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [fromDate, toDate, dispatch]);

  useEffect(() => {
    getTnx();
  }, [getTnx]);

  const filteredRows = useMemo(() => {
    if (!Array.isArray(showServiceTrans) || showServiceTrans.length === 0) {
      return [];
    }

    let result = [...showServiceTrans];

    if (selectedValue) {
      result = result.filter(row =>
        row.plan_name &&
        row.plan_name.toLowerCase() === selectedValue.toLowerCase()
      );
    }

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(row =>
        (row.name && row.name.toLowerCase().includes(term)) ||
        (row.mlm_id && row.mlm_id.includes(term)) ||
        (row.mobile && row.mobile.includes(term)) ||
        (row.transaction_id && row.transaction_id.includes(term)) ||
        (row.type && row.type.toLowerCase().includes(term)) ||
        (row.tran_for && row.tran_for.toLowerCase().includes(term)) ||
        (row.details && row.details.toLowerCase().includes(term))
      );
    }

    return result;
  }, [showServiceTrans, selectedValue, debouncedSearchTerm]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handlePlanChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedValue("");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const handleQuickFilter = (days) => {
    setFromDate(dayjs().subtract(days, 'day'));
    setToDate(dayjs());
  };

  const cards = [
    {
      label: "Total Income",
      value: report?.total_incomeCount ?? 0,
      color: "#FF6B35",
      icon: <LeaderboardIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF2ED"
    },
    {
      label: "Repurchase",
      value: report?.total_repurchaseCount ?? 0,
      color: "#2196F3",
      icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E3F2FD"
    },
    {
      label: "Affiliate Wallet",
      value: report?.total_affiliateToWallet ?? 0,
      color: "#4CAF50",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    },
    {
      label: "Redeem",
      value: report?.total_RedeemCount ?? 0,
      color: "#9C27B0",
      icon: <RedeemIcon sx={{ fontSize: 20 }} />,
      bgColor: "#F3E5F5"
    }
  ];

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedValue ? 1 : 0);

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
            Income Report
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Quick Date Filters */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[{ label: '1D', days: 1 }, { label: '7D', days: 7 }, { label: '30D', days: 30 }].map((item) => (
                <Button
                  key={item.days}
                  size="small"
                  onClick={() => handleQuickFilter(item.days)}
                  disabled={loading}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    fontSize: '0.7rem',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                    '&:disabled': { opacity: 0.5 }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <IconButton
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              disabled={loading}
              sx={{
                backgroundColor: showFilters ? '#2196f3' : '#f5f5f5',
                color: showFilters ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: showFilters ? '#1976d2' : '#e0e0e0'
                },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              <TuneIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={getTnx}
              disabled={loading}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Box>
        </Box>

        {/* Compact Stats Cards with Loader */}
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
                position: 'relative',
                overflow: 'hidden',
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
                {/* Loader Overlay */}
                {statsLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: card.color }} />
                  </Box>
                )}

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
                    {statsLoading ? (
                      <Box component="span" sx={{ opacity: 0.5 }}>
                        --
                      </Box>
                    ) : (
                      card.value
                    )}
                  </Typography>
                </Box>
                <Box className="card-icon" sx={{
                  color: card.color,
                  transition: 'color 0.3s ease',
                  opacity: statsLoading ? 0.3 : 1
                }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filters Section with Loader */}
        {showFilters && (
          <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa', position: 'relative' }}>
            {/* Filters Loader */}
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(248, 249, 250, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  borderRadius: 1,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}

            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Search Field */}
              <TextField
                placeholder="Search transactions..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={loading}
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

              {/* Plan Filter */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Prime Plan</InputLabel>
                <Select
                  value={selectedValue}
                  label="Prime Plan"
                  onChange={handlePlanChange}
                  disabled={loading}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All Plans</MenuItem>
                  <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                  <MenuItem value="Booster Prime">Booster Plan</MenuItem>
                  <MenuItem value="Prime">Prime</MenuItem>
                  <MenuItem value="Prime B">Prime B</MenuItem>
                  <MenuItem value="Royality">Royality</MenuItem>
                  <MenuItem value="Repurchase">Repurchase</MenuItem>
                  <MenuItem value="Redeem">Redeem</MenuItem>
                </Select>
              </FormControl>

              {/* Date Range */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD/MM/YY"
                    onChange={handleFromDateChange}
                    disabled={loading}
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
                    disabled={loading}
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
                <button
                  onClick={getTnx}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#ccc' : '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    height: '36px',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={14} color="inherit" />
                      Applying...
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
                <button
                  onClick={handleResetFilters}
                  disabled={loading}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    height: '36px',
                    minWidth: '80px',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  Reset
                </button>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Results Summary with Loader */}
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={12} />
                Loading transactions...
              </Box>
            ) : (
              `Showing ${filteredRows.length} of ${showServiceTrans.length} transactions`
            )}
          </Typography>

          {/* Active Filter Chips */}
          {!loading && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                />
              )}
              {selectedValue && (
                <Chip
                  label={`Plan: ${selectedValue}`}
                  size="small"
                  onDelete={() => setSelectedValue('')}
                />
              )}
            </Box>
          )}
        </Box>

      </Box>

      {/* Main Content Loader or Table Section */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
            gap: 2
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading income report data...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
            Please wait while we fetch your data
          </Typography>
        </Box>
      ) : (
        <IncomeTransactions showServiceTrans={filteredRows} />
      )}
    </Layout>
  );
}

export default withAuth(IncomeReport);